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
    res.redirect("/general");
});

app.post("/category", function (req, res) {
    res.redirect("/" + req.body.categoryName.toLowerCase());
});

app.post("/delete", async function (req, res) {
    const id = req.body.checkbox;
    if (id) {
        try {
            await Item.deleteOne({ _id: id });
        } catch (err) {
            console.log(err);
        }
        res.redirect('back');
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
    let category = req.body.category.toLowerCase();
    if (req.body.newTodo != "") {
        try{
            await Item.create({
                name: req.body.newTodo,
                category: category,
                completed: false
            });
        } catch (err) {
            console.log(err);
        }
        res.redirect("/" + category);
    }
});

app.get("/categories/list", async function (req, res) {
    try{
        Item.collection.distinct("category", function (error, results) {
            console.log(results);
        });
    } catch (err) {
        console.log(err);
    }

    res.send("done");
});

app.listen(port, function () {
    console.log("Server is running");
});

