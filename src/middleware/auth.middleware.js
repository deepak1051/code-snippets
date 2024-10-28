export const auth = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ message: "You must log in" });
  }

  next();
};

export const admin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ message: "You must log in" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(401).send({ message: "You must be an admin" });
  }

  next();
};
