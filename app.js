const express = require('express');
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://skydark304:gony3004@cluster0.ngrxb.mongodb.net/test";


//localhost:3000

// index
app.get('/',async function(req,res){
    res.render('index');
})

// all product
app.get('/allproduct',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("toyDB");
    let results = await dbo.collection("myToy").find({}).toArray();
    res.render('allproduct',{model:results});
})

//search 
app.post('/doSearch',async (req,res)=>{
    let inputBrand = req.body.txtBrand;
    let client= await MongoClient.connect(url);
    let dbo = client.db("toyDB");
    let results = await dbo.collection("myToy").find({brand: new RegExp(inputBrand)}).toArray();
    res.render('allproduct',{model:results});

})

// insert
app.get('/insert',(req,res)=>{
    res.render('insert');
})

// insert form
app.post('/doInsert',async (req,res)=>{
     let inputName = req.body.txtName;
     let inputPrice = req.body.txtPrice;
     let inputBrand = req.body.txtBrand;
     let newProducts = { name : inputName , price : inputPrice , brand : inputBrand,};
     let client= await MongoClient.connect(url);
     let dbo = client.db("toyDB");
     await dbo.collection("myToy").insertOne(newProducts);
     res.redirect('/allproduct');
 })
 
app.get('/delete',async (req,res)=>{
    let inputId = req.query.id;
    let client= await MongoClient.connect(url);
    let dbo = client.db("toyDB");
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(inputId)};
    await dbo.collection("myToy").deleteOne(condition);
    res.redirect('/allproduct');

})

app.get('/update',async function(req,res){
    let inputId = req.query.id;
    let client= await MongoClient.connect(url);
    let dbo = client.db("toyDB");
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(inputId)};
    let results = await dbo.collection("myToy").find(condition).toArray();
    res.render('update',{model:results});
})

app.post('/doUpdate',async (req,res)=>{
    let inputId = req.body.txtId;
    let inputName = req.body.txtName;
    let inputPrice = req.body.txtPrice;
    let inputBrand = req.body.txtBrand;
    let Change = {$set:{name : inputName , price :inputPrice,brand : inputBrand}};
   let client= await MongoClient.connect(url);
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(inputId)};
    let dbo = client.db("toyDB"); 
    await dbo.collection("myToy").updateMany(condition,Change);
    res.redirect('/allproduct');
})  

const PORT = process.env.PORT || 3000;
var server=app.listen(PORT,function() {});

