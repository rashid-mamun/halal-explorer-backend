function authorizeRoles(allowedRoles) {
    return (req, res, next) => {
        console.log(req.userRole);
        const userRole = req.userRole;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You do not have permission to access this resource.'
            });
        }

        next();
    };
}
module.exports = authorizeRoles;