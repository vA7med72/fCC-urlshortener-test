// this is cloned from https://github.com/freeCodeCamp/boilerplate-project-urlshortener/
// it is edited to match the tests but only (almost) this file is edited 
const dns = require('dns');
require('dotenv').config();
const bodyParser = require('body-parser')
const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urlObjs = [{ original_url : 'https://freeCodeCamp.org', short_url : 1}]
let addurl;
// Your first API endpoint
app.route('/api/shorturl')
.post((req, res) => {
  let usableUrl = req.body.url.match(/(?<=:\/\/)[a-z0-9.]+/i) 
  if(!usableUrl) return res.json({"error": "Invalid url"})
  
  console.log(usableUrl)
  dns.lookup(usableUrl[0], {all: true}, (err) => {
    console.log(err)
    if(err) return res.json({"error": "Invalid Hostname"})
     else {
      addurl = req.body.url;
      const random = Math.floor(Math.random() * 1000) + 1 
      let ourObj = urlObjs.find(n => n['original_url'] == addurl)
      if(!ourObj) {
        urlObjs.push({"original_url": addurl, "short_url": random});
        res.json({"original_url": addurl, "short_url": random});
      } else res.json(ourObj)
    }
  })
});
app.get('/api/shorturl/:number?', (req, res) => {
  let ourObj = urlObjs.find(n => n['short_url'] == req.params.number);
  res.redirect(ourObj.original_url);
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
