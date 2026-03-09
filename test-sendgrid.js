require('dotenv').config();
const sgMail = require('@sendgrid/mail');

// Load key from .env
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'khundaenggarden@gmail.com', // Change this if you want to send to a different email
  from: 'khundaenggarden@gmail.com', // Must be verified in SendGrid
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('Test email sent successfully');
  })
  .catch((error) => {
    console.error('Error sending test email:');
    console.error(error.response ? error.response.body : error);
  });
