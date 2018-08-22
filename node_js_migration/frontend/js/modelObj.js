function isJsonParamValid(json) {
    if (json === null) {
        console.warn('isJsonParamValid: Provided json is null. Created empty obj.');
        return false; //just in case
    } else if (json === undefined) {
        console.warn('isJsonParamValid: Provided json is undefined. Created empty one.');
        return false;
    } else {
        //provided param must be an array, obj or str
        if (json.constructor === "str".constructor) {
            //Provided param is a str (presumably an unparsed json obj)
            jsonObj = JSON.parse(json);
        } else if (json.constructor === {}.constructor || json.constructor === [].constructor) {
            jsonObj = json;
        } else {
            console.warn('isJsonParamValid: Provided json is not a string neither an object! Created empty obj. Constructor: '+json.constructor);
            return false; //exit constructor
        }
    }
    return jsonObj;
}

/** Constructors -------------------------------------------- */
let ModelObj = function(json) {
    //TODO: overall problem (also problem of compression obj that setter not called while constructor calling!)

    console.log('ModelObj-Json->'+json);
    let jsonObj = isJsonParamValid(json); //might also contain false
    if (jsonObj !== false && jsonObj !== null && jsonObj !== undefined) {
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
                    console.log('Have set mime type.');
                    jsonObj.MIMEtype = MIMEtype; //as extra param bc. --> id : {provided obj}
                }
            },
            "files": {
                "get": function () {
                    return jsonObj.files;
                },
                "set": function (files) {
                    let filesObj = isJsonParamValid(files);

                    let compressionUUIDs = Object.keys(filesObj);
                    console.log('Compression UUIDs: '+compressionUUIDs+";;;"+compressionUUIDs.length);
                    let compressionObjs = []; //TODO: statt array jsonObj mit UUID als key damit ausgangsjson und result gleich!
                    for (let i = 0;i<compressionUUIDs.length;i++) {
                        compressionObjs.push((new CompressionObj(compressionUUIDs[i],filesObj[compressionUUIDs[i]]))); //.files[compressionUUIDs[i]])
                        console.log(compressionObjs[i]);
                    }
                    jsonObj.files = compressionObjs; //as extra param bc. --> id : {provided obj}
                }
            }
        });

        ModelObj.prototype.saveNewCompression = function(compressionJson) {
            //assuming that let is compressionObj (not a json etc.)
            jsonObj.files.push(compressionJson);
            console.warn('newCompr:'+JSON.stringify(jsonObj.files));
        };

        ModelObj.prototype.getFile =  function (compressionUUID) {
            console.log('CompressionUUID: '+compressionUUID+";;;"+jsonObj+";;;"+jsonObj.files+";;;"+jsonObj.files[0]);
            return jsonObj.files[compressionUUID];
        };

        ModelObj.prototype.saveLocally = function () {
            let strModelObj = JSON.stringify((jsonObj));
            console.log("OBJ: "+strModelObj+";;"+JSON.stringify(this.files));

            fetch("/model",
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: strModelObj
                })
                .then(function(res) {
                    console.log('Submitted json: '+res);
                });
        };


        this.description = jsonObj.description;
        this.objectTripleID = jsonObj.objectTripleID;
        this.mediaTripleID = jsonObj.mediaTripleID;
        this.createDate = jsonObj.createDate;
        this.creator = jsonObj.creator;
        this.owner = jsonObj.owner;
        this.MIMEtype = jsonObj.MIMEtype;
        this.files = jsonObj.files;
    } //no else necessary bc. last statement (return empty obj)
};
//IMPORTANT: Static methods outside of if, otherwise not accessable without at least one valid instance!
/*static: Returns PROMISE (to get value use:
        returnedPromise.then(function(value) {console.log(value);}
     */
ModelObj.getLocally = function(objectTripleID) {
    if (objectTripleID !== undefined && objectTripleID !== null) {
        console.log('Sending id to ' + "./LocalJsonMgr.php?objectTripleID=" + objectTripleID);
        return fetch("/model?objectTripleID=" + objectTripleID)
            .then((resp) => resp.json())
            .then(function (res) {
                    let modelObj = new ModelObj(res);
                    console.log('Received json: ' + JSON.stringify(res) + " / ModelObj: " + modelObj);
                    return modelObj;
                }
            )
    }
};

/*static: Returns PROMISE (to get value use:
   returnedPromise.then(function(value) {console.log(value);}
*/
ModelObj.getAllLocally = function() {
    return fetch("/model")
        .then((resp) => resp.json())
        .then(function (res) {
                console.log("PHP Row json: "+JSON.stringify(res));

                let allModelObjs = [];
                for (let obj of res) {
                    allModelObjs.push(new ModelObj(obj));
                    console.log("ModelObj:getAllLocally: Parsed modelobj -> "+JSON.stringify(obj));
                }
                return allModelObjs;
            }
        ).catch(function (error) {
            console.error('ModelObj:getAllLocally: '+error);
        })
};

let CompressionObj = function(compressionUUID,json) {
    console.log('Compression->'+compressionUUID+";;"+json);
    let jsonObj = isJsonParamValid(json); //might also contain false
    console.log("New compression->"+jsonObj+";;;"+jsonObj.accessLevel+";;;"+json);
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