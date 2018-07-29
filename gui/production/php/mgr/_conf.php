<?php

/** Global configuration panel for not language-dependent values. */

/** Preconfigured json in txt>lang>*.json will be loaded.
 E.g. for "en" a file named "en.json" (not case sensitive) will be loaded.*/
namespace { //global namespace
    const LANG = "en";
}

/** In how many seconds should the session expire? (user get's logged out automatically after that time)*/
namespace SESSION {
    const SESSION_EXPIRATION = 10000;
}

/** DB Settings */
namespace DB {
    const DB_SERVERNAME = "127.0.0.1";
    const DB_NAME = "fhkufmodels";
    const DB_USERNAME = "root";
    const DB_PASSWORD = "";
}