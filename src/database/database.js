const pgp = require('pg-promise')();
const dbName = 'vinyl'
const connectionString = process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`
const db = pgp(connectionString);

const GET_ALL_ALBUMS = `SELECT * FROM albums`;
const getAllAlbums = () => {
  return db.many(GET_ALL_ALBUMS, []);
};

const GET_ALL_REVIEWS = `SELECT * FROM albums LIMIT 3`;
const getAllReviews = () => {
  return db.many(GET_ALL_REVIEWS, []);
};

const GET_ALBUMS_BY_ID = `SELECT * FROM albums WHERE id = $1`;
const getAlbumsByID = (id) => {
  return db.one(GET_ALBUMS_BY_ID, [id]);
};

const GET_AN_ALBUMS_REVIEWS = `SELECT * FROM reviews WHERE albums_id = $1`;
const getAnAlbumsReviews = (albums_id) => {
  return db.any(GET_AN_ALBUMS_REVIEWS, [albums_id]);
};

const GET_ALL_USERS_REVIEWS = `SELECT * FROM reviews WHERE users_id = $1`;
const getAlbumsByID = (users_id) => {
  return db.any(GET_ALBUMS_BY_ID, [users_id]);
};
const DELETE_REVIEW = `DELETE FROM reviews WHERE id = $1 RETURNING *`;
const deleteReviewById = (id) => {
    return db.one(DELETE_REVIEW, [id]);
  };

  const NEW_REVIEW = `INSERT INTO reviews (albums_id, review, users_id, logged) VALUES($1, $2, $3, $4) RETURNING *`
  const newReview = (options) => {
    return db.one(NEW_REVIEW, [options.albums_id, options.review, options.users_id, options.logged]);
  };

  const CREATE_USER = `INSERT INTO users (name, password, email) VALUES($1, $2, $3) RETURNING *`;
  const createUser = (name,password,email) => {
    return bcrypt.hash(password, saltRounds)
    .then(function(hash) {
      return db.one(CREATE_USER, [name, hash, email]);
    });
  };

  const GET_USER_BY_ID = `SELECT * FROM users WHERE id = $1`
  const getUserById = (id) => {
    return db.one(GET_USER_BY_ID, [id]);
  };

const FIND_BY_EMAIL = `SELECT * FROM users WHERE email = $1`;
const findByEmail = (email) => {
  return db.one(FIND_BY_EMAIL, [email]);
};


const GET_USER_INFO_BY_ID= `SELECT * FROM users WHERE id = $1`;
const getUserInfoById= (id) => {
  return db.one(GET_USER_INFO_BY_ID, [id]);
};

module.exports = {
  getAlbums,
  getAllReviews,
  getAlbumsById,
  getAnAlbumsReviews,
  deleteReviewById,
  newReview,
  createUser,
  getUserById,
  findByEmail,
  getUserInfoById
}
