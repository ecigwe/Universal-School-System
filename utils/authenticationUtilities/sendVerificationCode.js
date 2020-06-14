const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendVerificationCode = (user, verificationCode) => {
    client.messages.create({
        to: user.phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: `Your verification code is ${verificationCode}. Expires in 5 minutes.`
    });
}

module.exports = sendVerificationCode;