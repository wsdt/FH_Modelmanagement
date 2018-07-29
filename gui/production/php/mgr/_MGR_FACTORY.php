<?php

//SINGLETON and FACTORY PATTERN
class _MGR_FACTORY
{
    private static $mgr_language;
    private static $mgr_db;
    private static $mgr_localJson;

    public static function getMgrLanguage() {
        require_once "LanguageMgr.php";
        if (empty(_MGR_FACTORY::$mgr_language)) {
            _MGR_FACTORY::$mgr_language = new mgr\LanguageMgr();
        }
        return _MGR_FACTORY::$mgr_language;
    }

    public static function getMgrDb() {
        require_once "DbMgr.php";
        if (empty(_MGR_FACTORY::$mgr_db)) {
            _MGR_FACTORY::$mgr_db = new mgr\DbMgr();
        }
        return _MGR_FACTORY::$mgr_db;
    }

    public static function getMgrLocalJson() {
        require_once "LocalJsonMgr.php";
        if (empty(_MGR_FACTORY::$mgr_localJson)) {
            _MGR_FACTORY::$mgr_localJson = new mgr\LocalJsonMgr();
        }
        return _MGR_FACTORY::$mgr_localJson;
    }
}