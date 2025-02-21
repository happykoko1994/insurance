import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("📩 Создание транспортера...");

const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru", // Используем SMTP Mail.ru
    port: 465, // Порт для защищённого соединения
    secure: true, // true для SSL
    auth: {
      user: process.env.EMAIL_USER, // Твой email на Mail.ru
      pass: process.env.EMAIL_PASS, // Сгенерированный пароль для SMTP
    },
  });

export default transporter;
