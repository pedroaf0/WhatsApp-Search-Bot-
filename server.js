const express = require('express');
const cors = require('cors');

const { google } = require('googleapis');
require('dotenv').config();

const {SID , KEY, APIKEY, CX} = process.env

const client = require('twilio')(SID, KEY); 

const app = express();

const { PORT = 3000 } = process.env;

app.use(cors());

app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(express.json());


app.use(async (req, res, next) => {
  const options = {
    q: req.body.Body,
    auth: APIKEY,
    cx: CX
  };
  const customsearch = google.customsearch('v1');
  const result = await customsearch.cse.list(options);
  const firstResult = result.data.items[0];
  const searchData = firstResult.snippet;
  const link = firstResult.link;


  client.messages 
      .create({ 
         body: `${searchData} ${link}`, 
         from: req.body.To,       
         to:  req.body.From
       }) 
      .then(message => console.log(message.sid)) 
      .done();
      res.write('200')
      res.end();
});



app.listen(PORT, () => console.log(`App Listening on port ${PORT}`));

