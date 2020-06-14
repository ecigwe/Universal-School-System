// const nodemailer = require('nodemailer');
// const pug = require('pug');
// const htmlToText = require('html-to-text');

// module.exports = class sendEmail {
//     constructor(user) {
//         this.to = user.email;
//         this.fullname = user.fullname;
//         this.from = process.env.COMPANY_EMAIL_ADDRESS
//     }

//     transporter() {
//         if (process.env.NODE_ENV === 'production') {
//             return nodemailer.createTransport({
//                 service: 'SendGrid',
//                 auth: {
//                     user: process.env.SENDGRID_USERNAME,
//                     pass: process.env.SENDGRID_PASSWORD
//                 }
//             });
//         }

//         return nodemailer.createTransport({
//             host: process.env.MAIL_HOST,
//             port: process.env.MAIL_PORT,
//             auth: {
//                 user: process.env.MAIL_USERNAME,
//                 pass: process.env.MAIL_PASSWORD
//             }
//         });
//     }

//     async sendThisMail(emailTemplate, emailSubject) {
//         const html = pug.renderFile(`../dev-data/${emailTemplate}.pug`, {
//             fullname: this.fullname,
//             emailSubject
//         });

//         const mailOptions = {
//             from: this.from,
//             to: this.to,
//             subject: emailSubject,
//             html,
//             text: htmlToText.fromString(html)
//         }

//         await this.transporter().sendMail(mailOptions);
//     }

//     async sendWelcomeEmail() {
//         await this.sendThisMail('welcome', 'Welcome To The Universal School System');
//     }
// }