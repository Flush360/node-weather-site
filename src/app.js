const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;
// paths for express
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(path.join(__dirname, "../public")));
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather app",
    name: "Van",
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About performance",
    name: "Van",
  });
});
app.get("/help", (req, res) => {
  res.render("help", {
    name: "Van",
    title: "Help",
  });
});
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Please provide an address",
    });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({
          error,
        });
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({
            error,
          });
        }
        console.log(location);
        console.log(forecastData);
        res.send({
          location,
          forecast: forecastData,
          address: req.query.address,
        });
      });
    }
  );
});
app.get("/help/*", (req, res) => {
  res.render("404", {
    errorMessage: "Help article not found",
    name: "Van",
    title: "404 /help",
  });
});
app.get("*", (req, res) => {
  res.render("404", {
    errorMessage: "Page not found",
    name: "Van",
    title: "404",
  });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
