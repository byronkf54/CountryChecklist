const jwt = require("jsonwebtoken");

function generateAccessToken (user) {
    return jwt.sign(user, process.env.secretJWTKey, {expiresIn: "15m"});
}

module.exports = { generateAccessToken }