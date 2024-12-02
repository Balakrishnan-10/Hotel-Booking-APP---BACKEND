import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (userEmail, subject, body) => {
  try {
    // Create transport :
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD,
      },
    });
    await transport.sendMail({
      from: `"Bala" <${process.env.GMAIL}>`,
      to: userEmail,
      subject,
      html: `Cick Here To Reset Password : <a href= ${body} } >${body}</a></p>
            <p>It will expire within 1 hours</p>
            <p><i>Please don't reply to this email</i></p>
            <p>Thank you!</p>`,
    });
    return true;
  } catch (error) {
    console.log(`Mail Not Sent: ${error.message}`);
    return false;
  }
};

export default sendMail;
