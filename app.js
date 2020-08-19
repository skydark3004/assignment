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
app.get('/product',async function(req,res){
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
    //let results = await dbo.collection("myToy").find({brand: new RegExp(inputBrand)}).toArray(); //phân biệt in hoa in thường
     let results = await dbo.collection("myToy").find({brand: new RegExp(inputBrand,'i')}).toArray(); // không phân biệt in hoa in thường
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
    if(inputName.trim().length == 0 || inputPrice.trim().length == 0 || inputBrand.trim().length == 0 )
    {
        let modelError = {nameError:"Please insert Name of Toy",
                          priceError:"Please insert Price of Toy",
                          brandError:"Please insert Brand of Toy"};
        res.render('insert',{model:modelError});
    }else
    {     
        await dbo.collection("myToy").insertOne(newProducts);
        res.redirect('/product');
    
    }
})
 
app.get('/delete',async (req,res)=>{
    let inputId = req.query.id;
    let client= await MongoClient.connect(url);
    let dbo = client.db("toyDB");
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(inputId)};
    await dbo.collection("myToy").deleteOne(condition);
    res.redirect('/product');

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
    res.redirect('/product');
})  

const PORT = process.env.PORT || 3000;
var server=app.listen(PORT,function() {});

