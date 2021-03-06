let selectedObj; //used to keep track which elem is selected (i think it is less error prone than determining the bgColor)

/** Uploads a new compression */
function uploadNewCompression() {
  if (selectedObj !== undefined && selectedObj !== null) {
    console.log(
      "uploadNewCompression: Trying to get json string of selected modelobj -> " +
        JSON.stringify(selectedObj)
    );

    let modelObjPromise = ModelObj.getLocally(selectedObj); //is a modelObj not a string or json
    let randomSubId = "TripleID" + parseInt(Math.random() * 1000, 10);

    modelObjPromise.then(function(modelObj) {
      let uploadedFiles = document.getElementsByClassName(
        "dz-preview dz-processing dz-success dz-complete"
      );

      console.log(
        "uploadNewCompression: Uploaded compr -> " +
          JSON.stringify(uploadedFiles)
      );
      let fileSizeSum = "";
      let pathArr = [];
      for (let uploadedFile of uploadedFiles) {
        let metaData = uploadedFile.getElementsByClassName("dz-details")[0];
        let fileNameWithExtension = metaData.getElementsByClassName(
          "dz-filename"
        )[0].firstChild.innerHTML;
        let fileSize = metaData.getElementsByClassName("dz-size")[0];
        fileSize = fileSize.textContent || fileSize.innerText;

        fileSizeSum = fileSize;
        pathArr.push(fileNameWithExtension);
      }

      let newCompr = new Compression(
          randomSubId,
          new Date().toLocaleString(),
          document.getElementById("accessLevels").value,
          document.getElementById("license").value,
          fileSizeSum,
          pathArr,
          "{}"
      );

      modelObj.saveNewCompression(newCompr);

      console.log(
        "uploadNewCompression:then::after: " + JSON.stringify(modelObj)
      );
      modelObj.saveLocally(); //save also locally
    });
  } else {
    console.warn(
      "uploadNewCompression: Please select a model before you upload a new compression."
    );
  }
}

function deleteModel(objectTripleId) {
  fetch("/v1/model", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({tripleID: objectTripleId})
  })
      .then(resp => resp.json())
      .then(function(res) {
        // synchronize
        printAllModelTableRows("#queriedmodels", ModelObj.getAllLocally()); //works!! Just ignore IDE ref not found here

        new PNotify({
          title: res.res_title,
          text: res.res_text,
          type: res.notification_type,
          styling: "bootstrap3"
        });
      });
}

let allModels = {cachedModels:[],lastFetched:0};
function searchModels(keywords) {
  keywords = keywords.split(" "); // get arr of keywords
  console.log("searchModels: Keywords -> "+JSON.stringify(keywords));

  // fetch at maximum every 5 seconds
  if (!allModels || allModels.length <= 0 || allModels.lastFetched === 0 || ((new Date()).getMilliseconds()-allModels.lastFetched.getMilliseconds()) > 5000) {
    ModelObj.getAllLocally().then((arr) => {
      if (arr) {
        console.log("searchModels: Fetched models.");
        allModels.cachedModels = arr;
        allModels.lastFetched = new Date();
      } else {
        console.error("searchModels: Models not available.");
      }
    });
  } else {
    console.info("searchModels: Models already cached -> "+ JSON.stringify(allModels))
  }

  let searchedModels = [];
  for (let modelObj of allModels.cachedModels) {
    for (let keyword of keywords) {
      if (JSON.stringify(modelObj).includes(keyword)) {
        searchedModels.push(modelObj);
        console.log("searchModels: Found model for keyword "+keyword+" -> model: "+JSON.stringify(modelObj));
      }
    }
  }
  return Promise.resolve(searchedModels);
}

/** Prints general table row to tbody elem from json str */
function printModelTableRow(tbodyidentifier, modelObj) {
  let compressionTypesList = "";
  //console.log("JsonObjFiles length: "+Object.keys(jsonObj["files"]).length);
  let allCompressions = Object.keys(modelObj.files);
  for (let index = 0; index < allCompressions.length; ++index) {
    //TODO: place here relevant ata to string
    compressionTypesList +=
      "<img src='../images/users/TEST.jpg' class='avatar' alt='Avatar' data-toggle='tooltip' data-placement='top' title='" +
      modelObj.getFile(allCompressions[index]).compressionUUID +
      "'>";
    //console.log("Added string to types list. ");
  }

  $(tbodyidentifier)
    .append(
      "<tr id='" +
        modelObj.objectTripleID +
        "'>" +
        "<td><a href='#' class='btn btn-info btn-xs' onclick='selectModel(&apos;" +
        modelObj.objectTripleID +
        "&apos;)'><i class='fa fa-pencil'></i> Select</a>" +
        "<a href='#' class='btn btn-danger btn-xs' onclick='deleteModel(&apos;" +
        modelObj.objectTripleID +
        "&apos;)'><i class='fa fa-pencil'></i> Delete</a>" +
        "</td>" +
        "<td>" +
        modelObj.objectTripleID +
        "</td><td>" +
        modelObj.mediaTripleID +
        "</td>" +
        "<td>" +
        modelObj.description +
        "</td><td>" +
        modelObj.createDate +
        " by " +
        modelObj.creator +
        "</td>" +
        "<td>" +
        modelObj.owner +
        "</td><td>" +
        modelObj.uploader +
        "</td><td>" +
        modelObj.MIMEtype +
        "</td><td>" +
        compressionTypesList +
        "</td></tr>"
    )
    .fadeIn("slow");

  //objectTripleUUID as Row ID, so we can get id as reference when selecting an action btn
  //console.log("Tried to execute printModelTableRow(): "+tbodyidentifier+";;"+JSON.stringify(jsonObj));
}

