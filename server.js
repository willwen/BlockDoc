var express = require('express');
var app = express();
var path = require("path");
const IPFS = require('ipfs')
// const node = new IPFS()

var ursa = require('ursa');


function generatePair(){
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
var key = generatePair();
var payload = "hihihihihihi";
var cipherText = publicEncrypt(key.pubkeypem, payload)
console.log(cipherText)
var plaintext = privateDecrypt(key.privkeypem, cipherText)
console.log(plaintext)
//https://github.com/JoshKaufman/ursa#simple-encrypt--decrypt-example
function publicEncrypt(publicKey, plaintext){
	return ursa.createPublicKey(publicKey).encrypt(plaintext, 'utf8', 'base64')
}

function privateDecrypt(privateKey, cipherText){
	return ursa.createPrivateKey(privateKey).decrypt(cipherText, 'base64', 'utf8')
}

app.use(express.static(path.join(__dirname ,'webpage/')))

var PORT = 8080
// app.listen(PORT, ()=>{
// 	console.log("Now Listening on port " + PORT + "!");
// });

