const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const PORT = process.env.PORT || 7000;

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./controllers/AuthController')(app);
require('./controllers/userController')(app);
require('./controllers/UserCategories')(app);
require('./controllers/UserWords')(app);
require('./controllers/RankingController')(app);

app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);