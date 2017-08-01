const express = require('express')
const bodyParser = require('body-parser')
const   {getAlbums, getAlbumsByID} = require('./database/database')
const app = express()
const hbs = require('hbs');

 app.use(bodyParser.urlencoded({ extended: false }))



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
 app.set('view engine', 'hbs');
 app.set('views', './src/views');

app.get('/', (request, response) => {
  getAlbums((error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      response.render('index', { albums: albums })
    }
  })
})


app.get('/login', (request, response) => {
  getAlbums((error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      response.render('login', { albums: albums })
    }
  })
})


app.get('/album', (request, response) => {
  getAlbums((error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      response.render('album', { albums: albums })
    }
  })
})

app.get('/profile', (request, response) => {
  getAlbums((error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      response.render('profile', { albums: albums })
    }
  })
})

app.get('/review', (request, response) => {
  getAlbums((error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      response.render('newReview', { albums: albums })
    }
  })
})

app.get('/signup', (request, response) => {
  getAlbums((error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      response.render('signup', { albums: albums })
    }
  })
})

// app.get('/albums/:albumID', (request, response) => {
//   const albumID = request.params.albumID
//
//   database.getAlbumsByID(albumID, (error, albums) => {
//     if (error) {
//       response.status(500).render('error', { error: error })
//     } else {
//       const album = albums[0]
//       response.render('album', { album: album })
//     }
//   })
// })

app.use((request, response) => {
  response.status(404).render('not_found')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})
