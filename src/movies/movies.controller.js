const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const { is_showing } = req.query;
  const data =
    is_showing === "true" ? await service.listShowing() : await service.list();
  res.json({ data });
}

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found." });
}

function read(req, res) {
  res.json({ data: res.locals.movie });
}

async function listTheaters(req, res) {
  const data = await service.readTheaters(req.params.movieId);
  res.json({ data });
}

async function listReviews(req, res) {
  const rows = await service.readReviews(req.params.movieId);

  const data = rows.map((row) => {
    const { c_critic_id, preferred_name, surname, organization_name, ...review } =
      row;

    return {
      ...review,
      critic: {
        critic_id: c_critic_id,
        preferred_name,
        surname,
        organization_name,
      },
    };
  });

  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  listTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listTheaters),
  ],
  listReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listReviews)],
};
