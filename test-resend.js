const { Resend } = require('resend');

const resend = new Resend('re_7MPXr17n_F13HjdZpAL2b7puhhwyvxTcC');

async function testResend() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'delivered@resend.dev',
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

testResend();
