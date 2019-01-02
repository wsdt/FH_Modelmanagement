const Mod_fs = require("fs");
const formidable = require("formidable");

/** Define routes **********************************
 * Allowed http-methods:
 * >> post, get, put, delete */
module.exports = {
  "/": {
    get: get_upload
  },
  "/v1/upload": {
    get: get_upload
  },
  "/v1/model": {
    get: get_models,
    post: post_model
  },
  "/v1/compressions": {
    post: post_compression
  }
};

/** Route methods ***********************************/
const page_dir = "./frontend/html/";
const data_dir = "./backend/data/";
const compression_target_dir = "./backend/compressions/";

function isValueNotEmpty(val) {
  return val !== undefined && val !== null && val !== "";
}

/** Saves uploaded file to compression folder */
function post_compression(req, res) {
  let form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    let oldPath = files.file.path;
    Mod_fs.rename(oldPath, compression_target_dir + files.file.name, function(
      err
    ) {
      if (err) throw err;
      res.write("File uploaded and moved!");
      res.end();
    });
  });
}

/** Saves new model/compression */
function post_model(req, res) {
  let newModel = req.body;
  let error = true;

  if (newModel !== undefined && newModel !== null && newModel !== "") {
    try {
      console.log("route: " + JSON.stringify(newModel));

      Mod_fs.writeFile(
        data_dir + newModel.objectTripleID + ".json",
        JSON.stringify(newModel),
        "utf8",
        () => {
          console.log("routes:post_model: Tried to save new model.");
          res.json({
            res_title: "Model saved",
            res_text: "Your compression has been saved successfully.",
            notification_type: "success"
          });
        }
      );
      error = false;
    } catch (e) {
      console.error(
        "routes:post_model: Could not save new model, as it is not valid JSON -> " +
          JSON.stringify(newModel) +
          "\n" +
          JSON.stringify(e)
      );
    }
  } else {
    console.error(
      "routes:post_model: Could not save new model as no data might be available -> " +
        newModel
    );
  }

  if (error) {
    res.json({
      res_title: "Model not saved",
      res_text: "Your compression could not be saved due to an error.",
      notification_type: "error"
    });
  }
}

/** Returns specific model (via get-param) or if not provided
 * all saved models. */
function get_models(req, res) {
  let modelId = req.query.objectTripleID;
  if (modelId !== undefined && modelId !== null && modelId !== "") {
    //Only return one json obj
    console.log("routes:get_models: Requested model -> " + modelId);
    let modelJson = JSON.parse(
      Mod_fs.readFileSync(data_dir + modelId + ".json", "utf8")
    );
    if (
      modelJson === undefined ||
      modelJson === null ||
      modelJson === {} ||
      modelJson === []
    ) {
      console.error("routes:get_models: Requested model NOT found.");
      return "{}";
    } else {
      res.send(JSON.stringify(modelJson));
    }
  } else {
    Mod_fs.readdir(data_dir, function(err, items) {
      console.log("routes:get_models: Found models -> " + items);

      let resultJsonArr = [];
      if (err || items === undefined || items === null) {
        console.warn("routes:get_all_models: Found no models.");
      } else {
        items.forEach(function(model) {
          resultJsonArr.push(
            JSON.parse(Mod_fs.readFileSync(data_dir + model, "utf8"))
          );
        });
      }

      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(resultJsonArr));
    });
  }
}

function get_upload(req, res) {
  openFile("modelupload", req, res);
}

function openFile(file, req, res) {
  res.render(file);
}
