function isJsonParamValid(json) {
    if (json === null) {
        console.warn('isJsonParamValid: Provided json is null. Created empty obj.');
        return false; //just in case
    } else if (json === undefined) {
        console.warn('isJsonParamValid: Provided json is undefined. Created empty one.');
        return false;
    } else {
        var jsonObj;

        //provided param must be an array, obj or str
        if (json.constructor === "str".constructor) {
            //Provided param is a str (presumably an unparsed json obj)
            jsonObj = JSON.parse(json);
        } else if (json.constructor === {}.constructor) {
            jsonObj = json;
        } else {
            console.warn('isJsonParamValid: Provided json is not a string neither an object! Created empty obj.');
            return false; //exit constructor
        }
    }
    return jsonObj;
}

/** Constructor
 * TODO: SETTER for configuring them */
function ModelObj(json) {
    var jsonObj = isJsonParamValid(json); //might also contain false
    if (jsonObj !== false && jsonObj !== null && jsonObj !== undefined) {
        this.getDescription = function () {
            return jsonObj.description;
        };
        this.getObjectTripleID = function () {
            return jsonObj.objectTripleID;
        };
        this.getMediaTripleID = function () {
            return jsonObj.mediaTripleID;
        };
        this.getCreateDate = function () {
            return jsonObj.createDate;
        };
        this.getCreator = function () {
            return jsonObj.creator;
        };
        this.getOwner = function () {
            return jsonObj.owner;
        };
        this.getMIMEType = function () {
            return jsonObj.MIMEtype;
        };
        this.getFiles = function () {
            var compressionUUIDs = Object.keys(jsonObj);
            var compressionObjs = {};
            for (var i = 0;i<compressionUUIDs.length;i++) {
                compressionObjs.push(new CompressionObj(compressionUUIDs[i],jsonObj.files[compressionUUIDs[i]]));
            }
            return compressionObjs;
        };
        this.getFile = function (compressionUUID) {
            return new CompressionObj(compressionUUID, jsonObj.files[compressionUUID]);
        }
    } //no else necessary bc. last statement (return empty obj)
}

//TODO: With setters
function CompressionObj(compressionUUID,json) {
    var jsonObj = isJsonParamValid(json); //might also contain false
    if (jsonObj !== false && jsonObj !== null && jsonObj !== undefined) {
        this.getCompressionUUID = function () {
            return compressionUUID; //as extra param bc. --> id : {provided obj}
        };
        this.getUploadDate = function () {
            return jsonObj.uploadDate;
        };
        this.getAccessLevel = function () {
            return jsonObj.accessLevel;
        };
        this.getLicense = function () {
            return jsonObj.license;
        };
        this.getFileSize = function () {
            return jsonObj.fileSize;
        };
        this.getPath = function () {
            return jsonObj.path;
        };
        this.getFileTypeSpecificMeta = function () {
            return jsonObj.fileTypeSpecificMeta;
        }
    } //no else necessary bc. last statement (return empty obj)
}