import errorMessages from "../errorMessages.js";

// user je sacuvan unutar request zahteva, te mu imam pristup ako je korisnik autentifikovan (prijavljen)
export default (allowedRoles) => {
  return (req, res, next) => {
    const role = req.user.role;

    const rolesArray = Array.isArray(allowedRoles)
      ? allowedRoles
      : [allowedRoles];

    if (!rolesArray.includes(role))
      return res
        .status(errorMessages.UNAUTHORIZED.status)
        .send({ message: errorMessages.UNAUTHORIZED.message });

    next();
  };
};
