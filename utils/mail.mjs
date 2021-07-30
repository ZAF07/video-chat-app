/* eslint-disable import/prefer-default-export */
import nodeMailer from 'nodemailer';

export const emailNotification = async (senderEmail, receiverEmail, roomID) => {
  console.log('here --> ', roomID);
  const transporter = nodeMailer.createTransport({
    service: 'outlook',
    auth: {
      user: 'peersingapore@outlook.com',
      pass: 'peer__8382209-9438-77&^78',
    },
  });
  const info = await transporter.sendMail({
    from: 'Call your peer 📞 <peersingapore@outlook.com> ',
    to: 'zaffere07@gmail.com',
    subject: `You have a call scheduled with ${senderEmail}`,
    text: `${senderEmail} has invited you to a video call`,
    html: `<b> You have a scheduled video call with ${senderEmail}
    <br>
    Join this link:
    <a href="http://localhost:3000/room/${roomID}">Join room here</a>
    `,
  }).catch((err) => {
    console.log(err);
  });
  console.log('Email sent -> ', info);
};
