const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const review = await service.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: "Review cannot be found." });
}

async function update(req, res) {
  const original = res.locals.review;
  const updatedFields = req.body.data || {};

  const updatedReview = {
    ...original,
    ...updatedFields,
    review_id: original.review_id,
  };

  await service.update(updatedReview);

  const row = await service.readWithCritic(updatedReview.review_id);

  const {
    c_critic_id,
    preferred_name,
    surname,
    organization_name,
    ...reviewData
  } = row;

  res.json({
    data: {
      ...reviewData,
      critic: {
        critic_id: c_critic_id,
        preferred_name,
        surname,
        organization_name,
      },
    },
  });
}

async function destroy(req, res) {
  await service.delete(res.locals.review.review_id);
  res.sendStatus(204);
}

module.exports = {
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
