const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

exports.sendEmail = async (link, email) => {
    const mailOptions = {
        from: {
            name: "Todo App",
            address: process.env.EMAIL,
        },
        to: email,
        subject: "Reset Your Password",
        html: `
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }

                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                p {
                    margin-bottom: 20px;
                    line-height: 1.6;
                }

                .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #83ed66;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                }

                .btn:hover {
                    background-color: #0bdb7e;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <p>Hello,</p>
                <p>We received a request to reset your password. Click the button below to reset your password.</p>
                <p>
                    <a href=${link} class="btn">Reset Password</a>
                </p>
                <p>Above link will expire in 15 minutes.</p>
                <p>If you did not request a password reset, you can safely ignore this email.</p>
                <p>Best regards,<br> Todo App</p>
            </div>
        </body>
        `,
    };

    try {
        const response = await transporter.sendMail(mailOptions);
        console.log(response);
    }
    catch (error) {
        console.error(error);
    }
};


// not for production backend
//only for trial

// const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

// const mailerSend = new MailerSend({
//   apiKey: process.env.MailerSend_API_KEY,
// });

// const sentFrom = new Sender("MS_ANYEE6@trial-yzkq340kmx3gd796.mlsender.net", "Todo App");


// exports.sendEmail = async (link, email) =>{
//     const recipients = [
//         new Recipient(email, "User")
//     ];

//     const body = `
//     <head>
//         <style>
//             body {
//                 font-family: Arial, sans-serif;
//                 margin: 0;
//                 padding: 0;
//                 background-color: #f4f4f4;
//             }

//             .container {
//                 max-width: 600px;
//                 margin: 20px auto;
//                 padding: 20px;
//                 background-color: #fff;
//                 border-radius: 5px;
//                 box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//             }

//             p {
//                 margin-bottom: 20px;
//                 line-height: 1.6;
//             }

//             .btn {
//                 display: inline-block;
//                 padding: 10px 20px;
//                 background-color: #83ed66;
//                 color: #fff;
//                 text-decoration: none;
//                 border-radius: 5px;
//             }

//             .btn:hover {
//                 background-color: #0bdb7e;
//             }
//         </style>
//     </head>
//     <body>
//         <div class="container">
//             <p>Hello,</p>
//             <p>We received a request to reset your password. Click the button below to reset your password.</p>
//             <p>
//                 <a href=${link} class="btn">Reset Password</a>
//             </p>
//             <p>Above link will expire in 15 minutes.</p>
//             <p>If you did not request a password reset, you can safely ignore this email.</p>
//             <p>Best regards,<br> Todo App</p>
//         </div>
//     </body>
//     `;

//     const emailParams = new EmailParams()
//     .setFrom(sentFrom)
//     .setTo(recipients)
//     .setReplyTo(sentFrom)
//     .setSubject("Reset Your Password")
//     .setHtml(body)
//     .setText("This is the text content");

//     try {
//         const response = await mailerSend.email.send(emailParams);
//         // console.log(response);
//     } catch (error) {
//         console.error(error);
//     }
// };
