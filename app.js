const express = require("express");
const app = express();
const logger = require('morgan');
const log = require('./utils/logger').LOG
const dbConfig = require("./db.config/db.config")
const router = require('./src/router')
const mongoose = require('mongoose');


mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    })
  .then(() => {
    log.info('Connected to MongoDB');
  })
  .catch((err) => {
    log.error('Error connecting to MongoDB:', err);
  });



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api',router)




const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {

  log.info(`Server is running on port ${PORT}`);
});