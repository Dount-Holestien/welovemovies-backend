function asyncErrorBoundary(delegate, defaultStatus) {
  return (req, res, next) => {
    Promise.resolve()
      .then(() => delegate(req, res, next))
      .catch((error = {}) => {
        const {
          status = defaultStatus || 500,
          message = error.message || "Something went wrong",
        } = error;
        next({ status, message });
      });
  };
}

module.exports = asyncErrorBoundary;
