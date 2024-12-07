const mongoose = require('mongoose');
const dbURL = process.env.dbURL;

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true}).then(()=> console.log('db connected'))
.catch((error) => console.error('db connection error', error));
