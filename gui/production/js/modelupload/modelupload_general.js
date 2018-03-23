var selectedObj; //used to keep track which elem is selected (i think it is less error prone than determining the bgColor)

/** Prints general table row to tbody elem from json str */
function printModelTableRow(tbodyidentifier,jsonObj) {
    /** Extract values from parsed json obj (extracted here, to make method more readable)*/
    var objectTripleUUID = jsonObj["objectTripleID"];
    var description = jsonObj["description"];
    var creator = jsonObj["creator"];
    var owner = jsonObj["owner"];
    var createDate = jsonObj["createDate"];
    var fileSize = jsonObj["fileSize"];

    var compressionTypesList = "";
    //console.log("JsonObjFiles length: "+Object.keys(jsonObj["files"]).length);
    for (var index = 0; index < Object.keys(jsonObj["files"]).length; ++index) {
        //TODO: place here relevant ata to string
        compressionTypesList += "<li><img src='images/user.png' class='avatar' alt='Avatar' data-toggle='tooltip' data-placement='top' title='Your compression title'></li>";
        //console.log("Added string to types list. ");
    }

    //objectTripleUUID as Row ID, so we can get id as reference when selecting an action btn
    var printFunction = $(tbodyidentifier).append("<tr id='"+objectTripleUUID+"'><td>#</td><td><a>"+description+"</a><br/>" +
        "<small data-toggle='tooltip' data-placement='top' title='Owner: "+owner+" / Creator: "+creator+"'>Created on "+createDate+"</small>" +
        "</td><td><ul class='list-inline'>"+compressionTypesList+"</ul></td>" +
        "<td><button type='button' class='btn btn-success btn-xs'>Active</button></td>" +
        "<td><a href='#' class='btn btn-info btn-xs' onclick='selectModel(&apos;"+objectTripleUUID+"&apos;)'><i class='fa fa-pencil'></i> Select</a></td></tr>").fadeIn('slow');
    //console.log("Tried to execute printModelTableRow(): "+tbodyidentifier+";;"+JSON.stringify(jsonObj));
}

/** Prints search results so just give all JsonObjs as an Array to this method :)*/
function printAllModelTableRows(tbodyidentifier, jsonObjs) {
    //Remove all previous content/rows of element (e.g. when searching for sth we only want filtered results)
    $(tbodyidentifier).html('');

    if (jsonObjs !== null) {
        if (Array.isArray(jsonObjs)) {
            for (var i = 0;i<jsonObjs.length;i++) {
                //console.log('Trying to print table row of provided array->'+JSON.stringify(jsonObjs[i]));
                printModelTableRow(tbodyidentifier,jsonObjs[i]);
            }
        } else {
            console.warn('Tried to print provided table row, but 2nd parameter was not an array as it was supposed to be.');
            printModelTableRow(tbodyidentifier,jsonObjs); //just try to print it (if not an array)
        }
    } else {
        console.error('Could not print table rows, because jsonObj[] is null!');
    }
}



/** This method is called when user clicks on ADD btn, so we can do here sth stuff
 * -> This method should send it's data to basket. After that the upload procedure can
 * start. */
function selectModel(objectTrippleUUID) {
    //Only select if not selected already and if not null
    if (objectTrippleUUID !== null && selectedObj !== objectTrippleUUID) {
        console.log('Received selected model with id: '+objectTrippleUUID);
        //Color selected row (now user has to click on next to upload a new compression
        colorOnlyProvidedObject(objectTrippleUUID);
        console.log('Tried to set bgcolor.');

        //Update heading for step 2 (usability)
        document.getElementById('step2_title').innerHTML += " for "+objectTrippleUUID;


        //TODO: Do here sth stuff (e.g. send to basket with ajax or similar etc.) and then receive HERE a valid json str
        var selectedModel = new ModelObj(receiveExampleJson()); //instead of example json place here queried json str
        console.log('Created selected obj: '+selectedModel.description);

        //Inform user that everything went well, BUT ONLY when this notification was not shown before in this session
        if (selectedObj === null || selectedObj === undefined) {
            new PNotify({
                title: 'Selected model.',
                text: 'Excellent! Now click on &apos;NEXT&apos; to upload a new compression.',
                type: 'info',
                styling: 'bootstrap3'
            });
        }

        selectedObj = objectTrippleUUID; //so we know which object was selected
    } else {
        console.error('Could not select model, bc. objectTrippleUUID is null!');
    }
}

