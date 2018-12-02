let selectedObj; //used to keep track which elem is selected (i think it is less error prone than determining the bgColor)

/** Uploads a new compression */
function uploadNewCompression() {
    if (selectedObj !== undefined && selectedObj !== null) {

        console.log('Trying to get json string of selected modelobj. ');

        let modelObjPromise = ModelObj.getLocally(selectedObj); //is a modelObj not a string or json
        let randomSubId = "TripleID" + parseInt(Math.random() * 1000, 10);

        modelObjPromise.then(function(modelObj) {
            modelObj.saveNewCompression((new CompressionObj(randomSubId,
                '{"uploadDate": "' + (new Date().toLocaleString()) + '",' +
                '"accessLevel": "' + document.getElementById('accessLevels').value + '",' +
                '"license": "' + document.getElementById('license').value + '",' +
                '"fileSize": "long",' +
                '"path": "/data/compressions/' + randomSubId + '.comprFileExt",' +
                '"fileTypeSpecificMeta": {' +
                '}}'
            )));

            modelObj.saveLocally(); //save also locally
        });
    } else {
        console.warn('uploadNewCompression: Please select a model before you upload a new compression.')
    }
}

/** Prints general table row to tbody elem from json str */
function printModelTableRow(tbodyidentifier, modelObj) {
    let compressionTypesList = "";
    //console.log("JsonObjFiles length: "+Object.keys(jsonObj["files"]).length);
    let allCompressions = Object.keys(modelObj.files);
    for (let index = 0; index < allCompressions.length; ++index) {
        //TODO: place here relevant ata to string
        compressionTypesList += "<img src='../images/users/TEST.jpg' class='avatar' alt='Avatar' data-toggle='tooltip' data-placement='top' title='" + modelObj.getFile(allCompressions[index]).compressionUUID + "'>";
        //console.log("Added string to types list. ");
    }

    let printFunction = $(tbodyidentifier).append("<tr id='"+modelObj.objectTripleID+"'>"+
        "<td><a href='#' class='btn btn-info btn-xs' onclick='selectModel(&apos;" + modelObj.objectTripleID + "&apos;)'><i class='fa fa-pencil'></i> Select</a></td>"+
        "<td>"+modelObj.objectTripleID+"</td><td>"+modelObj.mediaTripleID+"</td>"+
        "<td>"+modelObj.description+"</td><td>"+modelObj.createDate+" by "+modelObj.creator+"</td>"+
        "<td>"+modelObj.owner+"</td><td>"+modelObj.MIMEtype+"</td><td>"+compressionTypesList+"</td></tr>").fadeIn('slow');

    //objectTripleUUID as Row ID, so we can get id as reference when selecting an action btn
    //console.log("Tried to execute printModelTableRow(): "+tbodyidentifier+";;"+JSON.stringify(jsonObj));
}

/** Prints search results so just give all ModelJsonObjs as an Array to this method :)*/
function printAllModelTableRows(tbodyidentifier, modelObjs) {
    //Remove all previous content/rows of element (e.g. when searching for sth we only want filtered results)
    $(tbodyidentifier).html('');

    if (modelObjs !== null && modelObjs !== undefined) {
        //ModelObjs is now a future! So we want to get it
        modelObjs.then(function(modelObjArr) {
            if (modelObjArr !== undefined && modelObjArr !== null) {
                for (let i = 0; i < modelObjArr.length; i++) {
                    //console.log('Trying to print table row of provided array->'+JSON.stringify(jsonObjs[i]));
                    printModelTableRow(tbodyidentifier, modelObjArr[i]);
                }
            } else {
                console.error('modelupload_general:printAllModelTableRows: Could not print table bc. resolved jsonObj[] is null|undefined (maybe no modelObjs at all saved).');
            }
        });
    } else {
        console.error('modelupload_general:printAllModelTableRows: Could not print table rows, because jsonObj[] promise is null!');
    }
}


/** This method is called when user clicks on ADD btn, so we can do here sth stuff
 * -> This method should send it's data to basket. After that the upload procedure can
 * start. */
