require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const userExists = await User.findOne({ email: "test2@test.com" });
      console.log("UserExists:", userExists);
      const user = await User.create({
        name: "Test",
        email: "test2@test.com",
        password: "password123",
        role: 'Patient',
        specialty: undefined
      });
      console.log("User created:", user.email);
    } catch(e) {
      console.log("Error inside:", e.message);
    }
    process.exit(0);
  });
