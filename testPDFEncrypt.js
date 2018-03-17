var fs = require("fs")
var crypto = require("crypto")

var encPassword = "hello world"
//encrypting the pdf
fs.readFile('./a.pdf', function (err,data) {
    if (err) {
        return console.log(err);
    }
    var cipher = crypto.createCipher('aes-256-cbc', encPassword);
    var text = data;
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    console.log(crypted);



    var decipher = crypto.createDecipher('aes-256-cbc', encPassword);
	var dec = decipher.update(crypted,'hex','binary');                               
	dec += decipher.final('binary');       

	var buffer = new Buffer(dec, "binary");                                          
	fs.writeFileSync('./output.pdf', buffer); 

});

