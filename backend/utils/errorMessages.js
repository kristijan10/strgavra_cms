export const httpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  INTERNAL_ERROR: 500,
};

export default {
  OK: {
    status: httpStatus.OK,
    message: "Zahtev je uspesno obradjen.",
  },
  CREATED: {
    status: httpStatus.CREATED,
    message: "Resurs je uspesno kreiran.",
  },
  NO_CONTENT: {
    status: httpStatus.NO_CONTENT,
    message: "Zahtev je uspesno obradjen, ali nema sadrzaja za prikaz.",
  },
  BAD_REQUEST: {
    status: httpStatus.BAD_REQUEST,
    message: "Neispravan zahtev. Proverite prosleđene parametre.",
  },
  UNAUTHORIZED: {
    status: httpStatus.UNAUTHORIZED,
    message: "Pristup odbijen. Potrebna je autentifikacija.",
  },
  FORBIDDEN: {
    status: httpStatus.FORBIDDEN,
    message: "Nemate dozvolu za pristup trazenom resursu.",
  },
  NOT_FOUND: {
    status: httpStatus.NOT_FOUND,
    message: "Trazeni resurs nije pronadjen.",
  },
  CONFLICT: {
    status: httpStatus.CONFLICT,
    message:
      "Doslo je do konflikta u podacima. Resurs vec postoji ili je stanje neuskladjeno.",
  },
  UNPROCESSABLE: {
    status: httpStatus.UNPROCESSABLE,
    message:
      "Zahtev nije moguce obraditi zbog semantickih gresaka ili neispravnih podataka.",
  },
  INTERNAL_ERROR: {
    status: httpStatus.INTERNAL_ERROR,
    message: "Doslo je do interne greske na serveru. Pokusajte ponovo kasnije.",
  },
};
