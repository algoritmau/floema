require("dotenv").config()

const express = require("express")
const app = express()
const path = require("path")
const port = 3000

const Prismic = require("@prismicio/client")
const PrismicDOM = require("prismic-dom")
const PRISMIC_ENDPOINT = process.env.PRISMIC_ENDPOINT

app.use((_req, res, next) => {
  // res.locals.Link = handleLinkResolver
  res.locals.PrismicDOM = PrismicDOM
  next()
})

const initApi = (req) =>
  Prismic.getApi(PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.get("/", async (req, res) => {
  const api = await initApi(req)
  const home = await api.getSingle("home")
  const metadata = await api.getSingle("metadata")
  const preloader = await api.getSingle("preloader")
  const { results: collections } = await api.query(
    Prismic.Predicates.at("document.type", "collection"),
    {
      fetchLinks: ["product.title", , "product.slug", "product.product_image"]
    }
  )

  res.render("pages/home", {
    home,
    metadata,
    preloader,
    collections
  })
})

app.get("/about", async (req, res) => {
  const api = await initApi(req)
  const about = await api.getSingle("about")
  const metadata = await api.getSingle("metadata")
  const preloader = await api.getSingle("preloader")

  res.render("pages/about", {
    about,
    metadata,
    preloader
  })
})

app.get("/collections", async (req, res) => {
  const api = await initApi(req)
  const metadata = await api.getSingle("metadata")
  const home = await api.getSingle("home")
  const preloader = await api.getSingle("preloader")
  const { results: collections } = await api.query(
    Prismic.Predicates.at("document.type", "collection"),
    {
      fetchLinks: ["product.title", , "product.slug", "product.product_image"]
    }
  )

  res.render("pages/collections", {
    collections,
    home,
    metadata,
    preloader
  })
})

app.get("/jewel/:uid", async (req, res) => {
  const api = await initApi(req)
  const metadata = await api.getSingle("metadata")
  const preloader = await api.getSingle("preloader")
  const product = await api.getByUID("product", req.params.uid, {
    fetchLinks: "collection.title"
  })

  res.render("pages/jewel", {
    metadata,
    product,
    preloader
  })
})

app.listen(port, () =>
  console.log(`
    🚀 App listening on http://localhost:${port}!
  `)
)
