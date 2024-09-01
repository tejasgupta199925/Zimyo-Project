const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

function createTransport() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
        throw new Error('Missing sender credentials in environment variables!');
    }

    return nodemailer.createTransport({
        host: process.env.host,
        port: process.env.port,
        secure: true,
        auth: {
            user,
            pass,
        },
    });
}

const emailModule = {
    sendEmail(recipientEmail, subject, message) {
        const transporter = createTransport();
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject,
            text: message,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.messageId);
            }
        });
    },
};

module.exports = emailModule;