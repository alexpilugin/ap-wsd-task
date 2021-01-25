const { Router } = require('express')
const router = Router()
var fs = require('fs')
const path = require("path")

const fileLocation = '/assets/audio/audio-list.json';

//const records = require('/assets/audio/audio-list.json')

/* GET records listing. */
router.get('/records', function (req, res) {
  const filePath = path.join(process.cwd(), fileLocation);
  fs.readFile(filePath, 'utf8', (err, json) => {
    if (err) throw err;
    res.json(json)
  });  
})

/* GET record by ID. */
router.get('/records/:album/:record', function (req, res, next) {
  const listId = req.params.album;
  const recordId = req.params.record;
  const filePath = path.join(process.cwd(), fileLocation);
  fs.readFile(filePath, 'utf8', (err, jsonFile) => {
    let found = null;
    if (err) throw err;

    const { lists } = JSON.parse(jsonFile)
    let foundList = lists.find(list => list.id === listId)
    if(foundList) {
      found = foundList.records.find(record => record.id === recordId) 
    }
    res.json(JSON.stringify(found))
  }); 
})

module.exports = router