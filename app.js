const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");


const mesajInceputRecenzie = "Prietenii noștri au zis:";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://bogdan-admin:Test123@cluster0.naqwc.mongodb.net/casacubDB", {
  useNewUrlParser: true,
});

//----- Reviews -------

const reviewsSchema = {
  name: String,
  content: String
};

const Review = mongoose.model("Review", reviewsSchema);

const review1 = new Review({
  name: "Bogdan Andrei",
  content: "Foarte fain a fost la voi."
});

const review2 = new Review({
  name: "Puscas Bogdan",
  content: "Destul de bine."
});

const defaultReviews = [review1, review2];

//----- Reservations -------

const reservationsSchema = {
  name: String,
  email: String,
  phone: String,
  adult: String,
  children: String,
  checkin: String,
  checkout: String,
  cabin: String
};

const Reservation = mongoose.model("Reservation", reservationsSchema);


app.get("/", function(req, res) {
  res.render("home");
});

app.get("/rezervare", function(req, res) {
  res.render("rezervare");
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.get("/partia_toplita", function(req, res) {
  res.render("partia_toplita");
});

app.get("/alpine_coaster", function(req, res) {
  res.render("alpine_coaster");
});

app.get("/centru_wellness", function(req, res) {
  res.render("centru_wellness");
});

app.get("/strand_banffy", function(req, res) {
  res.render("strand_banffy");
});

app.get("/strand_urmanczy", function(req, res) {
  res.render("strand_urmanczy");
});

app.get("/cascada_toplita", function(req, res) {
  res.render("cascada_toplita");
});

app.get("/liberty_toplita", function(req, res) {
  res.render("liberty_toplita");
});

app.get("/manastire_toplita", function(req, res) {
  res.render("manastire_toplita");
});

app.get("/trasee_turistice", function(req, res) {
  res.render("trasee_turistice");
});

app.get("/recenzii", function(req, res) {

  Review.find({}, function(err, foundReviews) {

    if (foundReviews.length === 0) {
      Review.insertMany(defaultReviews, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Review-urile initiale salvate in DB.");
        }

      });
      res.redirect("/recenzii");

    } else {
      res.render("recenzii", {
        inceputRecenzie: mesajInceputRecenzie,
        posts: foundReviews
      });
    }
  });

});


app.get("/adauga_recenzie", function(req, res) {
  res.render("adauga_recenzie");
});

app.get("/rezervat", function(req, res) {
  res.render("rezervat");
});

app.get("/ocupat", function(req, res) {
  res.render("ocupat");
});

app.get("/contactat", function(req, res) {
  res.render("contactat");
});

app.post("/adauga_recenzie", function(req, res) {
  const reviewName = req.body.postName;
  const reviewMessage = req.body.postBody;

const review = new Review({
  name: reviewName,
  content: reviewMessage
});

  review.save();

  res.redirect("/recenzii");

});

app.post("/rezervare", function(req, res) {

  const rezervare_cub = new Reservation({
    name: req.body.visitor_name,
    email: req.body.visitor_email,
    phone: req.body.visitor_phone,
    adult: req.body.total_adults,
    children: req.body.total_children,
    checkin: req.body.checkin,
    checkout: req.body.checkout,
    cabin: req.body.room_preference
  });

Reservation.findOne({checkin: req.body.checkin, cabin: req.body.room_preference}, function(err, foundCheckin){
  if(!err){
    if(!foundCheckin){
      rezervare_cub.save();

res.render("rezervat");
    }else {
      res.render("ocupat");
    }
  }
});

});

app.post("/contact", function(req, res) {
  const mesajContact = {
    name: req.body.contactName,
    email: req.body.contactEmail,
    message: req.body.contactMessage
  };

  console.log(mesajContact);

  res.redirect("/contactat");


});




let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully.");
});
