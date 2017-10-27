const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const config = require('./config');
const mongoose = require('mongoose');


const apiRouter = require('./routers/apiRouter');
const devRouter = require('./routers/devRouter');

const {json} = require('body-parser');
const cors = require('cors');
mongoose.Promise = global.Promise;

mongoose.connect(config.url, {
  useMongoClient:true
})
  .then(() => {
    console.log('connected');
  })
  .catch((err) => {
    if(err) console.log('could not connect to the database');
  });

app.get('/', (req, res) => {
  res.send('the root is working');
});


app.use(json());
app.use(cors());

app.use('/api', apiRouter);
app.use('/dev', devRouter);

app.use('/*', (req, res, next) => {
  next({type: 404});
});

app.use((err, req, res, next) => {
  if(err.type === 400) return res.status(400).send({msg: 'invalid input'});
  else if(err.type === 404) return res.status(404).send({msg: 'sorry data not found'});
  else if(err.type === 204) return res.status(204).send({msg: 'Server processed request but user is already deleted'});
  next(err);
});

app.use((err, req, res) => {
  return res.status(500).send({err});
});



app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});

module.exports = app;