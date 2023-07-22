const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var _ = require('lodash');
const { MongoClient, ServerApiVersion } = require('mongodb');

const Item = require(__dirname + "/models/itemModel");
const date = require(__dirname + "/date")

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
const port = 3000;
const items = [];


const uri = "mongodb+srv://uj:wWbGuJwMi9y2cEn7@ujlist.w3ae9tm.mongodb.net/todolistDB?retryWrites=true&w=majority";
mongoose.connect(uri)

app.post("/category", function (req, res) {
    res.redirect("/" + req.body.categoryName.toLowerCase());
})

app.post("/delete", async function (req, res) {
    const id = req.body.checkbox;
    if (id) {
        await Item.deleteOne({ _id: id });
        res.redirect('back');
    }
})

app.get("/", function (req, res) {
    res.redirect("/general");
})

app.get("/:category", async function (req, res) {
    const category = req.params.category;
    const items = await Item.find({category: category});
    res.render("list", { items: items, category: _.capitalize(category) });
});

app.post("/:category", async function (req, res) {
    let category = req.body.category.toLowerCase();
    if (req.body.newTodo != "") {
        await Item.create({
            name: req.body.newTodo,
            category: category,
            completed: false
        })
        res.redirect("/" + category);
    }
});

app.get("/categories/list", async function (req, res) {

    Item.collection.distinct("category", function(error, results){
        console.log(results);
      });

    res.send("done");
})

app.listen(port, function () {
    console.log("Server is running on port " + port);
});






// app.get("/", function (req, res) {
//     res.render("list", { listTitle: date.getDate(), items: items, category: "items" });
// });

// app.get("/work", function (req, res) {
//     res.render("list", { listTitle: "Work ToDo List", items: workItems, category: "work" });
// })

// app.post("/", function (req, res) {
//     let category = req.body.category;
//     if (req.body.newTodo != "") {
//         if (category === "work") {
//             workItems.push(req.body.newTodo);
//             res.redirect("/work");
//         } else {
//             items.push(req.body.newTodo);
//             res.redirect("/");
//         }
//     }
// });


