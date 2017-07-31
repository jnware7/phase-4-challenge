const express = require('express')
const bodyParser = require('body-parser')
const   {getAlbums, getAlbumsByID} = require('./database/database')
const app = express()

const hbs = require('hbs');
app.set('view engine', 'hbs');
app.set('views', './src/views');

app.use(express.static('src/public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (request, response) => {
  getAlbums((error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      response.render('index', { albums: albums })
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