/** @param searchTerm: e.g. "foo"
 * @param resultSet: contains all jsonObjs as array.
 *      I think the easiest thing just to provide resultSet as normal String-array (unparsed Jsons)
 *
 *      --> Search happens on Server and resultset gets delivered so in production just print resultSet with printAllTableRows()*/
function searchInResultSet(searchTerm,resultSet) {
    var filteredResultSet = [];

    if (resultSet !== undefined && resultSet !== null && searchTerm !== undefined && searchTerm !== null) {
        if (resultSet.constructor === [].constructor) {
            for (var i = 0; i < resultSet.length; i++) {
                //console.log('searchInResultSet:Search->'+JSON.stringify(resultSet[i]).toLowerCase()+" searching for "+searchTerm.toString().toLowerCase());
                if (JSON.stringify(resultSet[i]).toLowerCase().indexOf(searchTerm.toString().toLowerCase()) !== (-1)) {
                    //found sth
                    console.log('searchInResultSet: Found entry->'+resultSet[i]);
                    filteredResultSet.push(resultSet[i]);
                }
            }
            console.log('searchInResultSet: Length of resultSet->'+resultSet.length);
        } else {
            console.warn('searchInResultSet: Resultset is not an array.');
        }
    } else {
        console.warn('searchInResultSet: Resultset or searchterm equals null or undefined.');
    }
    console.log('searchInResultSet: searchResults->'+filteredResultSet);
    return filteredResultSet;
}


function colorOnlyProvidedObject(objectTrippleUUID) {
    var unselectedColor = "#f9f9f9";
    var selectedColor = "#FFFBCC";

    //uncolor old objects
    var allRows = document.getElementById('queriedmodels').children; //get all rows
    for (var i = 0;i < allRows.length; i++) {
        allRows[i].style.backgroundColor = unselectedColor;
    }

    //Color new object
    document.getElementById(objectTrippleUUID).style.backgroundColor = selectedColor;
}




// DUMMY DATA FOR TESTING ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/** Imitates server response with json strings. Server answer should be an String array of jsons. Should be already filtered.
 * In our case to simulate searching we just provide here a large resultset (different in future) and filter them with the search() method.*/
function provideTestResultSet() {
    var testResultSet = [];
    for (var i = 0;i<10;i++) {
        testResultSet.push(JSON.parse(receiveExampleJson()));
    }
    return testResultSet;
}

/** Supplies example json str (simulating that it comes from basket/server or similar */
function receiveExampleJson() {
    //Every line here is just for testing purpose
    console.log('Trying to craft json string. ');
    var randomSubId = Math.random()*10;
    return '{'+
        '"description": "This is an example description",'+
        '"objectTripleID": "TripleID'+randomSubId+'",'+
        '"mediaTripleID": "TripleID'+randomSubId+'",'+
        '"createDate": "date",'+
        '"creator": "string",'+
        '"owner": "string",'+
        '"MIMEtype": "string",'+
        '"files": {'+
        '"compressionUUID1'+randomSubId+'": {'+
        '"uploadDate": "'+(new Date().toLocaleString())+'",'+
        '"accessLevel": "accessLevel[public|private|visit]",'+
        '"license": "string",'+
        '"fileSize": "long",'+
        '"path": "string",'+
        '"fileTypeSpecificMeta": {'+
        '}'+
        '},'+
        '"compressionUUID2": {}'+
        '}'+
        '}';
}


/** Just for testing purpose (delete after server interaction) */
function printTestJsons(tbodyidentifier, jsonStr) {
    //Method: Extract important values from jsonStr and set it to tableRow template below
    var testResultSet = []; //Instead of this array the search results should be put in
    if (jsonStr !== "") {
        //console.log("Tried to parse provided json str.");
        testResultSet.push(JSON.parse(jsonStr)); //add test json to print
    } else {
        //use default (just for testing)
        testResultSet.push(JSON.parse('{"description":"This is an example description","objectTripleID":"TripleID","mediaTripleID":"TripleID","createDate":"date","creator":"string","owner":"string","MIMEtype":"string","files":{"compressionUUID1":{"uploadDate":"date","accessLevel":"accessLevel[public|private|visit]","license":"string","fileSize":"long","path":"string","fileTypeSpecificMeta":{}},"compressionUUID2":{}}}'));
    }
    printAllModelTableRows(tbodyidentifier, testResultSet);
}