var express = require('express');
var app = express();
var path = require("path");
var formidable = require('formidable');
var fs = require('fs');
const IPFS = require('ipfs')
// const node = new IPFS()

var ursa = require('ursa');


function generatePair() {
    var key = ursa.generatePrivateKey(1024, 65537);
    var privkeypem = key.toPrivatePem().toString('ascii');
    var pubkeypem = key.toPublicPem().toString('ascii');

    console.log(privkeypem);
    console.log(pubkeypem)
    return {
        privkeypem,
        pubkeypem
    }

    // console.log("Public Key : " ,diffHell.getPublicKey('hex'));
    // console.log("Private Key : " ,diffHell.getPrivateKey('hex'));	
}

//https://github.com/JoshKaufman/ursa#simple-encrypt--decrypt-example
function publicEncrypt(publicKey, plaintext) {
    return ursa.createPublicKey(publicKey).encrypt(plaintext, 'utf8', 'base64')
}

function privateDecrypt(privateKey, cipherText) {
    return ursa.createPrivateKey(privateKey).decrypt(cipherText, 'base64', 'utf8')
}



app.use(express.static(path.join(__dirname, 'public')))


app.post('/upload', function(req, res) {



    var form = new formidable.IncomingForm();
    form.maxFileSize = 8 * 1024 * 1024
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
        res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);


    var key = generatePair();
    var payload = "Asdf"
    var cipherText = publicEncrypt(key.pubkeypem, payload)
    console.log(cipherText)
    var plaintext = privateDecrypt(key.privkeypem, cipherText)
    console.log(plaintext)

});



var PORT = 8081
app.listen(PORT, () => {
    console.log("Now Listening on port " + PORT + "!");
});