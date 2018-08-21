//https://github.com/AGROSICA/node-localize :)

const Mod_fs = require("fs");
const Mod_localize = require("localize");
let localize = loadTranslations();

function loadTranslations() {
    console.log("language:setLocale: Trying to load translations now.");
    return new Mod_localize(JSON.parse(Mod_fs.readFileSync("./backend/translations.json", "utf8")));
}

module.exports = localize;