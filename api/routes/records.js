const { Router } = require('express')
const router = Router()
var fs = require('fs')
const path = require("path")

//const records = require('/assets/audio/audio-list.json')

/* GET records listing. */
router.get('/records', function (req, res) {
  const filePath = path.join(process.cwd(), '/assets/audio/audio-list.json');
  fs.readFile(filePath, 'utf8', (err, json) => {
    if (err) throw err;
    res.json(json)
  });  
})
module.exports = router