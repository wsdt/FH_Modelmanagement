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
        Object.defineProperties(this,{
            "description": {
                "get": function () {
                    return this.description;
                },
                "set": function (description) {
                    this.description = description; //as extra param bc. --> id : {provided obj}
                }
            },
            "objectTripleID": {
                "get": function () {
                    return this.objectTripleID;
                },
                "set": function (objectTripleID) {
                    this.objectTripleID = objectTripleID; //as extra param bc. --> id : {provided obj}
                }
            },
            "mediaTripleID": {
                "get": function () {
                    return this.mediaTripleID;
                },
                "set": function (mediaTripleID) {
                    this.mediaTripleID = mediaTripleID; //as extra param bc. --> id : {provided obj}
                }
            },
            "createDate": {
                "get": function () {
                    return this.createDate;
                },
                "set": function (createDate) {
                    this.createDate = createDate; //as extra param bc. --> id : {provided obj}
                }
            },
            "creator": {
                "get": function () {
                    return this.creator;
                },
                "set": function (creator) {
                    this.creator = creator; //as extra param bc. --> id : {provided obj}
                }
            },
            "owner": {
                "get": function () {
                    return this.owner;
                },
                "set": function (owner) {
                    this.owner = owner; //as extra param bc. --> id : {provided obj}
                }
            },
            "MIMEtype": {
                "get": function () {
                    return this.MIMEtype;
                },
                "set": function (MIMEtype) {
                    this.MIMEtype = MIMEtype; //as extra param bc. --> id : {provided obj}
                }
            },
            "files": {
                "get": function () {
                    return this.files;
                },
                "set": function (files) {
                    var filesObj;
                    if (files.constructor === {}.constructor) {
                        filesObj = files;
                    } else if (files.constructor === "string".constructor) {
                        filesObj = JSON.parse(files);
                    } else {
                        console.warn('modelObj:constructor: Could not parse filesObj. ');
                        return;
                    }

                    var compressionUUIDs = Object.keys(filesObj);
                    var compressionObjs = {};
                    for (var i = 0;i<compressionUUIDs.length;i++) {
                        compressionObjs[compressionUUIDs[i]] = (new CompressionObj(compressionUUIDs[i],jsonObj.files[compressionUUIDs[i]]));
                    }
                    this.files = compressionObjs; //as extra param bc. --> id : {provided obj}
                },
                "getFile": function (compressionUUID) {
                    return new CompressionObj(compressionUUID,this.files[compressionUUID]);
                }
            }
        });
    } //no else necessary bc. last statement (return empty obj)
};

var CompressionObj = function(compressionUUID,json) {
    var jsonObj = isJsonParamValid(json); //might also contain false
    if (jsonObj !== false && jsonObj !== null && jsonObj !== undefined) {
        Object.defineProperties(this, {
            "compressionUUID": {
                "get": function () {
                    return this.compressionUUID;
                },
                "set": function (compressionUUID) {
                    this.compressionUUID = compressionUUID; //as extra param bc. --> id : {provided obj}
                }
            },
            "uploadDate": {
                "get": function () {
                    return this.uploadDate;
                },
                "set": function (uploadDate) {
                    this.uploadDate = uploadDate; //as extra param bc. --> id : {provided obj}
                }
            },
            "accessLevel": {
                "get": function () {
                    return this.accessLevel;
                },
                "set": function (accessLevel) {
                    this.accessLevel = accessLevel; //as extra param bc. --> id : {provided obj}
                }
            },
            "license": {
                "get": function () {
                    return this.license;
                },
                "set": function (license) {
                    this.license = license; //as extra param bc. --> id : {provided obj}
                }
            },
            "fileSize": {
                "get": function () {
                    return this.fileSize;
                },
                "set": function (fileSize) {
                    this.fileSize = fileSize; //as extra param bc. --> id : {provided obj}
                }
            },
            "path": {
                "get": function () {
                    return this.path;
                },
                "set": function (path) {
                    this.path = path; //as extra param bc. --> id : {provided obj}
                }
            },
            "fileTypeSpecificMeta": {
                "get": function () {
                    return this.fileTypeSpecificMeta;
                },
                "set": function (fileTypeSpecificMeta) {
                    this.fileTypeSpecificMeta = fileTypeSpecificMeta; //as extra param bc. --> id : {provided obj}
                }
            }
        });
    } //no else necessary bc. last statement (return empty obj)
};