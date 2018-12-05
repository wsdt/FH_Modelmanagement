function parseJson(json) {
    let jsonObj;
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
            console.warn('isJsonParamValid: Provided json is not a string neither an object! Created empty obj. Constructor: ' + json.constructor);
            return false; //exit constructor
        }
    }
    return jsonObj;
}


class ModelObj {
    objectTripleID: string;
    description: string;
    mediaTripleID: string;
    createDate: string;
    creator: string;
    owner: string;
    uploader: string;
    MIMEtype: string;
    files: Compression[];

    constructor(objectTripleID: string, description: string, mediaTripleID: string, createDate: string, creator: string, owner: string, uploader: string, MIMEtype: string, files: Compression[]) {
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

    saveNewCompression(compressionJson: Compression) {
        //assuming that let is compressionObj (not a json etc.)
        this.files.push(compressionJson);
    }

    getFile(compressionUUID) {
        return this.files[compressionUUID];
    };

    saveLocally() {
        let strModelObj = JSON.stringify((this));
        console.log("modelObj:saveLocally: " + strModelObj + ";;" + JSON.stringify(this.files));

        fetch("/v1/model",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: strModelObj
            })
            .then(function (res) {
                console.log('Submitted json: ' + res);
            });
    }

    static getLocally(objectTripleID) {
        if (objectTripleID !== undefined && objectTripleID !== null) {
            console.log('Sending id to '+"/v1/model?objectTripleID=" + objectTripleID);
            return fetch("/v1/model?objectTripleID=" + objectTripleID)
                .then((resp) => resp.json())
                .then(function (res) {
                        let modelObj = ModelObj.mapJsonToInstance(res);
                        console.log('Received json: ' + JSON.stringify(res) + " / ModelObj: " + modelObj);
                        return modelObj;
                    }
                );
        }
    }

    static getAllLocally() {
        return fetch("/v1/model")
            .then((resp) => resp.json())
            .then(function (res) {
                    console.log("PHP Row json: " + JSON.stringify(res));

                    let allModelObjs = [];
                    for (let obj of res) {
                        allModelObjs.push(ModelObj.mapJsonToInstance(obj));
                        console.log("ModelObj:getAllLocally: Parsed modelobj -> " + JSON.stringify(obj));
                    }
                    return allModelObjs;
                }
            ).catch(function (error) {
                console.error('ModelObj:getAllLocally: ' + error);
            })
    };

    static mapJsonToInstance(json) {
        let jsonObj = parseJson(json);

        return new ModelObj(
            jsonObj.objectTripleID,
            jsonObj.description,
            jsonObj.mediaTripleID,
            jsonObj.createDate,
            jsonObj.creator,
            jsonObj.owner,
            jsonObj.uploader,
            jsonObj.MIMEtype,
            Compression.mapFilesJsonToInstances(jsonObj.files)
        );
    }
}


enum AccessLevel {
    Private = "private",
    Visit = "visit",
    Public = "public"
}

class Compression {
    compressionUUID: number;
    uploadDate: string;
    accessLevel: AccessLevel;
    license: string;
    fileSize: number;
    paths: string[];
    fileTypeSpecificMeta: string;

    constructor(compressUUID: number, uploadDate: string, accessLevel: AccessLevel, license: string, fileSize: number, paths: string[], fileTypeSpecificMeta: string) {
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
    static mapFilesJsonToInstances(json) {
        let jsonObj = parseJson(json);

        let comprArr = [];
        for (let jsonElem of jsonObj) {
            comprArr.push(new Compression(
                jsonObj.compressionUUID,
                jsonObj.uploadDate,
                jsonObj.accessLevel,
                jsonObj.license,
                jsonObj.fileSize,
                jsonObj.paths,
                jsonObj.fileTypeSpecificMeta
            ));
        }

        return comprArr;
    }

    static mapJsonToInstance(json) {
        let jsonObj = parseJson(json);

        return new Compression(
            jsonObj.compressionUUID,
            jsonObj.uploadDate,
            jsonObj.accessLevel,
            jsonObj.license,
            jsonObj.fileSize,
            jsonObj.paths,
            jsonObj.fileTypeSpecificMeta
        );
    }
}