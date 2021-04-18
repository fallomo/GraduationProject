 var nodemailer = require('nodemailer')
 var smtpTransport = require('nodemailer-smtp-transport');
 var config = require('./config')
  
 smtpTransport = nodemailer.createTransport(smtpTransport({
     service: config.email.service,
     auth: {
         user: config.email.user,
         pass: config.email.pass
     }
 }));
  
 var sendMail = function (recipient, subject, html) {
  
     smtpTransport.sendMail({
  
         from: config.email.user,
         to: recipient,
         subject: subject,
         html: html
  
     }, function (error, response) {
         if (error) {
             console.log(error);
         }
         console.log('发送成功')
     });
 }
  
sendMail("812925285@qq.com","测试","hello")
 module.exports = sendMail;
