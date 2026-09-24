/**
 * Standardized API response helpers
 */

const success = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
  };
  if (data !== null) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

const paginated = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

const created = (res, data, message = 'Created successfully') => {
  return success(res, data, message, 201);
};

const noContent = (res) => {
  return res.status(204).send();
};

module.exports = { success, paginated, created, noContent };
