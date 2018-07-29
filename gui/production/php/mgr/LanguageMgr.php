<?php
namespace mgr {
    require_once "_conf.php";

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
                $this->languageJson = json_decode(file_get_contents("../lang/" . strtolower(LANG) . ".json"),true);
            }
            return $this->languageJson;
        }

        //GETTER/SETTER -----------------------------------------
        public function getLanguageJson()
        {
            return $this->languageJson; //won't be empty, bc. we have executed loadLanguageJson in constructor
        }
    }
}