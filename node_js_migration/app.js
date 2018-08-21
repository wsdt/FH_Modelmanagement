const express_app = require('./backend/server.js');
const contr_lang = require('./backend/controller/language.js');
const routes = require('./backend/controller/routes.js');

//Setup everything **********************************
setup_routes();
setup_locale();

/** React to pre-configured routes (from routes.js) */
function setup_routes() {
    let setup_route = function (key, methods) {
        /*key is the address of the url -> e.g. /, or /about
        * while value is an object which can consist of following
        * parts:
        *
        * {
        * "post":func, "get":func, "delete":func, "put":func
        * }
        *
        * No method must be provided for an uri. */

        let evaluate_route = function (method_name, method_func) {
            switch (method_name.toLowerCase()) {
                case "post":
                    express_app.post(key, method_func);
                    break;
                case "get":
                    express_app.get(key, method_func);
                    break;
                case "delete":
                    express_app.delete(key, method_func);
                    break;
                case "put":
                    express_app.put(key, method_func);
                    break;
                default:
                    console.error("app:setup_routes: HTTP-method not found -> " + method_name.toLowerCase());
            }
        };

        Object.entries(methods).forEach(
            ([method_name, method_func]) => evaluate_route(method_name, method_func)
        );
    };

    //for each object in routes (which consists multiple http methods)
    Object.entries(routes).forEach(
        ([key, methods]) => setup_route(key, methods)
    );
}

function setup_locale() {
    express_app.use(function(req,resp,next) {
        let lang = "en";//req.session.lang || "en";
        contr_lang.setLocale(lang);
        next();
    });


    express_app.helpers({
        translate: contr_lang.translate
    });
}


