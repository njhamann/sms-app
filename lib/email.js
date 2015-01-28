var nodemailer = require('nodemailer');
var path = require('path');
var emailTemplates = require('email-templates');
var env = process.env.NODE_ENV || 'development';
var config = require('./../config/mandrill.json')[env];

var templatesDir = path.resolve(__dirname, './../views', 'email');

var transport = nodemailer.createTransport({
  host: config.host,
  //secureConnection: true,
  port: config.port,
  auth: {
    user: config.username,
    pass: config.password
  }
});

var emails = {};
emails.generic = function(data){
  data = data || {};
  var emailInfo = {
      from: 'Noah <noah@tireddevapps.com>',
      to: '"Noah Hamann" <njhamann@gmail.com>',
      subject: 'Tired Dev NOTIFICATION: GENERIC',
      headers: {
          'X-Laziness-level': 1000
      }
  };

  emailTemplates(templatesDir, function(err, template) {
    template('generic', { message: data.message }, function(err, html, text) {
      if(!err){
        emailInfo.html = html;
        emailInfo.text = JSON.stringify(data);
        transport.sendMail(emailInfo, function(error){
            if(error){
              console.log('Error occured');
              console.log(error.message);
              return;
            }
            console.log('Message sent successfully!');
            //transport.close();
        });
      }
    })
  });
};

module.exports = emails;
