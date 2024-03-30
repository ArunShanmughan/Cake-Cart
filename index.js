const express = require("express");
const app = express();
const path = require("node:path");
const nocache = require("nocache")
const session = require('express-session');
require("dotenv").config()
const database = require("./config/mongodb")
database()

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
const router = require("./routes/userRoutes");

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(nocache())
app.use(router);


app.listen(3000, () => {
  console.log("The server is now live...");
});

