require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')
const port = 3000

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')
const PRISMIC_ENDPOINT = process.env.PRISMIC_ENDPOINT

const handleLinkResolver = (doc) => {
  // Define the url depending on the document type
  // if (doc.type === 'page') {
  //   return '/page/' + doc.uid;
  // } else if (doc.type === 'blog_post') {
  //   return '/blog/' + doc.uid;
  // }

  // Default to homepage
  return '/'
}

// Middleware to inject prismic context
app.use((_req, res, next) => {
  res.locals.ctx = {
    endpoint: PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver
  }
  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM
  next()
})

const initApi = (req) =>
  Prismic.getApi(PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// About Route
app.get('/about', async (req, res) =>
  initApi(req).then((api) =>
    api
      .query(Prismic.Predicates.any('document.type', ['metadata', 'about']))
      .then((response) => {
        const { results } = response
        const [about, metadata] = results

        res.render('pages/about', {
          about,
          metadata
        })
      })
  )
)

app.get('/', (_req, res) => res.render('pages/home'))
app.get('/jewel/:uid', (_req, res) => res.render('pages/jewel'))
app.get('/collection', (_req, res) => res.render('pages/collection'))

app.listen(port, () =>
  console.log(`
    🚀 App listening on http://localhost:${port}!
  `)
)
