// start.js
const mongoose = require('mongoose');
const { app } = require('./server');

const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/librarydb')
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("MongoDB connection error:", err));