require('dotenv').config();
require('./src/config/db');

const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`Backend is running on ${PORT}`);
});