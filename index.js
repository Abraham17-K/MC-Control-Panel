require("dotenv").config()
const express = require("express")
const app = express()
const port = 3000
const fs = require("fs")
const https = require("https")


app.use(express.json())


app.listen(port, () => {
     console.log(`App listening on port ${port}!`)
     if (!fs.existsSync("./servers")) {
          fs.mkdirSync('./servers')
     }
     if (!fs.existsSync("./servers/servers.json")) {
          fs.writeFileSync("./servers/servers.json", "{}")
     }
})


app.post("/createServer", (req, res) => {
     const serverName = req.body.name
     const software = req.body.software
     const data = fs.readFileSync("./servers/servers.json")
     const jsonData = JSON.parse(data)
     const keys = Object.keys(jsonData)
     if (keys.includes(serverName)) {
          res.send("Server name already exists")
          return
     }
     const serverObj = {
               "name": serverName,
               "software": software
     }
     fs.writeFileSync("./servers/servers.json", JSON.stringify(jsonData, null, 2))
     setupServer(serverName, software)
})


function setupServer(name, software) {
     const data = JSON.parse(fs.readFileSync("./servers/servers.json"))
     const urls = JSON.parse(fs.readFileSync("./softwares.json"))
     fs.mkdirSync(`./servers/${name}`)
     const file = fs.createWriteStream(`./servers/${name}/server.jar`)
     const request = https.get(urls[`${software}`], (response) => {
          response.pipe(file)

          file.on("finish", () => {
               file.close()
          })
     })
}