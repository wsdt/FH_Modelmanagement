/** Contains login and registration procedures */

/** Throws an generic error so we know that authentication has failed.*/
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

/** Sends fetch request to login user (better usability) */
function login(userName, clearPassword) {
    let userCredentialsJson = '{"username":"'+userName+'", "clearPassword":"'+clearPassword+'"}';

    fetch("./php/AuthenticationMiddleware.php",
        {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: userCredentialsJson
        })
        .then(handleErrors)
        .then((resp) => resp.json())
        .then(function(res) {
            console.log('Submitted userCredentialsJson: '+res);
        })
        .catch(function(error) {
            console.error("Authentication has failed->"+error);
        });
}