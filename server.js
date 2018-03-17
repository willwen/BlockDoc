var express = require('express');
var app = express();
var path = require("path");
var uuid = require('uuid-v4');
var crypto = require("crypto")
var formidable = require('formidable');
const fse = require('fs-extra')
// const IPFS = require('ipfs')
const multiaddr = require('multiaddr')
var ipfsAPI = require('ipfs-api')
var bodyParser = require('body-parser')

var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')
//Set up IPFS Node//////////////////////////////////////
var peer = "/ip4/10.189.111.5/tcp/4001/ipfs/QmZHb8mQ9ghbhkRU8mXih3YU9DYLB1jMZkfWo1QqKrKJ3C"
// var ipfsHash = "QmUwB2gbZvoherPARHnbkA7LrBfd8BYorpAA6X7S7xXhZZ"

var PORT = 8081

//Create directories, if not exist
var uploadDir = path.join(__dirname, '/uploads')
if (!fse.existsSync(uploadDir)) {
    fse.mkdirSync(uploadDir);
}

var outputDirectory = path.join(__dirname + '/output')
if (!fse.existsSync(outputDirectory)) {
    fse.mkdirSync(outputDirectory);
}

///////// Express Middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

/////////////

// //Express Routes////////////////////////////////////////

app.use(express.static(path.join(__dirname, 'public')))

app.post('/view', (req, res) =>{
	let ipfsHash = req.body.HashValue;
	let aesKey = req.body.Key;
	//fetch the file from IPFS (using the Hash)
	ipfs.files.cat(ipfsHash, function(err, file) {
	    if (err) {
	        throw err
	    }
	    // let fileData = file.toString();
	    // console.log(fileData)
	    const decipher = crypto.createDecipher('aes192', aesKey);

        let decrypted = decipher.update(file, 'hex', 'binary');
        //outputEncoding parameter is one of 'latin1', 'base64' or 'hex'
        //a Buffer is returned.
        decrypted += decipher.final("binary");
        var buffer = new Buffer(decrypted, "binary");                                          

        fse.writeFile(outputDirectory + "/output.pdf", buffer)
        	.then(()=>{
    	        res.download(outputDirectory+ "/output.pdf");

        	})
		    
  //       console.log(decrypted.toString());
        //use a parser 

	})
	//now we have the encrypted file;
	//decrypt the file

	//return a json representation of the file
})
app.post('/upload', function(req, res) {

    var form = new formidable.IncomingForm();
    form.maxFileSize = 8 * 1024 * 1024
    form.multiples = true;

    form.uploadDir = uploadDir;

    form.on('file', function(field, file) {
        console.log(file.path)
        fse.readFile(file.path)
            .then((data) => {
            	//
                var key = "NOCJcxl1C/2eerkk3oGPvhdjvnqDMAfANo4sbLt4wxNps+Zn1UpSyha1PydbTrNza7QLJrXSXZq8emZ/hDBzVw=="
                console.log("Base sha 512 key is :" + key)
                var myUUID = uuid();

                console.log("Unique ID is : " + myUUID);
                var hash = crypto.createHmac('sha512', key)
                hash.update(myUUID)
                var aesKey = hash.digest('hex')
                console.log("AES Key is :" + aesKey)
                const cipher = crypto.createCipher('aes192', aesKey);
                //data, input encoding, output encoding
                let encrypted = cipher.update(data, 'utf8', 'hex');
                encrypted += cipher.final('hex');
                // console.log(encrypted);

                // //IPFS Add
				ipfs.files.add(
				{
				    path: myUUID,
				    content: Buffer.from(encrypted, 'hex')
				}, (err, filesAdded) => {
				    if (err) {
				        console.log(err)
				    }
					// Once the file is added, we get back an object containing the path, the
					// multihash and the sie of the file
					console.log('\nAdded file:', filesAdded[0].path, filesAdded[0].hash)
					fileMultihash = filesAdded[0].hash
					res.end(JSON.stringify({
						fileMultihash,
	                	aesKey
	                		
	                }))
					
				})

                

             })
            .catch((err) => {
                console.log(err);
            })

    });

    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
    });

    // parse the incoming request containing the form data
    form.parse(req);
});



// ipfs.id().then((data) => {
//     console.log(JSON.stringify(data))
// }).catch((err) => {
//     console.log(err)
// })
// ipfs.swarm.peers().then((data) => {
//     console.log(JSON.stringify(data))
// }).catch((err) => {
//     console.log(err)
// })
// ipfs.swarm.addrs(function(err, addrs) {
//     if (err) {
//         throw err
//     }
//     console.log(addrs)
// })
// ipfs.swarm.connect(multiaddr(peer), (err, res) => {
//     if (err) {
//         throw err
//     }
//     console.log(res)
// });






app.listen(PORT, () => {
    console.log("Now Listening on port " + PORT + "!");
});

            