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
        "<td><a href='#' class='btn btn-primary btn-xs'><i class='fa fa-folder'></i> View </a>" +
        "<a href='#' class='btn btn-info btn-xs' onclick='selectModel(&apos;"+objectTripleUUID+"&apos;)'><i class='fa fa-pencil'></i> Add</a>" +
        "<a href='#' class='btn btn-danger btn-xs'><i class='fa fa-trash-o'></i> Delete </a></td></tr>").fadeIn('slow');
    //console.log("Tried to execute printModelTableRow(): "+tbodyidentifier+";;"+JSON.stringify(jsonObj));
}

/** Prints search results so just give all JsonObjs as an Array to this method :)*/
function printAllModelTableRows(tbodyidentifier, jsonObjs) {
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
    if (objectTrippleUUID !== null) {
        console.log('Received selected model with id: '+objectTrippleUUID);
        //TODO: Do here sth stuff (e.g. send to basket with ajax or similar etc.)


    } else {
        console.error('Could not select model, bc. objectTrippleUUID is null!');
    }
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