const express    = require("express")
const bodyParser = require("body-parser")
const app        = express()

const routes             = require("./routes")
const initializeDatabase = require("./src/database")  

initializeDatabase().then(db => {
  routes(app, db)
  require("dotenv").config()
  app.listen(process.env.SERVER_PORT, () => console.log(`Listening on port ${process.env.SERVER_PORT}`))
}).catch(err => {
  console.error("Failed to make database connection!")
  console.error(err)
  process.exit(1)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))