const pgp = require('pg-promise')();
const dbName = 'vinyl'
const connectionString = process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`
const db = pgp(connectionString);
const bcrypt = require('bcrypt');
const saltRounds = 12;

const GET_ALL_USERS_REVIEWS = `SELECT  a.title, r.id, r.review,r.logged, u.username FROM albums a LEFT JOIN reviews r ON a.id = r.albums_id LEFT JOIN users u ON  r.users_id = u.id WHERE u.id = $1`;
const getAllUsersReviews = (users_id) => {
  console.log('im in here ====>',getAllReviews)
  return db.any(GET_ALL_USERS_REVIEWS, [users_id]);
};
const GET_ALL_ALBUMS = `SELECT * FROM albums`;
const getAllAlbums = () => {
  return db.many(GET_ALL_ALBUMS, []);
};

const GET_ALL_REVIEWS = `SELECT a.artist, a.title, r.id, r.review,r.logged, u.username, u.email FROM albums a LEFT JOIN reviews r ON a.id = r.albums_id LEFT JOIN users u ON  r.users_id = u.id   WHERE review is not NULL LIMIT 3`;
const getAllReviews = () => {
  return db.many(GET_ALL_REVIEWS, []);
};

const GET_ALBUMS_BY_ID = `SELECT * FROM albums WHERE  id = $1`;
const getAlbumsById = (albums_id) => {
  return db.one(GET_ALBUMS_BY_ID, [albums_id]);
};

const GET_AN_ALBUMS_REVIEWS = `SELECT a.artist, a.title,r.id, r.review,r.logged, u.username, u.email FROM albums a LEFT JOIN reviews r ON a.id = r.albums_id LEFT JOIN users u ON  r.users_id = u.id   WHERE review is not NULL AND a.id = $1`;
const getAnAlbumsReviews = (albums_id) => {
  return db.any(GET_AN_ALBUMS_REVIEWS, [albums_id]);
};

const DELETE_REVIEW = `DELETE FROM reviews WHERE id = $1`;
const deleteReviewById = (review_id) => {
  console.log('DB HANDLER FUNCTION')
    return db.none(DELETE_REVIEW, [review_id]);
  };

  const NEW_REVIEW = `INSERT INTO reviews (albums_id, review, users_id) VALUES($1, $2, $3) RETURNING *`
  const newReview = (options) => {
    return db.one(NEW_REVIEW, [options.albums_id, options.review, options.users_id]);
  };

  const CREATE_USER = `INSERT INTO users (username, password, email) VALUES($1, $2, $3) RETURNING *`;
  const createUser = (username,password,email) => {
    return bcrypt.hash(password, saltRounds)
    .then(function(hash) {
      return db.one(CREATE_USER, [username, hash, email]);
    });
  };

  const GET_USER_BY_ID = `SELECT * FROM users WHERE id = $1`
  const getUserById = (id) => {
    return db.one(GET_USER_BY_ID, [id]);
  };

const FIND_BY_USERNAME = `SELECT * FROM users WHERE username = $1`;
const findByUsername = (username) => {
  return db.one(FIND_BY_USERNAME, [username]);
};


const GET_USER_INFO_BY_ID= `SELECT * FROM users WHERE id = $1`;
const getUserInfoById= (id) => {
  return db.one(GET_USER_INFO_BY_ID, [id]);
};

module.exports = {
  getAllAlbums,
  getAllReviews,
  getAlbumsById,
  getAnAlbumsReviews,
  getAllUsersReviews,
  deleteReviewById,
  newReview,
  createUser,
  getUserById,
  findByUsername,
  getUserInfoById
}
