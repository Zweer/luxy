express = require('express');
var app = express();
var Busboy = require('busboy');
var nodemailer = require("nodemailer");
var smtpTransport = transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
});
/*nodemailer.createTransport("SMTP",{
    service: "Gmail",
     auth: {
         user: "gmail.user@gmail.com",
         pass: "gmailpass"
     }
});*/

app.post('/post', function(req, res){
	console.log("Request");
    var busboy = new Busboy({ headers: req.headers });
    var attachments = [];

    var mailOptions = {
        from: "LuxyLover <lovers@luxy.ga>", // sender address
        to: "Niccolò <niccolo@olivieriachille.com>, Andrea <andrea.j.gambi@gmail.com>", // comma separated list of receivers
        subject: "Luxy Photo Share ❣", // Subject line
        text: "Questa è la foto condivisa con te!" // plaintext body
    };

    busboy
        .on('file', function(fieldname, file, filename, encoding, mimetype){
 		console.log("Received file");
		var buffer = '';
		file.setEncoding('base64');
		file.on('data', function(data) {buffer += data;});
		file.on('end', function() {
			console.log("Finish");
	            attachments.push({
	               filename: filename,
	               content: buffer,//file.toString('base64'),
	               encoding: 'base64'
		    });
/*		})
        .on('finish', function() {*/
            mailOptions.attachments = attachments;
            smtpTransport.sendMail(mailOptions, function (err, info) {
               if (err) {
                   console.log("ERROR");
               }
               console.log("SENT");
           });
	   console.log('Done parsing form!');
	   res.writeHead(302, { Connection: 'close', Location: '/ipad/thankyou' });
	   res.end();});
        });
    req.pipe(busboy);
});

app.listen(6666, function(){
	console.log("Listening");
});