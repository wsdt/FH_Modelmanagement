//https://github.com/AGROSICA/node-localize :)

function changeLang(langCode) {
    console.log("Language:changeLang: Changed user lang to "+langCode);
    $("[data-localize]").localize("application", {language: langCode, pathPrefix: "./lang"});
}
