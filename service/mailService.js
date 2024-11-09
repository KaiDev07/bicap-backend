import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendActivationMail = async (email, activationLink) => {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Активация аккаунта на " + process.env.API_URL,
        text: "",
        html: `
        <div>
            <h1>Для активации перейдите по ссылке</h1>
            <a href="${process.env.API_URL}/user/activate/${activationLink}">${process.env.API_URL}/user/activate/${activationLink}</a>
        </div>
        `,
    });
};
