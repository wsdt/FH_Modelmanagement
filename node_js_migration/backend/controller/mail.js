const mod_nodemailer = require('nodemailer');

const _CRED_GMAIL_USER = "fhkuf.modelmanagement@gmail.com";
const _CRED_GMAIL_PWD = "15qOf8mE8c9e2cf5";

class mail {
    static sendGMail(targetMail, mailSubject, mailText) {
        let transporter = mod_nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: _CRED_GMAIL_USER,
                pass: _CRED_GMAIL_PWD
            }
        });

        let mailOptions = {
          from: _CRED_GMAIL_USER,
          to: targetMail,
          subject: mailSubject,
          text: mailText
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
            } else {
                console.log('Email sent: '+info.response);
            }
        })
    }
}

module.exports = mail;