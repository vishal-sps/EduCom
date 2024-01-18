const nodemailer = require("nodemailer");
const dotenv = require("dotenv")
const path = require("path")
const hbs = require('nodemailer-express-handlebars');

dotenv.config()

const userAuthCreds = {
  user: process.env.GMAIL_APP_USER,
  pass: process.env.GMAIL_APP_PASSWORD,
}
// console.log("auth creds", userAuthCreds);
const transporter = nodemailer.createTransport({
  service:'gmail',
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: userAuthCreds
});

// point to the template folder
const handlebarOptions = {
  viewEngine: {
      partialsDir: path.resolve('./views/'),
      defaultLayout: false,
      extName: '.handlebars'
  },
  viewPath: path.resolve('./views/'),
  extName:'.handlebars'
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(recieverData, subject, context) {
  // send mail with defined transport object
  try {
    const info = await transporter.sendMail({
        from: {
            name: "EduDotComs",
            address: process.env.GMAIL_APP_USER
        }, 
        to: recieverData, 
        template: 'email',
        subject: subject, 
        context: context
      });
    
      console.log("Message sent: %s", info.messageId, info);
      return info
  } catch (error) {
    console.log("Error in sending mail", error);
    return error
  }


}

module.exports = {sendMail}
