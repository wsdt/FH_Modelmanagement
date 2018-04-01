<?php

//TODO: Saving works now, but we also have to decide whether we want to save or retrieve json! (add to submitted json and do our modelObj as data:{} nested
//Evaluate if fetch request was done to this file
$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

if ($contentType === "application/json") {
    //receive raw post data
    $content = trim(file_get_contents("php://input"));
    $decoded = json_decode($content, true);

    //If failed then evaluate here
    if (!is_array($decoded)) {
        //error
        echo "ERROR: Could not receive js fetch data.";
    } else {
        //successful
        LocalJsonMgr::saveJson($decoded["objectTripleID"],$content);
    }
}


/** Did not created a database, because I think in our case it makes more sense just so save all downloaded Jsons as
 Json files. So we don't have to map sql objs to php and then to js and back, but only have to read the files and
 give it to js. */

class LocalJsonMgr
{
    const DATA_BASE_PATH = "./../../data/";
    const FILE_EXTENSION = "json";

    /** Saves downloaded json files to /data/
     * Used for writing those three methods, because it might be useful to have more control over writing.*/
    public static function saveJson($jsonFileName,$json) {
        if (!empty($jsonFileName) && !empty($json)) {
            $jsonFile = fopen(self::DATA_BASE_PATH . $jsonFileName . "." . self::FILE_EXTENSION, "w") or die("LocalJsonMgr:saveJson: Could not save downloaded json!");
            fwrite($jsonFile, $json);
            fclose($jsonFile);
        }
    }

    public static function retrieveJson($jsonFileName) {
        if (!empty($jsonFileName)) {
            return file_get_contents(self::DATA_BASE_PATH . $jsonFileName . "." . self::FILE_EXTENSION);
        } else {
            return "";
        }
    }
}