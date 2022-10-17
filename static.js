'use strict'

const http = require('node:http')
const path = require('node:path')
const fs = require('node:fs')
const checkUrlApi = require('./helpers/checkUrlApi')

module.exports = (root, port) => {
  http
    .createServer(async (req, res) => {
      const url = req.url === '/' ? '/index.html' : req.url
      if (checkUrlApi(url)) {
        return
      }
      const filePath = path.join(root, url)
      try {
        const data = await fs.promises.readFile(filePath)
        res.end(data)
      } catch (err) {
        res.statusCode = 404
        res.end('"File is not found"')
      }
    })
    .listen(port)

  console.log(`Static on port ${port}`)
}
