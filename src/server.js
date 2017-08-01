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
       <li class='navbar-item'>profile<li>
       <li class='navbar-item'>/<li>
       <li class='navbar-item'>signout<li>
     </ul>
    </div>
  </nav>`);

 app.use(express.static('src/public'));
 app.set('views', './src/views');
 app.set('view engine', 'hbs');


// router.get('/', function(req,res){
//   getAllAlbums()
//   .then((albums)=>{
//   res.render('index' , {
//        albums:albums
//   })
//  }).catch((err) => {
//       console.log('errored1',err);
//   });
// });

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

router.get('/', (req, res) => {
  if (req.user) {
    res.redirect('/profile')
  } else {
    res.render('index');
  }
});

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

router.use((req, res, next) => {
  if(req.user) {
    next()
  } else {
    res.redirect('/login')
  }
})

router.get('/logout', (req,res) => {
  req.logout()
  res.redirect('/')
})

router.get('/profile', (req, res) => {
  const userid = req.user.id
  Promise.all([
    getUserById(userid),
    getAllUsersReviews (userid)
  ])
  .then(results => {
    const user = results[0]
    const reviews = results[1]
console.log('reviews===>', reviews)
    res.render('profile', {
      user: user,
      reviews: reviews
    })
  }).catch( err => {
    console.error(err)
  })
})
app.use('/', router)

// app.use((request, response) => {
//   response.status(404).render('not_found')
// })

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})
