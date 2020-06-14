const axios = require('axios');

const paystack = {
    async verifyPayment(ref, secret, next) {
        const options = {
            url: 'https://api.paystack.co/transaction/verify/' + encodeURIComponent(ref),
            headers: {
                authorization: secret,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            }
        }
        return axios(options);

    }
}

module.exports = paystack;