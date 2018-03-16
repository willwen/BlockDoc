var express = require('express');
var app = express();
var path = require("path");

var formidable = require('formidable');
var fs = require('fs');

app.use(express.static(path.join(__dirname ,'public')))
app.get('/web', function (req, res) {
  res.send('web.html')
})

app.post('/upload', function(req, res){


  var form = new formidable.IncomingForm();
  form.maxFileSize=8*1024*1024
  form.multiples = true;

  form.uploadDir = path.join(__dirname, '/uploads');

  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');asdfas
  });

  // parse the incoming request containing the form data
  form.parse(req);

});



var PORT = 8081
app.listen(PORT, ()=>{
	console.log("Now Listening on port " + PORT + "!");
});