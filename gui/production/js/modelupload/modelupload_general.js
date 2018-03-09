/** Prints general table row to tbody elem from json str */
function printModelTableRow(tbodyidentifier,jsonStr) {
    //Method: Extract important values from jsonStr and set it to tableRow template below
    var jsonObj = "";
    if (jsonStr !== "") {
        jsonObj = JSON.parse(jsonStr); //parse str to json obj
    } else {
        //use default (just for testing
        jsonObj = $.getJSON("http://localhost/fh_modelmanagement/data/sampledata_1.json");
    }

    /** Extract values from parsed json obj (extracted here, to make method more readable)*/
    var description = jsonObj["description"];
    var creator = jsonObj["creator"];
    var owner = jsonObj["owner"];
    var createDate = jsonObj["createDate"];
    var fileSize = jsonObj["fileSize"];


    $(tbodyidentifier).html("<tr><td>#</td><td><a>"+description+"</a><br/>" +
        "<small data-toggle='tooltip' data-placement='top' title='Owner: "+owner+" / Creator: "+creator+"'>Created on "+createDate+"</small>" +
        "</td><td><ul class='list-inline'><li><!-- TODO: Use from JSON for TOOLTIP! -->" +
        "<img src='images/user.png' class='avatar' alt='Avatar' data-toggle='tooltip' data-placement='top' title='Compression UID or additional data'></li><li>" +
        "<img src='images/user.png' class='avatar' alt='Avatar' data-toggle='tooltip' data-placement='top' title='Compression UID or additional data'></li><li>" +
        "<img src='images/user.png' class='avatar' alt='Avatar' data-toggle='tooltip' data-placement='top' title='Compression UID or additional data'></li><li>" +
        "<img src='images/user.png' class='avatar' alt='Avatar' data-toggle='tooltip' data-placement='top' title='Compression UID or additional data'></li></ul></td>" +
        "<td><button type='button' class='btn btn-success btn-xs'>Success</button></td>" +
        "<td>0 Bytes <!-- TODO: Use from JSON --></td>" +
        "<td><a href='#' class='btn btn-primary btn-xs'><i class='fa fa-folder'></i> View </a>" +
        "<a href='#' class='btn btn-info btn-xs'><i class='fa fa-pencil'></i>Edit </a>" +
        "<a href='#' class='btn btn-danger btn-xs'><i class='fa fa-trash-o'></i> Delete </a></td></tr>").fadeIn('slow');
    console.log("Tried to execute printModelTableRow(): "+tbodyidentifier+";;"+jsonObj);
}