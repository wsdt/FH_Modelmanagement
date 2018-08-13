<?php

namespace mgr {

    use classes\User;

    require_once "_conf.php";
    require_once "../classes/User.php";

    class LanguageMgr
    {
        private $languageJson; //no public setter

        //package-private
        function __construct()
        {
            $this->loadLanguageJson(); //load on instance creation
        }

        private function loadLanguageJson()
        {
            if (empty($this->languageJson)) {
                if (!session_id()) @ session_start(); //NO OUTPUT BEFORE
                if (empty($_SESSION)) {
                    $lang = DEFAULT_LANG;
                } else {
                    $lang = User::dbQueryWithUsername(\_MGR_FACTORY::getMgrDb()->getDbConnection(true),$_SESSION["userName"])->getPref_Lang();
                }

                $this->languageJson = json_decode(file_get_contents("../lang/" .
                    strtolower($lang) . ".json"), true);
            }
            return $this->languageJson;
        }

        /** @param lang: Format -> "en", "de", just the lang abbrevation
         according to the file names in lang/*.json */
        public static function isLanguageSupported($lang)
        {
            //Validate whether provided language is supported (otherwise use default lang)
            foreach(glob("../lang/*.json") as $langFile) {
                if(str_replace(basename($langFile),".json","")==$lang) {
                    return true;
                }
            }
            return false;
        }

        //GETTER/SETTER -----------------------------------------
        public
        function getLanguageJson()
        {
            return $this->languageJson; //won't be empty, bc. we have executed loadLanguageJson in constructor
        }
    }
}
