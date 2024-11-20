const nodemailer = require('nodemailer')
require('dotenv').config()


function getFormattedDate() {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = months[currentDate.getMonth()]; 
    const year = currentDate.getFullYear(); 

    return `${day} ${month}, ${year}`; 
}

const otp = async (email, name, otpCode) => {


    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD,
        },
    });

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Static Template</title>

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
</head>
<body style="margin: 0; font-family: 'Poppins', sans-serif; background: #ffffff; font-size: 14px;">
    <div style="
        max-width: 680px; 
        margin: 0 auto; 
        padding: 45px 30px 60px; 
        background: #f4f7ff; 
        background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner); 
        background-repeat: no-repeat; 
        background-size: 800px 452px; 
        background-position: top center; 
        font-size: 14px; 
        color: #434343;">
        
        <header>
            <table style="width: 100%;">
                <tbody>
                    <tr style="height: 0;">
                        <td>
                            EduWise
                        </td>
                        <td style="text-align: right;">
                            <span style="font-size: 16px; line-height: 30px; color: #ffffff;">${getFormattedDate()}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </header>

        <main>
            <div style="
                margin: 0; 
                margin-top: 70px; 
                padding: 92px 30px 115px; 
                background: #ffffff; 
                border-radius: 30px; 
                text-align: center;">
                
                <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                    <h1 style="
                        margin: 0; 
                        font-size: 24px; 
                        font-weight: 500; 
                        color: #1f1f1f;">
                        Your OTP
                    </h1>
                    <p style="
                        margin: 0; 
                        margin-top: 17px; 
                        font-size: 16px; 
                        font-weight: 500;">
                        ${name},
                    </p>
                    <p style="
                        margin: 0; 
                        margin-top: 17px; 
                        font-weight: 500; 
                        letter-spacing: 0.56px;">
                        Thank you for choosing EduWise - E-Learning Plateform. Use the following OTP
                        to complete the procedure to change your email address. OTP is
                        valid for <span style="font-weight: 600; color: #1f1f1f;">1 minute</span>.
                        Do not share this code with others, including Archisketch employees.
                    </p>
                    <p style="
                        margin: 0; 
                        margin-top: 60px; 
                        font-size: 40px; 
                        font-weight: 600; 
                        letter-spacing: 25px; 
                        color: #ba3d4f;">
                        ${otpCode}
                    </p>
                </div>
            </div>

            <p style="
                max-width: 400px; 
                margin: 0 auto; 
                margin-top: 90px; 
                text-align: center; 
                font-weight: 500; 
                color: #8c8c8c;">
                Need help? Ask at
                <a href="mailto:contact@eduwise.pk" style="color: #499fb6; text-decoration: none;">contact@eduwise.pk</a>
                or visit our
                <a href="eduwiseapp.tech" target="_blank" style="color: #499fb6; text-decoration: none;">Help Center</a>
            </p>
        </main>

        <footer style="
            width: 100%; 
            max-width: 490px; 
            margin: 20px auto 0; 
            text-align: center; 
            border-top: 1px solid #e6ebf1;">
            
            <p style="
                margin: 0; 
                margin-top: 40px; 
                font-size: 16px; 
                font-weight: 600; 
                color: #434343;">
                EduWise - E-Learning Plateform
            </p>
            <p style="margin: 0; margin-top: 8px; color: #434343;">
                Lahore, Punjab, Pakistan
            </p>
            <div style="margin: 0; margin-top: 16px;">
                <a href="" target="_blank" style="display: inline-block;">
                    <img width="36px" alt="Facebook" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook" />
                </a>
                <a href="" target="_blank" style="display: inline-block; margin-left: 8px;">
                    <img width="36px" alt="Instagram" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram" />
                </a>
                <a href="" target="_blank" style="display: inline-block; margin-left: 8px;">
                    <img width="36px" alt="Twitter" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter" />
                </a>
                <a href="" target="_blank" style="display: inline-block; margin-left: 8px;">
                    <img width="36px" alt="Youtube" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube" />
                </a>
            </div>
            <p style="margin: 0; margin-top: 16px; color: #434343;">
                Copyright © 2025 Company. All rights reserved.
            </p>
        </footer>
    </div>
</body>
</html>
`;

    // Sending the email
    const info = await transporter.sendMail({
        from: {
            name: 'EduWise',
            address: process.env.USER
        },
        to: email,
        subject: "Your OTP Verification Code",
        html: htmlContent,  
    });



}


module.exports = otp