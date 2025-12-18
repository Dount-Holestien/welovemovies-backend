const knex = require("../db/connection");

function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

function update(updatedReview) {
  return knex("reviews")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview)
    .then(() => read(updatedReview.review_id));
}

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

function readWithCritic(review_id) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "r.review_id",
      "r.content",
      "r.score",
      "r.created_at",
      "r.updated_at",
      "r.critic_id",
      "r.movie_id",
      "c.critic_id as c_critic_id",
      "c.preferred_name",
      "c.surname",
      "c.organization_name"
    )
    .where({ "r.review_id": review_id })
    .first();
}

module.exports = {
  read,
  update,
  delete: destroy,
  readWithCritic,
};
