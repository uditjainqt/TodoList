const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var _ = require('lodash');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000;

const Item = require(__dirname + "/models/itemModel");
const date = require(__dirname + "/date")

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
const items = [];


const uri = "mongodb+srv://uj:wWbGuJwMi9y2cEn7@ujlist.w3ae9tm.mongodb.net/todolistDB?retryWrites=true&w=majority";
connect();

async function connect() {
    await mongoose.connect(uri).then(function () {
        console.log("Database connection successful");
    }).catch(function (err) {
        console.log("Error connecting to database");
        console.log(err);
    });
}

app.get("/", function (req, res) {
    res.redirect("/general");
});

app.post("/category", function (req, res) {
    res.redirect("/" + req.body.categoryName.toLowerCase());
});

app.post("/delete", async function (req, res) {
    const id = req.body.checkbox;
    if (id) {
        await Item.deleteOne({ _id: id }).then(function () {
            console.log("Item deleted");
        }).catch(function () {
            console.log("Error while deleting item");
        });
        res.redirect('back');
    }
});

app.get("/:category", async function (req, res) {
    const category = req.params.category;
    await Item.find({ category: category }).then(function (items) {
        res.render("list", { items: items, category: _.capitalize(category) });
    }).catch(function (err) {
        console.log("Error trying to find items for category: " + category);
        console.log(err);
        res.redirect("/");
    });
});

app.post("/:category", async function (req, res) {
    let category = req.body.category.toLowerCase();
    if (req.body.newTodo != "") {
        await Item.create({ name: req.body.newTodo, category: category, completed: false }).then(function () {
            console.log("Item created for category: " + category);
        }).catch(function () {
            console.log("Unable to create item for category: " + category);
        })
        res.redirect("/" + category);
    }
});

app.get("/categories/list", async function (req, res) {
    await Item.collection.distinct("category", function (error, results) {
        console.log(results);
    });
    res.send("done");
});

app.listen(port, function () {
    console.log("Server is running");
});

