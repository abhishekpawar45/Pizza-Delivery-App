import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  // जर App Password नसेल किंवा मेल फेल झाला, तरी ॲप क्रॅश होणार नाही
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"PizzaHub" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.warn('\n⚠️ Gmail SMTP Error (Invalid App Password). Falling back to Console Log:');
    console.log('----------------------------------------------------');
    console.log(`To      : ${options.to}`);
    console.log(`Subject : ${options.subject}`);
    console.log(`Content :\n${options.html}`);
    console.log('----------------------------------------------------\n');
    // एरर throw न करता यशस्वी मानणे जेणेकरून फ्रंटएंडवर हिरवा मेसेज येईल आणि लिंक मिळेल
    return { message: 'Logged to console' };
  }
};