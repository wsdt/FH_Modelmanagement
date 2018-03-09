/** Prints general table row to tbody elem from json str */
function printModelTableRow(tbodyidentifier,jsonObj) {
    /** Extract values from parsed json obj (extracted here, to make method more readable)*/
    var description = jsonObj["description"];
    var creator = jsonObj["creator"];
    var owner = jsonObj["owner"];
    var createDate = jsonObj["createDate"];
    var fileSize = jsonObj["fileSize"];

    var compressionTypesList = "";
    console.log("JsonObjFiles length: "+Object.keys(jsonObj["files"]).length);
    for (var index = 0; index < Object.keys(jsonObj["files"]).length; ++index) {
        //TODO: place here relevant ata to string
        compressionTypesList += "<li><img src='images/user.png' class='avatar' alt='Avatar' data-toggle='tooltip' data-placement='top' title='Your compression title'></li>";
        console.log("Added string to types list. ");
    }

    var printFunction = $(tbodyidentifier).html("<tr><td>#</td><td><a>"+description+"</a><br/>" +
        "<small data-toggle='tooltip' data-placement='top' title='Owner: "+owner+" / Creator: "+creator+"'>Created on "+createDate+"</small>" +
        "</td><td><ul class='list-inline'>"+compressionTypesList+"</ul></td>" +
        "<td><button type='button' class='btn btn-success btn-xs'>Success</button></td>" +
        "<td><a href='#' class='btn btn-primary btn-xs'><i class='fa fa-folder'></i> View </a>" +
        "<a href='#' class='btn btn-info btn-xs'><i class='fa fa-pencil'></i> Add</a>" +
        "<a href='#' class='btn btn-danger btn-xs'><i class='fa fa-trash-o'></i> Delete </a></td></tr>").fadeIn('slow');
    console.log("Tried to execute printModelTableRow(): "+tbodyidentifier+";;"+JSON.stringify(jsonObj));
}

/** Just for testing purpose (delete after server interaction) */
function printTestJsons(tbodyidentifier, jsonStr) {
    //Method: Extract important values from jsonStr and set it to tableRow template below
    var jsonObj = "";
    if (jsonStr !== "") {
        console.log("Tried to parse provided json str.");
        printModelTableRow(tbodyidentifier, JSON.parse(jsonStr));
    } else {
        //use default (just for testing)
        printModelTableRow(tbodyidentifier, JSON.parse('{"description":"This is an example description","objectTripleID":"TripleID","mediaTripleID":"TripleID","createDate":"date","creator":"string","owner":"string","MIMEtype":"string","files":{"compressionUUID1":{"uploadDate":"date","accessLevel":"accessLevel[public|private|visit]","license":"string","fileSize":"long","path":"string","fileTypeSpecificMeta":{}},"compressionUUID2":{}}}'))
    }
}