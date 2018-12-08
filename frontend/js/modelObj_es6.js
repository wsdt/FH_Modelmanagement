function parseJson(json) {
    var jsonObj;
    if (json === null) {
        console.warn('isJsonParamValid: Provided json is null. Created empty obj.');
        return false; //just in case
    }
    else if (json === undefined) {
        console.warn('isJsonParamValid: Provided json is undefined. Created empty one.');
        return false;
    }
    else {
        //provided param must be an array, obj or str
        if (json.constructor === "str".constructor) {
            //Provided param is a str (presumably an unparsed json obj)
            jsonObj = JSON.parse(json);
        }
        else if (json.constructor === {}.constructor || json.constructor === [].constructor) {
            jsonObj = json;
        }
        else {
            console.warn('isJsonParamValid: Provided json is not a string neither an object! Created empty obj. Constructor: ' + json.constructor);
            return false; //exit constructor
        }
    }
    return jsonObj;
}
var ModelObj = /** @class */ (function () {
    function ModelObj(objectTripleID, description, mediaTripleID, createDate, creator, owner, uploader, MIMEtype, files) {
        this.objectTripleID = objectTripleID;
        this.description = description;
        this.mediaTripleID = mediaTripleID;
        this.createDate = createDate;
        this.creator = creator;
        this.owner = owner;
        this.uploader = uploader;
        this.MIMEtype = MIMEtype;
        this.files = files;
    }
    ModelObj.prototype.saveNewCompression = function (compressionJson) {
        //assuming that let is compressionObj (not a json etc.)
        this.files.push(compressionJson);
    };
    ModelObj.prototype.getFile = function (compressionUUID) {
        return this.files[compressionUUID];
    };
    ;
    ModelObj.prototype.saveLocally = function () {
        var strModelObj = JSON.stringify((this));
        console.log("modelObj:saveLocally: " + strModelObj + ";;" + JSON.stringify(this.files));
        fetch("/v1/model", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: strModelObj
        })
            .then(function (resp) { return resp.json(); })
            .then(function (res) {
            new PNotify({
                title: res.res_title,
                text: res.res_text,
                type: res.notification_type,
                styling: 'bootstrap3'
            });
        });
    };
    ModelObj.getLocally = function (objectTripleID) {
        if (objectTripleID !== undefined && objectTripleID !== null) {
            console.log('Sending id to ' + "/v1/model?objectTripleID=" + objectTripleID);
            return fetch("/v1/model?objectTripleID=" + objectTripleID)
                .then(function (resp) { return resp.json(); })
                .then(function (res) {
                var modelObj = ModelObj.mapJsonToInstance(res);
                console.log('Received json: ' + JSON.stringify(res) + " / ModelObj: " + JSON.stringify(modelObj));
                return modelObj;
            });
        }
    };
    ModelObj.getAllLocally = function () {
        return fetch("/v1/model")
            .then(function (resp) { return resp.json(); })
            .then(function (res) {
            console.log("PHP Row json: " + JSON.stringify(res));
            var allModelObjs = [];
            for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
                var obj = res_1[_i];
                allModelObjs.push(ModelObj.mapJsonToInstance(obj));
                console.log("ModelObj:getAllLocally: Parsed modelobj -> " + JSON.stringify(obj));
            }
            return allModelObjs;
        }).catch(function (error) {
            console.error('ModelObj:getAllLocally: ' + error);
        });
    };
    ;
    ModelObj.mapJsonToInstance = function (json) {
        var jsonObj = parseJson(json);
        return new ModelObj(jsonObj.objectTripleID, jsonObj.description, jsonObj.mediaTripleID, jsonObj.createDate, jsonObj.creator, jsonObj.owner, jsonObj.uploader, jsonObj.MIMEtype, Compression.mapFilesJsonToInstances(jsonObj.files));
    };
    return ModelObj;
}());
var AccessLevel;
(function (AccessLevel) {
    AccessLevel["Private"] = "private";
    AccessLevel["Visit"] = "visit";
    AccessLevel["Public"] = "public";
})(AccessLevel || (AccessLevel = {}));
var Compression = /** @class */ (function () {
    function Compression(compressUUID, uploadDate, accessLevel, license, fileSize, paths, fileTypeSpecificMeta) {
        this.compressionUUID = compressUUID;
        this.uploadDate = uploadDate;
        this.accessLevel = accessLevel;
        this.license = license;
        this.fileSize = fileSize;
        this.paths = paths;
        this.fileTypeSpecificMeta = fileTypeSpecificMeta;
    }
    /**
     * //TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     *
     * let compressionUUIDs = Object.keys(filesObj);
     console.log('Compression UUIDs: '+compressionUUIDs+";;;"+compressionUUIDs.length);
     let compressionObjs = []; //TODO: statt array jsonObj mit UUID als key damit ausgangsjson und result gleich!
     for (let i = 0;i<compressionUUIDs.length;i++) {
                        compressionObjs.push((new CompressionObj(compressionUUIDs[i],filesObj[compressionUUIDs[i]]))); //.files[compressionUUIDs[i]])
                        console.log(compressionObjs[i]);
                    }
     jsonObj.files = compressionObjs; //as extra param bc. --> id : {provided obj}
     *
     * */
    Compression.mapFilesJsonToInstances = function (json) {
        var jsonObj = parseJson(json);
        console.warn("GOT: " + JSON.stringify(json) + "\nparsedJson: " + JSON.stringify(jsonObj));
        var comprArr = [];
        for (var _i = 0, jsonObj_1 = jsonObj; _i < jsonObj_1.length; _i++) {
            var jsonElem = jsonObj_1[_i];
            comprArr.push(new Compression(jsonElem.compressionUUID, jsonElem.uploadDate, jsonElem.accessLevel, jsonElem.license, jsonElem.fileSize, jsonElem.paths, jsonElem.fileTypeSpecificMeta));
        }
        console.warn("ARR: " + JSON.stringify(comprArr));
        return comprArr;
    };
    Compression.mapJsonToInstance = function (json) {
        var jsonObj = parseJson(json);
        return new Compression(jsonObj.compressionUUID, jsonObj.uploadDate, jsonObj.accessLevel, jsonObj.license, jsonObj.fileSize, jsonObj.paths, jsonObj.fileTypeSpecificMeta);
    };
    return Compression;
}());
