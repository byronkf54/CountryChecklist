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

module.exports = { generateAccessToken, authenticateToken }