require('dotenv').config();
const {USERNAME, PASSWORD} = process.env;
console.log(USERNAME, PASSWORD )
module.exports = {
    // PORT: 27017,
    url: `mongodb://${USERNAME}:${PASSWORD}@ds227325.mlab.com:27325/db_dev`
};