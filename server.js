var express = require("express");
var session = require("express-session");
var passport = require("./config/passport");
var exphbs = require("express-handlebars");
var compression = require('compression');

var PORT = process.env.PORT || 8080;
var db = require("./models");

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(compression());

app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(compression())
function shouldCompress(req, res){
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
 
  // fallback to standard filter function
  return compression.filter(req, res)
};

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/apiRoutes.js")(app);
require("./routes/htmlRoutes.js")(app);

db.sequelize.sync({ force: false } ).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});