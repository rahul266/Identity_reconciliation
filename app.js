const express = require('express')
const { applyRoutes } =require('./src/routes')
const app = express()
const router = express.Router()

app.use(express.json())

app.use(applyRoutes(router))

app.listen('8000', () => {
    console.log('server started at 8000')
})