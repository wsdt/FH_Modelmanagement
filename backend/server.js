const express = require("express");
const express_app = express();
const bodyParser = require("body-parser");
setup_8080();

// Functions ++++++++++++++++++++++++++++++
function setup_8080() {
  const mod_http = require("http");

  //Set static base url for all inline refs (stylesheets, js)
  express_app.use(express.static("frontend"));
  //enable json data body parsing
  express_app.use(bodyParser.json());
  express_app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );

  //Render engine
  express_app.engine("html", require("ejs").renderFile);
  express_app.set("view engine", "html");
  express_app.set("views", require("path").join(__dirname, "../frontend/html"));

  console.log("server.js:setup_8080: Port 8080 setup done.");
  return mod_http.createServer(express_app).listen(8080);
}

// Export to other files (to export multiple see: https://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules)
module.exports = express_app;

/*const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);

// Server config
app.use(express.static("frontend"));
//enable json data body parsing
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

//Render engine
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", require("path").join(__dirname, "../frontend/html"));


const wss = new WebSocket.Server({server});
wss.on('connection', (ws) => {
   console.log("New Client connected.");

    ws.on('message', (msg) => {
        switch (msg) {
            case 'model_list_changed': printAllModelTableRows('#queriedmodels', ModelObj.getAllLocally());break;
            default: console.warn("Received unknown event -> "+msg);
        }
    })
});
server.listen(8080, () => {
    console.log("server.js: Port 8080 setup done.");
});

module.exports = app;*/
