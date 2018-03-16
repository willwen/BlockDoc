var express = require('express');
var app = express();
var path = require("path");


app.use(express.static(path.join(__dirname ,'webpage/')))

var PORT = 8080
app.listen(PORT, ()=>{
	console.log("Now Listening on port " + PORT + "!");
});