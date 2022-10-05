const jwt = require("jsonwebtoken");

function generateAccessToken (user) {
    return jwt.sign(user, process.env.secretJWTKey, {expiresIn: "15m"});
}

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
  
    if (token == null) return res.render('login', { errors: ["You must be logged in to access that page"] });
  
    jwt.verify(token, process.env.secretJWTKey, (err, user) => {
        console.log(err)

        if (err) return res.render('login', { errors: '' });
        req.user = user

        next()
    })
}

function validatePassword(password) {
    var regEx = '(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$';
    var minLength = 8;
    var maxLength = 100;
    if (password.length < minLength || password.length > maxLength) {
        return false;
    }
    if (!regEx.test(password)) {
        return false;
    }
}

module.exports = { generateAccessToken, authenticateToken, validatePassword }