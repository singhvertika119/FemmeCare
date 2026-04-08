require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected");
    process.exit(0);
  })
  .catch((e) => {
    console.log("Error:", e.message);
    process.exit(1);
  });
