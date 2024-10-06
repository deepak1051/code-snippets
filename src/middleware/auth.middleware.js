export const auth = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ msg: 'You must log in' });
  }

  next();
};
