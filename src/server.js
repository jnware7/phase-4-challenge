const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const { passport } = require('./auth');

const   {getAllAlbums,
getAllReviews,
getAlbumsById,
getAnAlbumsReviews,
getAllUsersReviews,
deleteReviewById,
newReview,
createUser,
getUserById,
findByUsername,
getUserInfoById} = require('./database');

const app = express()
const router = express.Router();

 app.use(bodyParser.urlencoded({ extended: false }))
 app.use(session({ secret: 'keyboard cat' }));
 app.use(cookieParser());
 app.use(passport.initialize());
 app.use(passport.session());


hbs.registerPartial('nav',`<nav class='navbar'>
  <div class='container'>
    <ul class='navbar-list'>
        <li class='navbar-item-left'>
          <h3>Vinyl</h3>
        <li>
      <li class='navbar-item'><a href='/signup'>login</a><li>
        <li class='navbar-item'>/<li>
      <li class='navbar-item'><a href='/login'>signin</a><li>
    </ul>
   </div>
 </nav>`);

 hbs.registerPartial('nav2',`<nav class='navbar'>
   <div class='container'>
     <ul class='navbar-list'>
         <li class='navbar-item-left'>
           <h3>Vinyl</h3>
         <li>
       <li class='navbar-item'><a href='/signup'>profile</a><li>
       <li class='navbar-item'>/<li>
       <li class='navbar-item'><a href='/logout'>signout</a><li>
     </ul>
    </div>
  </nav>`);
  hbs.registerPartial('nav3',`<nav class='navbar'>
    <div class='container'>
      <ul class='navbar-list'>
          <li class='navbar-item-left'>
            <h3>Vinyl</h3>
          <li>
        <li class='navbar-item'><a href='/logout'>signout</a><li>
        <li class='navbar-item'>/<li>
        <li class='navbar-item'><a href='/index'>home</a><li>
      </ul>
     </div>
   </nav>`);

 app.use(express.static('src/public'));
 app.set('views', './src/views');
 app.set('view engine', 'hbs');

router.get('/', (req, res) => {
  Promise.all([
    getAllAlbums(),
    getAllReviews()
  ])
  .then(results => {
    const albums = results[0]
    const reviews = results[1]
    res.render('index', {
      albums: albums,
      reviews: reviews
    })
  }).catch( err => {
    console.error(err)
  })
})

router.get('/albums/:albumId', (req, res) => {
  const {albumId} = req.params
  Promise.all([
    getAlbumsById(albumId),
    getAnAlbumsReviews(albumId)
  ])
  .then(results => {
    console.log(results)
    const albums = results[0]
    const reviews = results[1]
    res.render('album', {
      albums: albums,
      reviews: reviews
    })
  }).catch( err => {
    console.error(err)
  })
})


// router.get('/', (req, res) => {
//   if (req.user) {
//     res.redirect('/profile')
//   } else {
//     res.render('signup');
//   }
// });

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/signup', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  createUser(username, password, email)
    .then(user=>{
      res.redirect('/')
    });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.render('login', {message: "Invalid Username or Password"}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/profile');
    });
  })(req, res, next);
});

// router.use((req, res, next) => {
//   if(req.user) {
//     next()
//   } else {
//     res.redirect('/')
//   }
// })


router.get('/newreview', (req, res) => {
    res.render('newReview');
});

router.post('/newreview', (req, res) => {
  const albums_id = req.body.albums_dropdown
  const users_id = req.user.id
  const review = req.body.review

  console.log('USERS_ID: ===>', req.user);

  newReview({
    albums_id: albums_id,
    users_id: users_id,
    review: review
  })
  .then(() => {
    res.redirect('/profile')
  })
})

router.get('/logout', (req,res) => {
  req.logout()
  res.redirect('/')
});

router.get('/profile', (req, res) => {
  const userid = req.user.id
  Promise.all([
    getUserById(userid),
    getAllUsersReviews (userid)
  ])
  .then(results => {
    const user = results[0]
    const reviews = results[1]
    res.render('profile', {
      user: user,
      reviews: reviews
    })
  }).catch( err => {
    console.error(err)
  })
})

router.get('/delete/:reviewId', (req, res) => {
  const reviewId = req.param.id
  deleteReviewById(reviewId)
  .then(() => {
    res.redirect('/profile')
  })
})


app.use('/', router)
//
// app.use((request, response) => {
//   response.status(404).render('not_found')
// })

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})
