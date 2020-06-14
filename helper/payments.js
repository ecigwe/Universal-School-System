//will be deleted later before production
const payment = (request) => {

    const initializePayment = (form, secret, cb) => {
        const options = {
            url: 'https://api.paystack.co/transaction/initialize',
            headers: {
                authorization: secret,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            },
            form
        }
        const callback = (error, response, body) => {
            return cb(error, body)
        }
        request.post(options, callback)
    }

    const verifyPayment = (ref, secret, cb) => {
        const options = {
            url: 'https://api.paystack.co/transaction/verify/' + encodeURIComponent(ref),
            headers: {
                authorization: secret,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            }
        }
        const callback = (error, response, body) => {
            return cb(error, body)
        }
        request(options, callback)
    }

    const initializeRecipient = (data, cb) => {
        const options = {
            url: "https://api.paystack.co/transferrecipient",
            headers: {
                authorization: secret,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            },
            data
        }
        const callback = (error, response, body) => {
            return cb(error, body)
        }
        console.log(secret);
        request.post(options, callback)
    }

    const verifyAccountNumber = (account_number, bank_code, cb) => {
        const options = {
            url: `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
            headers: {
                authorization: secret,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            }
        }
        const callback = (error, response, body) => {
            return cb(error, body)
        }
        request(options, callback)
    }

    return { initializePayment, verifyPayment, verifyAccountNumber, initializeRecipient };
}

module.exports = payment;