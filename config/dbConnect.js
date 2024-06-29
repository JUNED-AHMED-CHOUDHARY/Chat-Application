const mongoose = require("mongoose");

require("dotenv").config();
 

const dbConnect = async() => {
     
    await mongoose.connect(process.env.MONOGDB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true, 
    })
    .then(() => {
        console.log("database connection successfull !!!");
    })
    .catch(err => {
        console.log(`errur while connecting database ${err.message}`);
    })
}

module.exports = dbConnect;