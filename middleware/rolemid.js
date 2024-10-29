const checkRole = (role) => {
    return (req, res, next) => {
      if (req.session.role !== role) {
        return res.status(403).send('Access denied.');
      }
      next();
    };
  };
module.exports=checkRole