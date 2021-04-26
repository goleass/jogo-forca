const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const PORT = 7000;

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./controllers/userController')(app);

app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);