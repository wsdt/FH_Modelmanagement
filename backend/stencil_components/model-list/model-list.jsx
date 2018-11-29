"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@stencil/core");
var modelObj_es6_1 = require("./modelObj_es6");
require("../../../frontend/vendors/iCheck/icheck.min.js");
require("../../../frontend/vendors/datatables.net/js/jquery.dataTables.min.js");
require("../../../frontend/vendors/datatables.net-bs/js/dataTables.bootstrap.min.js");
require("../../../frontend/vendors/datatables.net-buttons/js/dataTables.buttons.min.js");
require("../../../frontend/vendors/datatables.net-buttons-bs/js/buttons.bootstrap.min.js");
require("../../../frontend/vendors/datatables.net-buttons/js/buttons.flash.min.js");
require("../../../frontend/vendors/datatables.net-buttons/js/buttons.html5.min.js");
require("../../../frontend/vendors/datatables.net-buttons/js/buttons.print.min.js");
require("../../../frontend/vendors/datatables.net-fixedheader/js/dataTables.fixedHeader.min.js");
require("../../../frontend/vendors/datatables.net-keytable/js/dataTables.keyTable.min.js");
require("../../../frontend/vendors/datatables.net-responsive/js/dataTables.responsive.min.js");
require("../../../frontend/vendors/datatables.net-responsive-bs/js/responsive.bootstrap.js");
require("../../../frontend/vendors/datatables.net-scroller/js/dataTables.scroller.min.js");
require("../../../frontend/vendors/jszip/dist/jszip.min.js");
require("../../../frontend/vendors/pdfmake/build/pdfmake.min.js");
require("../../../frontend/vendors/pdfmake/build/vfs_fonts.js");
var ModelList = /** @class */ (function () {
    function ModelList() {
    }
    ModelList_1 = ModelList;
    ModelList.prototype.render = function () {
        return <table id="datatable-buttons" class="table table-striped table-bordered">
          <thead>
          <tr>
              <th><span data-localize="pages.modelupload_php.wizard.step1.thcol_edit">Edit</span></th>
              <th>Object-TripleID</th>
              <th>Media-TripleID</th>
              <th data-localize="pages.modelupload_php.wizard.step1.thcol_descr">Description</th>
              <th>Created on/by</th>
              <th>Owner</th>
              <th>Mime</th>
              <th data-localize="pages.modelupload_php.wizard.step1.thcol_compr">Compressions</th>
          </tr>
          </thead>

          <tbody>
          {ModelList_1.printAllModelTableRows(modelObj_es6_1.ModelObj.getAllLocally())}
          </tbody>
      </table>;
    };
    /** Prints general table row to tbody elem from json str */
    ModelList.printModelTableRow = function (modelObj) {
        var compressionTypesList = "";
        //console.log("JsonObjFiles length: "+Object.keys(jsonObj["files"]).length);
        var allCompressions = Object.keys(modelObj.files);
        for (var index = 0; index < allCompressions.length; ++index) {
            //TODO: place here relevant ata to string
            compressionTypesList += "<img src='../images/users/TEST.jpg' class='avatar' alt='Avatar' data-toggle='tooltip' data-placement='top' title='" + modelObj.getFile(allCompressions[index]).compressionUUID + "'>";
            //console.log("Added string to types list. ");
        }
        return "<tr id='" + modelObj.objectTripleID + "'>" +
            "<td><a href='#' class='btn btn-info btn-xs' onclick='selectModel(&apos;" + modelObj.objectTripleID + "&apos;)'><i class='fa fa-pencil'></i> Select</a></td>" +
            "<td>" + modelObj.objectTripleID + "</td><td>" + modelObj.mediaTripleID + "</td>" +
            "<td>" + modelObj.description + "</td><td>" + modelObj.createDate + " by " + modelObj.creator + "</td>" +
            "<td>" + modelObj.owner + "</td><td>" + modelObj.MIMEtype + "</td><td>" + compressionTypesList + "</td></tr>";
        //objectTripleUUID as Row ID, so we can get id as reference when selecting an action btn
        //console.log("Tried to execute printModelTableRow(): "+tbodyidentifier+";;"+JSON.stringify(jsonObj));
    };
    /** Prints search results so just give all ModelJsonObjs as an Array to this method :)*/
    ModelList.printAllModelTableRows = function (modelObjs) {
        var table = "";
        if (modelObjs !== null && modelObjs !== undefined) {
            //ModelObjs is now a future! So we want to get it
            modelObjs.then(function (modelObjArr) {
                if (modelObjArr !== undefined && modelObjArr !== null) {
                    for (var i = 0; i < modelObjArr.length; i++) {
                        //console.log('Trying to print table row of provided array->'+JSON.stringify(jsonObjs[i]));
                        table += this.printModelTableRow(modelObjArr[i]);
                    }
                }
                else {
                    console.error('modelupload_general:printAllModelTableRows: Could not print table bc. resolved jsonObj[] is null|undefined (maybe no modelObjs at all saved).');
                }
            });
        }
        else {
            console.error('modelupload_general:printAllModelTableRows: Could not print table rows, because jsonObj[] promise is null!');
        }
        return table;
    };
    ModelList = ModelList_1 = __decorate([
        core_1.Component({
            tag: 'model-list',
            styleUrl: 'model-list.css',
            shadow: true
        })
    ], ModelList);
    return ModelList;
    var ModelList_1;
}());
exports.ModelList = ModelList;
