<?php

//SINGLETON and FACTORY PATTERN
class _MGR_FACTORY
{
    private static $SELF_REF;
    private $mgr_language;
    private $mgr_db;
    private $mgr_localJson;

    public static function getFactory() {
        if (empty(_MGR_FACTORY::$SELF_REF)) {
            _MGR_FACTORY::$SELF_REF = new _MGR_FACTORY();
        }
        return _MGR_FACTORY::$SELF_REF;
    }

    public function getMgrLanguage() {
        require_once "LanguageMgr.php";
        if (empty($this->mgr_language)) {
            $this->mgr_language = new mgr\LanguageMgr();
        }
        return $this->mgr_language;
    }

    public function getMgrDb() {
        require_once "DbMgr.php";
        if (empty($this->mgr_db)) {
            $this->mgr_db = new mgr\DbMgr();
        }
        return $this->mgr_db;
    }

    public function getMgrLocalJson() {
        require_once "LocalJsonMgr.php";
        if (empty($this->mgr_localJson)) {
            $this->mgr_localJson = new mgr\LocalJsonMgr();
        }
        return $this->mgr_localJson;
    }
}