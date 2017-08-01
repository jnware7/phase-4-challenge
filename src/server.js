const express = require('express')
const bodyParser = require('body-parser')
const   {getAlbums, getAlbumsByID, getAlbumByTitle} = require('./database/database')
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

app.get('/albums/:albumID', (request, response) => {
  const {albumID} = request.params
  getAlbumsByID(albumID, (error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      response.render('album')
    }
  })
})


// app.get('/album', (request, response) => {
//   getAlbums((error, albums) => {
//     if (error) {
//       response.status(500).render('error', { error: error })
//     } else {
//       response.render('album', { albums: albums })
//     }
//   })
// })
//
// app.get('/profile', (request, response) => {
//   getAlbums((error, albums) => {
//     if (error) {
//       response.status(500).render('error', { error: error })
//     } else {
//       response.render('profile', { albums: albums })
//     }
//   })
// })
//
// app.get('/review', (request, response) => {
//   const albumTitle = request.params.albumTitle
//   getAlbumByTitle(albumTitle, (error, albums) => {
//     if (error) {
//       response.status(500).render('error', { error: error })
//     } else {
//       console.log('album', album)
//       const album = albums[0]
//       response.render('newReview', { album: album })
//     }
//   })
// })
//
// app.get('/signup', (request, response) => {
//   getAlbums((error, albums) => {
//     if (error) {
//       response.status(500).render('error', { error: error })
//     } else {
//       response.render('signup', { albums: albums })
//     }
//   })
// })

// app.get('/albums/:albumID', (request, response) => {
//   const {albumID} = request.params
// console.log(getAlbumsByID(albumID))
//   getAlbumsByID(albumID, (error, albums) => {
//     if (error) {
//       response.status(500).render('error', { error: error })
//     } else {
//       response.render('album', { album: album[0] })
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
