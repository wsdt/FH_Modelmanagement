//https://github.com/AGROSICA/node-localize :)


//TODO: CHANGE, as NOW OTHER FRAMEWORK USED (provide flexible interface for changing lang at runtime)
const Mod_fs = require("fs");
const Mod_localize = require("localize");
let localize = loadTranslations();

function loadTranslations() {
    console.log("language:setLocale: Trying to load translations now.");
    return new Mod_localize(JSON.parse(Mod_fs.readFileSync("./backend/translations.json", "utf8")));
}

module.exports = localize;
