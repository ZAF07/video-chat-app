/* eslint-disable import/prefer-default-export */
import nodeMailer from 'nodemailer';

export const emailNotification = async (senderEmail, receiverEmail, timeToCall, roomID) => {
  const transporter = nodeMailer.createTransport({
    service: 'outlook',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const info = await transporter.sendMail({
    from: `Call your peer 📞 < ${senderEmail} > `,
    to: `${receiverEmail}`,
    subject: 'You have a call scheduled!',
    text: `${senderEmail} has invited you to a video call`,
    html: `<b> You have a scheduled video call with ${senderEmail}
    <br>
    Join this link at ${timeToCall}:
    <a href="http://localhost:3000/room/${roomID}">Join the room here</a>
    `,
  });
  console.log('Email sent -> ', info);
};
