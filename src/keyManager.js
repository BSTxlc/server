const { generateKeyPairSync } = require('crypto');
const jwt = require('jsonwebtoken');

// 當前密鑰對
let currentKeyPair = generateKeyPairSync('rsa', { modulusLength: 2048 });

/**
 * 刷新密鑰對
 */
function refreshKey() {
    currentKeyPair = generateKeyPairSync('rsa', { modulusLength: 2048 });
    console.log('密鑰已刷新');
}

/**
 * 獲取當前私鑰（用於簽名）
 */
function getPrivateKey() {
    return currentKeyPair.privateKey.export({ type: 'pkcs1', format: 'pem' });
}

/**
 * 獲取當前公鑰（用於驗證）
 */
function getPublicKey() {
    return currentKeyPair.publicKey.export({ type: 'pkcs1', format: 'pem' });
}

/**
 * 使用當前私鑰簽名數據
 * @param {Object} payload - 要簽名的數據
 * @returns {string} - 簽名後的 Token
 */
function signToken(payload) {
    const privateKey = getPrivateKey();
    return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
}

/**
 * 使用當前公鑰驗證 Token
 * @param {string} token - 要驗證的 Token
 * @returns {Object|boolean} - 驗證結果或 false
 */
function verifyToken(token) {
    const publicKey = getPublicKey();
    try {
        return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    } catch (err) {
        console.error('Token 驗證失敗:', err.message);
        return false;
    }
}

// 定時刷新密鑰（每 24 小時刷新一次）
setInterval(refreshKey, 24 * 60 * 60 * 1000);

module.exports = {
    refreshKey,
    signToken,
    verifyToken,
};