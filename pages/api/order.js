import connectDB from "../../lib/db";
import Order from "../../models/Order";
import { schema } from "../../utils/validation";
import dotenv from "dotenv";
import crypto from "crypto";
import transporter from "../../lib/mailer";

dotenv.config();

const MAX_RECORDS = 30;
const SECRET_KEY = process.env.ENCRYPTION_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не разрешён" });
  }

  function encrypt(text) {
    const key = Buffer.from(SECRET_KEY, "hex");
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  }

  try {
    await connectDB();
    let data = schema.parse(req.body);

    console.log("📌 Данные перед обработкой:", data);

    const capitalize = (str) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;

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

    // Отправляем email до шифрования
    sendEmailNotification(data).catch(console.error);

    // Шифруем только критичные данные перед сохранением в БД
    if (data.phone) data.phone = encrypt(String(data.phone).trim());
    if (data.car) data.car.vin = encrypt(data.car.vin);
    if (data.drivers) {
      data.drivers = data.drivers.map((driver) => ({
        ...driver,
        firstName: encrypt(driver.firstName),
        lastName: encrypt(driver.lastName),
        middleName: driver.middleName ? encrypt(driver.middleName) : "",
      }));
    }

    // Проверяем количество заказов
    const count = await Order.countDocuments();
    if (count >= MAX_RECORDS) {
      const oldestOrder = await Order.findOneAndDelete().sort({ createdAt: 1 });
      if (oldestOrder) {
        console.log("🗑 Удалена старая запись:", oldestOrder._id);
      }
    }

    // Сохраняем новый заказ
    const order = new Order(data);
    await order.save();

    res.status(201).json({ message: "Заказ успешно отправлен" });
    console.log("✅ Заказ сохранён в базе");
  } catch (error) {
    console.error("❌ Ошибка при сохранении заказа:", error);
    res.status(400).json({ message: error.message });
  }
}

async function sendEmailNotification(data) {
  try {
    console.log("📩 Отправка email...");
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject: "Новый заказ на страховой полис",
      text: `Регион: ${data.region}
      Телефон: ${data.phone}
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
