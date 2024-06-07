const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use(loginRouter);
app.use(signupRouter);

app.listen(3000);