/** Adds table row for creating a new model without any compressions. */
function printAddNewModelTableRow(tbodyidentifier) {
  $(tbodyidentifier)
    .append(
      `
          <tr id="new_model_creator">
            <td><a href="#" class="btn btn-success btn-xs" onclick="createModel(
                document.getElementById('mc_objectTripleID').value,
                document.getElementById('mc_mediaTripleID').value,
                document.getElementById('mc_description').value,
                document.getElementById('mc_createDate').value,
                document.getElementById('mc_creator').value,
                document.getElementById('mc_owner').value,
                document.getElementById('mc_uploader').value,
                document.getElementById('mc_mimetype').value
            );"><i class="fa fa-plus"></i> Add</a></td>
            <td><input class="model_create_input" type="text" id="mc_objectTripleID"/></td> <!-- objectTripleID -->
            <td><input class="model_create_input" type="text" id="mc_mediaTripleID"/></td> <!-- mediaTripleID -->
            <td><input class="model_create_input" type="text" id="mc_description"/></td> <!-- description -->
            <td><input class="model_create_input" type="text" id="mc_createDate"/><br />by<br /><input class="model_create_input" id="mc_creator" type="text"/></td> <!-- createDate by creator -->
            <td><input class="model_create_input" type="text" id="mc_owner"/></td> <!-- owner -->
            <td><input class="model_create_input" type="text" id="mc_uploader"/></td> <!-- uploader -->
            <td><input class="model_create_input" type="text" id="mc_mimetype"/></td> <!-- MIMEtype -->
            <td>Add new model first</td>
          </tr>
        `
    )
    .fadeIn("slow");
}

function createModel(
  objectTripleID,
  mediaTripleID,
  description,
  createDate,
  creator,
  owner,
  uploader,
  mimeType
) {
  if (
    objectTripleID &&
    mediaTripleID &&
    description &&
    createDate &&
    creator &&
    owner &&
    uploader &&
    mimeType
  ) {
    new ModelObj(
      objectTripleID,
      description,
      mediaTripleID,
      createDate,
      creator,
      owner,
      uploader,
      mimeType,
      null
    ).saveLocally();
  } else {
    new PNotify({
      title: "Input invalid",
      text: "All fields are required.",
      type: "error",
      styling: "bootstrap3"
    });
  }
}

/** Prints search results so just give all ModelJsonObjs as an Array to this method :)*/
function printAllModelTableRows(tbodyidentifier, modelObjs) {
  //Remove all previous content/rows of element (e.g. when searching for sth we only want filtered results)
  $(tbodyidentifier).html("");

  if (modelObjs !== null && modelObjs !== undefined) {
    //ModelObjs is now a future! So we want to get it
    modelObjs.then(function(modelObjArr) {
      if (modelObjArr !== undefined && modelObjArr !== null) {
        for (let i = 0; i < modelObjArr.length; i++) {
          //console.log('Trying to print table row of provided array->'+JSON.stringify(jsonObjs[i]));
          printModelTableRow(tbodyidentifier, modelObjArr[i]);
        }
        printAddNewModelTableRow(tbodyidentifier);

        refreshScrollViewHeight();

      } else {
        console.error(
          "modelupload_general:printAllModelTableRows: Could not print table bc. resolved jsonObj[] is null|undefined (maybe no modelObjs at all saved)."
        );
      }
    });
  } else {
    console.error(
      "modelupload_general:printAllModelTableRows: Could not print table rows, because jsonObj[] promise is null!"
    );
  }
}

/** This method is called when user clicks on ADD btn, so we can do here sth stuff
 * -> This method should send it's data to basket. After that the upload procedure can
 * start. */
function selectModel(objectTrippleUUID) {
  //Only select if not selected already and if not null
  if (objectTrippleUUID !== null) {
    if (selectedObj !== objectTrippleUUID) {
      console.log("Received selected model with id: " + objectTrippleUUID);
      //Color selected row (now user has to click on next to upload a new compression
      colorOnlyProvidedObject(objectTrippleUUID);
      console.log("Tried to set bgcolor.");

      //Update heading for step 2 (usability)
      document.getElementById("step2_title").innerHTML =
        "Step 2: Upload new compression for " + objectTrippleUUID;

      //TODO: Do here sth stuff (e.g. send to basket with ajax or similar etc.) and then receive HERE a valid json str

      //Inform user that everything went well, BUT ONLY when this notification was not shown before in this session
      new PNotify({
        title: "Selected model.",
        text:
          "Excellent! Now click on &apos;NEXT&apos; to upload a new compression.",
        type: "info",
        styling: "bootstrap3"
      });

      selectedObj = objectTrippleUUID; //so we know which object was selected
    } else {
      console.info("Model already selected.");
    }
  } else {
    console.error("Could not select model, bc. objectTrippleUUID is null!");
  }
}


function colorOnlyProvidedObject(objectTrippleUUID) {
  let unselectedColor = "#f9f9f9";
  let selectedColor = "#FFFBCC";

  //uncolor old objects
  let allRows = document.getElementById("queriedmodels").children; //get all rows
  for (let i = 0; i < allRows.length; i++) {
    allRows[i].style.backgroundColor = unselectedColor;
  }

  //Color new object
  document.getElementById(
    objectTrippleUUID
  ).style.backgroundColor = selectedColor;
}

