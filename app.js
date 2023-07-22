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
mongoose.connect(uri)

app.get("/", function (req, res) {
    try {
        res.redirect("/general");
    } catch (err) {
        console.log(err);
    }
});

app.post("/category", function (req, res) {
    try {
        res.redirect("/" + req.body.categoryName.toLowerCase());
    } catch (err) {
        console.log(err);
    }
});

app.post("/delete", async function (req, res) {
    try {
        const id = req.body.checkbox;
        if (id) {
            await Item.deleteOne({ _id: id });
            res.redirect('back');
        }
    } catch (err) {
        console.log(err);
    }
});

app.get("/:category", async function (req, res) {
    try{
        const category = req.params.category;
        const items = await Item.find({category: category});
        res.render("list", { items: items, category: _.capitalize(category) });
    } catch (err) {
        console.log(err);
    }
});

app.post("/:category", async function (req, res) {
    try {
        let category = req.body.category.toLowerCase();
        if (req.body.newTodo != "") {
            await Item.create({
                name: req.body.newTodo,
                category: category,
                completed: false
            });
            res.redirect("/" + category);
        }
    } catch (err) {
        console.log(err);
    } 
});

app.get("/categories/list", async function (req, res) {
    try{
        Item.collection.distinct("category", function (error, results) {
            console.log(results);
        });
        res.send("done");
    } catch (err) {
        console.log(err);
    }
});

app.listen(port, function () {
    console.log("Server is running");
});

