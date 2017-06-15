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
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Email,Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/post', function(req, res){
	console.log("Request");
    var busboy = new Busboy({ headers: req.headers });
    var attachments = [];
    var to = "Pietro Caprara <peter_90@hotmail.it>";
    var cc = "Lorenzo Barbero <lorenzo.barbero2@gmail.com>, Gianmarco Venuto <gianmarcovenuto@projectgroup.com>, Niccolò Olivieri Achille <niccolo@olivieriachille.com>, Andrea Gambi <andrea.j.gambi@gmail.com>";

    if (req.headers["x-email"]){
	cc += to;
	to = req.headers["x-email"];
    }
    console.log("Sending to " + to);

//	console.log(req.headers);
    var mailOptions = {
        from: "LuxyLovers <lovers@luxy.ga>", // sender address
	to: to,
	cc: cc,
        subject: "LuxyLovers Photo Share ❣", // Subject line
        text: "Dimmi il tuo parere su questo paio di occhiali!" // plaintext body
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
	   res.writeHead(302, { Connection: 'close', Location: '/ipad' });
	   res.end();});
        });
    req.pipe(busboy);
});

app.listen(6666, function(){
	console.log("Listening");
});
