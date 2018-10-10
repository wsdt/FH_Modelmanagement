/** Throws an generic error so we know that authentication has failed.*/
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

/** Logs current user out.*/
function logout() {
    fetch('/v1/logout', {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({logout: true})
    }).then((res) => res.json())
        .then(res => {
            if (res !== undefined && res !== null && res !== "") {
                if (res.loggedOut) {
                    window.location = "/";
                }
                new PNotify({
                    title: res.res_title,
                    text: res.res_text,
                    type: res.notification_type,
                    styling: 'bootstrap3'
                });
            }
        })
        .catch(error => {
            console.error("auth:login: Could not logout -> "+JSON.stringify(error));
            new PNotify({
                title: 'Server Error',
                text: 'An error occurred. Please try it again.',
                type: 'error',
                styling: 'bootstrap3'
            });
        });
}

/** Sends fetch request to login user (better usability) */
function login(valUsername, valClearPwd) {
    fetch('/v1/login', {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({usr_name: valUsername, usr_clearPwd: valClearPwd})
    }).then((res) => res.json())
        .then(res => {
            if (res !== undefined && res !== null && res !== "") {
                if (res.user_authenticated) {
                    window.location = "/v1/upload";
                }
                new PNotify({
                    title: res.res_title,
                    text: res.res_text,
                    type: res.notification_type,
                    styling: 'bootstrap3'
                });
            }
        })
        .catch(error => {
            console.error("auth:login: Could not login -> "+JSON.stringify(error));
            new PNotify({
                title: 'Server Error',
                text: 'An error occurred. Please try it again.',
                type: 'error',
                styling: 'bootstrap3'
            });
        });
}

function register(valUsername, valEmail, valClearPwd) {
    fetch('/v1/register', {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({usr_name: valUsername, usr_clearPwd: valClearPwd, usr_mail:valEmail})
    }).then((res) => res.json())
        .then(res => {
            if (res !== undefined && res !== null && res !== "") {
                if (res.user_registered) {
                    window.location = "/#signin";
                }
                new PNotify({
                    title: res.res_title,
                    text: res.res_text,
                    type: res.notification_type,
                    styling: 'bootstrap3'
                });
            }
        })
        .catch(error => {
            console.error("auth:register: Could not register user -> "+JSON.stringify(error));
            new PNotify({
                title: 'Server Error',
                text: 'An error occurred. Please try it again.',
                type: 'error',
                styling: 'bootstrap3'
            });
        });
}

// Assumes that email is unique (see user.php)
function lostpassword(emailVal) {
    fetch('/v1/lostpwd', {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({usr_mail:emailVal})
    }).then((res) => res.json())
        .then(res => {
            if (res !== undefined && res !== null && res !== "") {
                if (res.pwd_resetted) {
                    window.location = "/#signin";
                }
                new PNotify({
                    title: res.res_title,
                    text: res.res_text,
                    type: res.notification_type,
                    styling: 'bootstrap3'
                });
            }
        })
        .catch(error => {
            console.error("auth:register: Could not register user -> "+JSON.stringify(error));
            new PNotify({
                title: 'Server Error',
                text: 'An error occurred. Please try it again.',
                type: 'error',
                styling: 'bootstrap3'
            });
        });
}
