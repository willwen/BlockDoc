
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

