const crypto = require('crypto');

module.exports = function(text) {
    return crypto.createHmac('sha256', 'jew_wallet')
        .update(text)
        .digest('hex');
};