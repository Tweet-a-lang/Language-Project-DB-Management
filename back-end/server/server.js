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
  .catch(console.error);

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
  if(err.type === 403) return res.status(403).send({msg: 'invalid input'});
  else if(err.type === 404) return res.status(404).send({msg: 'sorry page not found'});
  next(err);
});

app.use((err, req, res, next) => {
  return res.status(500).send({err});
});



app.listen(PORT, () => {
  console.log(`THE server is listening on port ${PORT}`);
});

module.exports = app;