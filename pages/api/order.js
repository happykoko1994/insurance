import connectDB from "../../lib/db";
import Order from "../../models/Order";
import { schema } from "../../utils/validation";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const MAX_RECORDS = 30; // Максимальное количество заказов в базе

const SECRET_KEY = process.env.ENCRYPTION_KEY; // 32-байтовый ключ
const ALGORITHM = "aes-256-cbc";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не разрешён" });
  }

  function encrypt(text) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  }

  function decrypt(encryptedText) {
    try {
      const [ivHex, encryptedData] = encryptedText.split(":");
      const iv = Buffer.from(ivHex, "hex");
  
      const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(SECRET_KEY, "hex"), iv);
      
      let decrypted = decipher.update(encryptedData, "hex", "utf8");
      decrypted += decipher.final("utf8");
  
      return decrypted;
    } catch (error) {
      console.error("❌ Ошибка при расшифровке:", error);
      return null;
    }
  }
  
 
  

  try {
    await connectDB();
    let data = schema.parse(req.body);

    console.log("📌 Данные перед обработкой:", data);

    // Функция для форматирования строк (первая буква заглавная)
    const capitalize = (str) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;

    // Приведение данных в нужный формат
    data.region = capitalize(data.region);
    data.insurancePeriod = capitalize(data.insurancePeriod);

    if (data.drivers && Array.isArray(data.drivers)) {
      data.drivers = data.drivers.map((driver) => ({
        ...driver,
        firstName: capitalize(driver.firstName),
        lastName: capitalize(driver.lastName),
        middleName: driver.middleName ? capitalize(driver.middleName) : "",
        licenseSeries: driver.licenseSeries.toUpperCase(),
        licenseNumber: driver.licenseNumber.toUpperCase(),
      }));
    }

    if (data.car) {
      data.car.brand = capitalize(data.car.brand);
      data.car.model = capitalize(data.car.model);
      data.car.vin = data.car.vin.toUpperCase();
    }

    console.log("📌 Данные после форматирования:", data);

    // Проверяем количество заказов
    const count = await Order.countDocuments();
    if (count >= MAX_RECORDS) {
      const oldestOrder = await Order.findOne().sort({ createdAt: 1 });
      if (oldestOrder) {
        await Order.deleteOne({ _id: oldestOrder._id });
        console.log("🗑 Удалена старая запись:", oldestOrder._id);
      }
    }

    data.drivers = data.drivers.map((driver) => ({
      ...driver,
      firstName: encrypt(driver.firstName),
      lastName: encrypt(driver.lastName),
      middleName: driver.middleName ? encrypt(driver.middleName) : "",
      licenseSeries: driver.licenseSeries.toUpperCase(),
      licenseNumber: driver.licenseNumber.toUpperCase(),
    }));

    data.car.vin = encrypt(data.car.vin);

    // Сохраняем новый заказ
    const order = new Order(data);
    await order.save();

    res.status(201).json({ message: "Заказ успешно отправлен" });
    console.log("✅ Заказ сохранён в базе");

    // Отправляем email (асинхронно)
    console.log("📩 Отправка email началась...");
    const decryptedData = {
      ...data,
      drivers: data.drivers.map((driver) => ({
        ...driver,
        firstName: decrypt(driver.firstName) || driver.firstName,
        lastName: decrypt(driver.lastName) || driver.lastName,
        middleName: driver.middleName ? decrypt(driver.middleName) : "",
      })),
      car: {
        ...data.car,
        vin: decrypt(data.car.vin) || data.car.vin,
      },
    };
    
    sendEmailNotification(decryptedData).catch(console.error);  } catch (error) {
    console.error("❌ Ошибка при сохранении заказа:", error);
    res.status(400).json({ message: error.message });
  }
}

// 📩 Функция отправки email
async function sendEmailNotification(data) {
  try {
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
    

    console.log("📩 Отправка email...");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject: "Новый заказ на страховой полис",
      text: `Регион: ${data.region}
Страховой период: ${data.insurancePeriod}
Водители: ${data.drivers
        .map(
          (d) =>
            `\n- ${d.lastName} ${d.firstName} ${d.middleName || ""}, ВУ: ${
              d.licenseSeries
            } ${d.licenseNumber}, Опыт с ${
              d.drivingExperienceDate
            }, Дата рождения: ${
              d.birthDate
                ? new Date(d.birthDate).toLocaleDateString("ru-RU")
                : "Не указано"
            }`
        )

        .join("")}
Данные авто: 
Марка: ${data.car?.brand || "Не указано"}, 
Модель: ${data.car?.model || "Не указано"}, 
Год: ${data.car?.year || "Не указано"}, 
VIN: ${data.car?.vin || "Не указан"}

Заказ можно посмотреть в админке: ${process.env.URL}/admin`,
    });

    console.log("✅ Email отправлен:", info.response);
  } catch (error) {
    console.error("❌ Ошибка при отправке email:", error);
  }
}
