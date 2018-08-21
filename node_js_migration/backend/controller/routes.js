/** Define routes */
module.exports = {
    "/": {
        "get":get_index
    }
};

function get_index(req, res) {
    res.send('testget');
}

