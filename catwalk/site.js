const express = require('express');
const app = express();
const port = 3001;
var path = require('path');
var cookieParser = require('cookie-parser');
var showItems = true;

app.use(cookieParser());

//serves homeSite.html and sets first-party cookie
app.get('/', function (req, res) {
    res.cookie("shoesite-cookie", new Date().toISOString());
    res.sendFile(path.join(__dirname+"/home.html"));
});

app.get('/favicon.ico', function(req, res) { 
    res.status(204);
    res.end();    
});

app.get('/style.css', function (req, res) {
   
    res.sendFile(path.join(__dirname + "/style.css"));

});
app.get('/script.js', function (req, res) {
   
    res.sendFile(path.join(__dirname + "/script.js"));

});
app.get('/shoo.png', function (req, res) {
   
    res.sendFile(path.join(__dirname + "/shoo.png"));

});

app.get('/air.png', function (req, res) {
   
    res.sendFile(path.join(__dirname + "/air.png"));

});

app.get('/jordan.png', function (req, res) {
   
    res.sendFile(path.join(__dirname + "/jordan.png"));

});

app.get('/blazer.png', function (req, res) {
   
    res.sendFile(path.join(__dirname + "/blazer.png"));

});

app.get('/crater.png', function (req, res) {
   
    res.sendFile(path.join(__dirname + "/crater.png"));

});

app.get('/search.png', function (req, res) {
   
    res.sendFile(path.join(__dirname + "/search.png"));

});

app.get('/hippie.png', function (req, res) {
   
    res.sendFile(path.join(__dirname + "/hippie.png"));

});

app.get('/sliderBackground.png', function (req, res) {
   
    res.sendFile(path.join(__dirname + "/sliderBackground.png"));

});

app.get('/getSearchProducts', function (req, res) {
   
    if (req.query.location === 'results') {
        res.sendFile(path.join(__dirname + "/productResults.png"));
    }

});

app.get('/products', function (req, res) {

    if (req.query.location === 'product1') {
        res.sendFile(path.join(__dirname + "/product1.webp"));
    } else if (req.query.location === 'product2') {
        res.sendFile(path.join(__dirname + "/product2.avif"));
    } else if (req.query.location === 'product3') {
        res.sendFile(path.join(__dirname + "/product3.webp"));
    } else if (req.query.location === 'results') {
        res.sendFile(path.join(__dirname + "/productResults.png"));
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
