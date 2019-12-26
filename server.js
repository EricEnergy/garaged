var express = require("express");
var session = require("express-session");
var passport = require("./config/passport");
var exphbs = require("express-handlebars");


var PORT = process.env.PORT || 3306;
var db = require("./models");

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// // Import routes and give the server access to them.
require("./routes/apiRoutes.js")(app);
require("./routes/htmlRoutes.js")(app);


// Start our server so that it can begin listening to client requests.
db.sequelize.sync({ /*force: true*/ } ).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});