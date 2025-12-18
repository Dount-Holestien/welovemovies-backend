const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function reduceMovies(rows) {
  const theatersById = {};

  rows.forEach((row) => {
    const {
      theater_id,
      name,
      address_line_1,
      address_line_2,
      city,
      state,
      zip,
      movie_id,
      title,
      runtime_in_minutes,
      rating,
      description,
      image_url,
      is_showing,
    } = row;

    if (!theatersById[theater_id]) {
      theatersById[theater_id] = {
        theater_id,
        name,
        address_line_1,
        address_line_2,
        city,
        state,
        zip,
        movies: [],
      };
    }

    if (movie_id) {
      theatersById[theater_id].movies.push({
        movie_id,
        title,
        runtime_in_minutes,
        rating,
        description,
        image_url,
        is_showing,
        theater_id,
      });
    }
  });

  return Object.values(theatersById);
}

async function list(req, res) {
  const rows = await service.list();
  res.json({ data: reduceMovies(rows) });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
