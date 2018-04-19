<?php

if (!empty($_GET)) {
    if (!empty($_GET['objectTripleID'])) {
        echo LocalJsonMgr::retrieveJson($_GET['objectTripleID']);
    } else if (!empty($_GET['getAllModelObjs']) && ($_GET['getAllModelObjs']===true || $_GET['getAllModelObjs']==="true")) {
        echo LocalJsonMgr::retrieveAllJsons();
    } else {
        echo "ERROR: Invalid Get request: ".$_GET['getAllModelObjs'];
    }
} else {
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
            LocalJsonMgr::saveJson($decoded["objectTripleID"], $content);
        }
    } else {
        echo "ERROR: Invalid call.";
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
            return "ERROR: Could not receive json. Maybe not found.";
        }
    }

    public static function retrieveAllJsons() {
        $files = array_diff(scandir(self::DATA_BASE_PATH),array('.','..'));
        $resultSet = "[";
        $count = 0;
        foreach ($files as $file) {
            if (($count++) > 0) {
                $resultSet .= ",";
            }
            $resultSet .= self::retrieveJson(str_replace('.json','',$file));
        }
        $resultSet .= "]";
        return $resultSet;
    }
}