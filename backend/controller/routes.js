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
  "/v1/filemgr": {
    get: get_filemgr
  },
  "/v1/model": {
    get: get_models,
    post: post_model,
    delete: delete_model
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

/** Load file manager */
function get_filemgr(req, res) {
  openFile("filemgr", req, res);
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

/** Delete model incl. compressions */
function delete_model(req, res) {
  let modelToDelete = req.body.tripleID;
  let error = false;

  if (modelToDelete) {
    try {
      console.log("route:delete_model: "+modelToDelete);

      Mod_fs.unlink(
          data_dir + modelToDelete + ".json", (err) => {
            if (!err) {
              // TODO: NOTE, that currently compression files are not deleted (only json)
              console.log("routes:delete_model: Tried to delete model.");
              res.json({
                res_title: "Model deleted",
                res_text: "Your model and compressions have been deleted.",
                notification_type: "success"
              });
            } else {
              console.error("route:delete_model: File error -> "+JSON.stringify(err));
              error = true;
            }
          }
      )
    } catch (e) {
      console.error("routes:delete_model: Deleting file failed -> "+ JSON.stringify(e));
      error = true;
    }
  } else {
    console.error("routes:delete_model: Request misformed.");
    error = true;
  }
  if (error) {
    res.json({
      res_title: "Model not deleted",
      res_text: "Could not delete your model and associated compressions.",
      notification_type: "error"
    });
  }
}

/** Saves new model/compression */
function post_model(req, res) {
  let newModel = req.body;
  let error = true;

  if (newModel !== undefined && newModel !== null && newModel !== "") {
    try {
      console.log("route:post_model: " + JSON.stringify(newModel));

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
