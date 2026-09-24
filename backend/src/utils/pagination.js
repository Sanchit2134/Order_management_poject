const AppError = require("./AppError");

function getPaginationParams(query) {
  const hasPagination = query.page !== undefined || query.limit !== undefined;
  if (!hasPagination) return null;

  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    throw new AppError(
      "page must be at least 1 and limit must be between 1 and 100",
      400,
      "INVALID_PAGINATION",
    );
  }

  return { page, limit, skip: (page - 1) * limit };
}

function createPaginationMeta({ page, limit, totalItems }) {
  return {
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  };
}

module.exports = { getPaginationParams, createPaginationMeta };
