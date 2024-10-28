const authMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/who');
    }
};

module.exports = authMiddleware;
