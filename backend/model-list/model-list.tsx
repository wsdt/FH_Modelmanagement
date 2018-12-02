import { Component, Prop } from '@stencil/core';
//import {ModelObj} from "../../../frontend/js/modelObj_es6";

import '../../../frontend/vendors/iCheck/icheck.min.js';
import '../../../frontend/vendors/datatables.net/js/jquery.dataTables.min.js';
import '../../../frontend/vendors/datatables.net-bs/js/dataTables.bootstrap.min.js';
import '../../../frontend/vendors/datatables.net-buttons/js/dataTables.buttons.min.js';
import '../../../frontend/vendors/datatables.net-buttons-bs/js/buttons.bootstrap.min.js';
import '../../../frontend/vendors/datatables.net-buttons/js/buttons.flash.min.js';
import '../../../frontend/vendors/datatables.net-buttons/js/buttons.html5.min.js';
import '../../../frontend/vendors/datatables.net-buttons/js/buttons.print.min.js';
import '../../../frontend/vendors/datatables.net-fixedheader/js/dataTables.fixedHeader.min.js';
import '../../../frontend/vendors/datatables.net-keytable/js/dataTables.keyTable.min.js';
import '../../../frontend/vendors/datatables.net-responsive/js/dataTables.responsive.min.js';
import '../../../frontend/vendors/datatables.net-responsive-bs/js/responsive.bootstrap.js';
import '../../../frontend/vendors/datatables.net-scroller/js/dataTables.scroller.min.js';
import '../../../frontend/vendors/jszip/dist/jszip.min.js';
import '../../../frontend/vendors/pdfmake/build/pdfmake.min.js';
import '../../../frontend/vendors/pdfmake/build/vfs_fonts.js';


@Component({
  tag: 'model-list',
  styleUrl: 'model-list.css',
  shadow: true
})
export class ModelList {
  render() {
      //<-- ModelList.printAllModelTableRows(ModelObj.getAllLocally()) }-->
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

          </tbody>
      </table>;
  }

    /** Prints general table row to tbody elem from json str */
    static printModelTableRow(modelObj) {
        let compressionTypesList = "";
        //console.log("JsonObjFiles length: "+Object.keys(jsonObj["files"]).length);
        let allCompressions = Object.keys(modelObj.files);
        for (let index = 0; index < allCompressions.length; ++index) {
            //TODO: place here relevant ata to string
            compressionTypesList += "<img src='../images/users/TEST.jpg' class='avatar' alt='Avatar' data-toggle='tooltip' data-placement='top' title='" + modelObj.getFile(allCompressions[index]).compressionUUID + "'>";
            //console.log("Added string to types list. ");
        }

        return "<tr id='"+modelObj.objectTripleID+"'>"+
            "<td><a href='#' class='btn btn-info btn-xs' onclick='selectModel(&apos;" + modelObj.objectTripleID + "&apos;)'><i class='fa fa-pencil'></i> Select</a></td>"+
            "<td>"+modelObj.objectTripleID+"</td><td>"+modelObj.mediaTripleID+"</td>"+
            "<td>"+modelObj.description+"</td><td>"+modelObj.createDate+" by "+modelObj.creator+"</td>"+
            "<td>"+modelObj.owner+"</td><td>"+modelObj.MIMEtype+"</td><td>"+compressionTypesList+"</td></tr>";

        //objectTripleUUID as Row ID, so we can get id as reference when selecting an action btn
        //console.log("Tried to execute printModelTableRow(): "+tbodyidentifier+";;"+JSON.stringify(jsonObj));
    }

    /** Prints search results so just give all ModelJsonObjs as an Array to this method :)*/
    static printAllModelTableRows(modelObjs) {
        let table = "";
        if (modelObjs !== null && modelObjs !== undefined) {
            //ModelObjs is now a future! So we want to get it
            modelObjs.then(function(modelObjArr) {
                if (modelObjArr !== undefined && modelObjArr !== null) {
                    for (let i = 0; i < modelObjArr.length; i++) {
                        //console.log('Trying to print table row of provided array->'+JSON.stringify(jsonObjs[i]));
                        table += this.printModelTableRow(modelObjArr[i]);
                    }
                } else {
                    console.error('modelupload_general:printAllModelTableRows: Could not print table bc. resolved jsonObj[] is null|undefined (maybe no modelObjs at all saved).');
                }
            });
        } else {
            console.error('modelupload_general:printAllModelTableRows: Could not print table rows, because jsonObj[] promise is null!');
        }
        return table;
    }
}
