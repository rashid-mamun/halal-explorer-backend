const jwt = require('jsonwebtoken');

const checkLogin = (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email, role } = decoded;
        req.userEmail = email;
        req.userRole = role;
        console.log(email);
        console.log(role);
        next();
    } catch {
        next('Authentication  failure');
    }
};
module.exports = checkLogin;