const crypto = require('node:crypto');
function generateSecretKey() {
    const secret = crypto.randomBytes(64).toString('hex');
    console.log(`Generated JWT Secret Key: ${secret}`);
}

generateSecretKey();