function selectModel(objectTrippleUUID) {
    //TODO: ON SELECT GO DIRECTLY LIKE A LINK TO AN UPLOAD PAGE

    //Only select if not selected already and if not null
    if (objectTrippleUUID !== null && selectedObj !== objectTrippleUUID) {
        console.log('Received selected model with id: ' + objectTrippleUUID);
        //Color selected row (now user has to click on next to upload a new compression
        colorOnlyProvidedObject(objectTrippleUUID);
        console.log('Tried to set bgcolor.');

        //Update heading for step 2 (usability)
        document.getElementById('step2_title').innerHTML = "Step 2: Upload new compression for " + objectTrippleUUID;

        //TODO: Do here sth stuff (e.g. send to basket with ajax or similar etc.) and then receive HERE a valid json str

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
function searchInResultSet(searchTerm, resultSet) {
    console.log("search: "+resultSet+"//"+JSON.stringify(resultSet));

    let filteredResultSet = [];
    if (resultSet !== undefined && resultSet !== null && searchTerm !== undefined && searchTerm !== null) {
        //Result set is a promise!
        resultSet.then(function(resultSetValue) {
            console.log("search:: "+resultSetValue+"//"+JSON.stringify(resultSetValue));

            for (let i = 0; i < resultSetValue.length; i++) {
                console.log('search: '+searchTerm+"//"+JSON.stringify(resultSet)+JSON.stringify(resultSetValue[i]).toLowerCase()+"//"+JSON.stringify(resultSetValue).toLowerCase());

                //console.log('searchInResultSet:Search->'+JSON.stringify(resultSet[i]).toLowerCase()+" searching for "+searchTerm.toString().toLowerCase());
                  if (JSON.stringify(resultSetValue[i]).toLowerCase().indexOf(resultSetValue.toString().toLowerCase()) !== (-1)) {
                    //found sth
                    console.log('searchInResultSet: Found entry->' + resultSetValue[i]);
                    filteredResultSet.push(resultSetValue[i]);
                }
            }
            console.log('searchInResultSet: Length of resultSet->' + filteredResultSet.length);
        });
    } else {
        console.warn('searchInResultSet: Resultset or searchterm equals null or undefined.');
    }
    console.log('searchInResultSet: searchResults->' + JSON.stringify(filteredResultSet));
    return filteredResultSet;
}


function colorOnlyProvidedObject(objectTrippleUUID) {
    let unselectedColor = "#f9f9f9";
    let selectedColor = "#FFFBCC";

    //uncolor old objects
    let allRows = document.getElementById('queriedmodels').children; //get all rows
    for (let i = 0; i < allRows.length; i++) {
        allRows[i].style.backgroundColor = unselectedColor;
    }

    //Color new object
    document.getElementById(objectTrippleUUID).style.backgroundColor = selectedColor;
}


// DUMMY DATA FOR TESTING ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/** Imitates server response with json strings. Server answer should be an String array of jsons. Should be already filtered.
 * In our case to simulate searching we just provide here a large resultset (different in future) and filter them with the search() method.*/
function provideTestResultSet() {
    let testResultSet = [];
    for (let i = 0; i < 10; i++) {
        testResultSet.push(new ModelObj(JSON.parse(receiveExampleJson())));
    }
    return testResultSet;
}

/** Supplies example json str (simulating that it comes from basket/server or similar */
function receiveExampleJson() {
    //Every line here is just for testing purpose
    console.log('Trying to craft json string. ');
    let randomSubId = parseInt(Math.random() * 1000, 10);
    return '{' +
        '"description": "This is an example description",' +
        '"objectTripleID": "TripleID' + randomSubId + '",' +
        '"mediaTripleID": "TripleID' + randomSubId + '",' +
        '"createDate": "date",' +
        '"creator": "string",' +
        '"owner": "string",' +
        '"MIMEtype": "string",' +
        '"files": {' +
        '"compressionUUID' + randomSubId + '": {' +
        '"uploadDate": "' + (new Date().toLocaleString()) + '",' +
        '"accessLevel": "accessLevel[public|private|visit]",' +
        '"license": "string",' +
        '"fileSize": "long",' +
        '"path": "string",' +
        '"fileTypeSpecificMeta": {' +
        '}' +
        '}}}';
}