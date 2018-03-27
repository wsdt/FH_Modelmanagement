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

/** Constructors -------------------------------------------- */
var ModelObj = function(json) {
    var jsonObj = isJsonParamValid(json); //might also contain false
    if (jsonObj !== false && jsonObj !== null && jsonObj !== undefined) {
        Object.defineProperty(this, "descriptiontest", {
           get: function () {
               return _descriptiontest;
           }
        });


        Object.defineProperties(this,{
            "description": {
                "get": function () {
                    return jsonObj.description;
                },
                "set": function (description) {
                    jsonObj.description = description; //as extra param bc. --> id : {provided obj}
                }
            },
            "objectTripleID": {
                "get": function () {
                    return jsonObj.objectTripleID;
                },
                "set": function (objectTripleID) {
                    jsonObj.objectTripleID = objectTripleID; //as extra param bc. --> id : {provided obj}
                }
            },
            "mediaTripleID": {
                "get": function () {
                    return jsonObj.mediaTripleID;
                },
                "set": function (mediaTripleID) {
                    jsonObj.mediaTripleID = mediaTripleID; //as extra param bc. --> id : {provided obj}
                }
            },
            "createDate": {
                "get": function () {
                    return jsonObj.createDate;
                },
                "set": function (createDate) {
                    jsonObj.createDate = createDate; //as extra param bc. --> id : {provided obj}
                }
            },
            "creator": {
                "get": function () {
                    return jsonObj.creator;
                },
                "set": function (creator) {
                    jsonObj.creator = creator; //as extra param bc. --> id : {provided obj}
                }
            },
            "owner": {
                "get": function () {
                    return jsonObj.owner;
                },
                "set": function (owner) {
                    jsonObj.owner = owner; //as extra param bc. --> id : {provided obj}
                }
            },
            "MIMEtype": {
                "get": function () {
                    return jsonObj.MIMEtype;
                },
                "set": function (MIMEtype) {
                    jsonObj.MIMEtype = MIMEtype; //as extra param bc. --> id : {provided obj}
                }
            },
            "files": {
                "get": function () {
                    return jsonObj.files;
                },
                "set": function (files) {
                    //TODO: Works in console but not while setting ModelObj?
                    var filesObj = isJsonParamValid(files);

                    var compressionUUIDs = Object.keys(filesObj);
                    console.log('Compression UUIDs: '+compressionUUIDs);
                    var compressionObjs = [];
                    for (var i = 0;i<compressionUUIDs.length;i++) {
                        compressionObjs.push((new CompressionObj(compressionUUIDs[i],filesObj[compressionUUIDs[i]]))); //.files[compressionUUIDs[i]])
                        console.log(compressionObjs[i]);
                    }
                    jsonObj.files = compressionObjs; //as extra param bc. --> id : {provided obj}
                }
            }
        });

        ModelObj.prototype.getFile =  function (compressionUUID) {
            return new CompressionObj(compressionUUID, jsonObj.files[compressionUUID]);
        }
    } //no else necessary bc. last statement (return empty obj)
};

var CompressionObj = function(compressionUUID,json) {
    var jsonObj = isJsonParamValid(json); //might also contain false
    console.log("New compression->"+jsonObj+";;;"+jsonObj.accessLevel);
    if (jsonObj !== false && jsonObj !== null && jsonObj !== undefined) {
        Object.defineProperties(this, {
            "compressionUUID": {
                "get": function () {
                    return jsonObj.compressionUUID;
                },
                "set": function (compressionUUID) {
                    jsonObj.compressionUUID = compressionUUID; //as extra param bc. --> id : {provided obj}
                }
            },
            "uploadDate": {
                "get": function () {
                    return jsonObj.uploadDate;
                },
                "set": function (uploadDate) {
                    jsonObj.uploadDate = uploadDate; //as extra param bc. --> id : {provided obj}
                }
            },
            "accessLevel": {
                "get": function () {
                    return jsonObj.accessLevel;
                },
                "set": function (accessLevel) {
                    jsonObj.accessLevel = accessLevel; //as extra param bc. --> id : {provided obj}
                }
            },
            "license": {
                "get": function () {
                    return jsonObj.license;
                },
                "set": function (license) {
                    jsonObj.license = license; //as extra param bc. --> id : {provided obj}
                }
            },
            "fileSize": {
                "get": function () {
                    return jsonObj.fileSize;
                },
                "set": function (fileSize) {
                    jsonObj.fileSize = fileSize; //as extra param bc. --> id : {provided obj}
                }
            },
            "path": {
                "get": function () {
                    return jsonObj.path;
                },
                "set": function (path) {
                    jsonObj.path = path; //as extra param bc. --> id : {provided obj}
                }
            },
            "fileTypeSpecificMeta": {
                "get": function () {
                    return jsonObj.fileTypeSpecificMeta;
                },
                "set": function (fileTypeSpecificMeta) {
                    jsonObj.fileTypeSpecificMeta = fileTypeSpecificMeta; //as extra param bc. --> id : {provided obj}
                }
            }
        });
    } //no else necessary bc. last statement (return empty obj)
};