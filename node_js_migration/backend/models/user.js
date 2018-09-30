let crypto = require('crypto');

class User {
    constructor(usr_id, usr_name, usr_mail, usr_hashedPwd, usr_salt, usr_prefLang) {
        /** User Id which identifies the user accross languages etc. (cleaner) */
        this.id = usr_id;
        /** Username has an unique constraint (in db), so we can also query
         * users by their nickname (non-case-sensitive).
         * Username is also used to determine userAvatar (in images/users/x.jpg) */
        this.name = usr_name;
        this.mail = usr_mail;
        /** As usual, we only save hashed pwds. We are using the crypt() method
         * to hash passwords. */
        this.hashedPwd = usr_hashedPwd;
        /** Also as usual we use salts to prevent rainbow table attacks etc. */
        this.salt = usr_salt;
        /** User preferences ------------------------------------
         -> User language (displaying language of contents) */
        this.prefLang = usr_prefLang;
    }

    static createUniqueId() {
        //Thanks to: http://www.frontcoded.com/javascript-create-unique-ids.html
        return "id-" + Math.random().toString(36).substr(2, 16);
    }

    static createNewSalt() {
        return crypto.randomBytes(32).toString('hex'); //or toString('base64')
    }

    static hashPassword(clearPwd, salt) {
        let hash = crypto.createHmac('sha512', salt);
        hash.update(clearPwd);
        return hash.digest('hex');
    }

    set clearPassword(clearPwd) {
        this.hashedPwd = User.hashPassword(clearPwd, User.createNewSalt());
    }

    isPasswordCorrect(clearPwd) {
        return (User.hashPassword(clearPwd, this.salt) === this.hashedPwd);
    }

    areUserCredentialsCorrect() {
        //TODO
        /*public static function areUserCredentialsCorrect($dbCon, $userName, $clearpassword)
    {
        $user = User::dbQueryWithUsername($dbCon, $userName);
        if (empty($user)) {
            return false;
        } else {
            return $user->isPasswordCorrect($clearpassword);
        }
    }*/
    }
}

module.exports = User;