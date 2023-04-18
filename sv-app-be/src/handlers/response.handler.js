const responseWithData = (res, statusCode, data) =>
  res.status(statusCode).json(data);

const badrequest = (res, { err }) =>
  responseWithData(res, 400, {
    status: 400,
    message: err,
  });

const ok = (res, data) => responseWithData(res, 200, { status: 200, data });

const created = (res, data) =>
  responseWithData(res, 201, {
    status: 201,
    data,
  });

const unauthorize = (res, { err }) =>
  responseWithData(res, 401, {
    status: "401",
    message: err,
  });

const notfound = (res, { err }) => {
  responseWithData(res, 404, {
    status: 404,
    message: err,
  });
};

const unprocessableEntity = (res, { err }) =>
  responseWithData(res, 422, { status: 422, message: err });

const error = (res, err) => responseWithData(res, 500, { status: 500, err });

module.exports = {
  ok,
  error,
  created,
  badrequest,
  notfound,
  unauthorize,
  unprocessableEntity,
};
