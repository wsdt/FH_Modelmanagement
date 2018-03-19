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
    var printFunction = $(tbodyidentifier).html("<tr id='"+objectTripleUUID+"'><td>#</td><td><a>"+description+"</a><br/>" +
        "<small data-toggle='tooltip' data-placement='top' title='Owner: "+owner+" / Creator: "+creator+"'>Created on "+createDate+"</small>" +
        "</td><td><ul class='list-inline'>"+compressionTypesList+"</ul></td>" +
        "<td><button type='button' class='btn btn-success btn-xs'>Success</button></td>" +
        "<td><a href='#' class='btn btn-info btn-xs' onclick='selectModel(&apos;"+objectTripleUUID+"&apos;)'><i class='fa fa-pencil'></i> Select</a></td></tr>").fadeIn('slow');
    //console.log("Tried to execute printModelTableRow(): "+tbodyidentifier+";;"+JSON.stringify(jsonObj));
}

/** Prints search results so just give all JsonObjs as an Array to this method :)*/
function printAllModelTableRows(tbodyidentifier, jsonObjs) {
    //removeInitialNotification(); //just assuming that printAllModelTableRows method is only called when page is reloaded.

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

/** Bug/Issue in this template, that initial notification always get's shown
 * --> acc. to internet, just remove it manually, but I solved this issue by removing: (I think rebuilding custom.js will also solve this issue, because
 * this line does not exist there)
 *
 * ",new PNotify({title:"PNotify",type:"info",text:"Welcome. Try hovering over me. You can click things behind me, because I'm non-blocking.",nonblock:{nonblock:!0},addclass:"dark",styling:"bootstrap3",hide:!1,before_close:function(a){return a.update({title:a.options.title+" - Enjoy your Stay",before_close:null}),a.queueRemove(),!1}})"
 *
 * from custom.min.js*/
/*function removeInitialNotification() {
    $(document).ready(function() {
       $('.ui-pnotify').remove();
    });
    console.log('Tried to remove initial notifications.');
}*/



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

        selectedObj = objectTrippleUUID; //so we know which object was selected

        //Update heading for step 2 (usability)
        document.getElementById('step2_title').innerHTML += " for "+objectTrippleUUID;


        //TODO: Do here sth stuff (e.g. send to basket with ajax or similar etc.)

        //Inform user that everything went well (Senseful?)
        new PNotify({
            title: 'Selected model.',
            text: 'Excellent! Now click on &apos;NEXT&apos; to upload a new compression.',
            type: 'info',
            styling: 'bootstrap3'
        });
    } else {
        console.error('Could not select model, bc. objectTrippleUUID is null!');
    }
}

/** TODO: Crafts json string of selected model (= selectedObj) */
function craftJsonOBJTRIPLEStr() {
    console.log('Trying to craft json string of: '+selectedObj);
    return '{'+
                '"description": "This is an example description",'+
                '"objectTripleID": "'+selectedObj+'",'+
                '"mediaTripleID": "TripleID",'+
                '"createDate": "date",'+
                '"creator": "string",'+
                '"owner": "string",'+
                '"MIMEtype": "string",'+
                '"files": {'+
                    '"compressionUUID1": {'+
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

/** Used for compressions. Will be embedded into files {} obj of objTriple (see craftJsonOBJTRIPLEStr()) */
function craftJsonCOMPRESSIONUUIDStr() {
    return '"compressionUUID1": {'+
    '"uploadDate": "'+(new Date().toLocaleString())+'",'+
    '"accessLevel": "accessLevel[public|private|visit]",'+
    '"license": "string",'+
    '"fileSize": "long",'+
    '"path": "string",'+
    '"fileTypeSpecificMeta": {'+
    '}'+
    '}';
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