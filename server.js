const express = require("express");
const sequelize = require("./config/connection");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3001;
const path = require("path");
const routes = require("./routes")



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))


app.use(routes)


sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () =>
    console.log(`App listening on port localhost:${PORT}`)
  );
});
