const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const config = require('./config');
const mongoose = require('mongoose');


const apiRouter = require('./routers/apiRouter');
const devRouter = require('./routers/devRouter');

const {json} = require('body-parser')
const cors = require('cors');
mongoose.Promise = global.Promise;

mongoose.connect(config.url, {
    useMongoClient:true
})
.then(() => {
    console.log('connected')
})
.catch(console.error);

app.get('/', (req, res) => {
    res.send('the root is working')
})

app.use(json())
app.use(cors());
app.use('/api', apiRouter)
app.use('/dev', devRouter)




app.listen(PORT, () => {
    console.log(`THE server is listening on port ${PORT}`)
})

module.exports = app;