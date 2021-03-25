const crypto = require('crypto');
module.exports = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(20, (err, buf) => {
            if(err) reject(err);
            else {
                let reset_token = buf.toString('hex');
                resolve(reset_token);
            }
        })
    })
};