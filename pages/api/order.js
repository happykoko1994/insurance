import connectDB from "../../lib/db";
import Order from "../../models/Order";
import { schema } from "../../utils/validation";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const MAX_RECORDS = 30; // Максимальное количество заказов в базе
const COOLDOWN_TIME = 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не разрешён" });
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

    // Проверяем последнюю заявку от этого email
    const lastOrder = await Order.findOne({ email: req.body.email }).sort({
      createdAt: -1,
    });
    if (
      lastOrder &&
      Date.now() - new Date(lastOrder.createdAt).getTime() < COOLDOWN_TIME
    ) {
      return res
        .status(429)
        .json({ message: "Подождите перед повторной отправкой!" });
    }

    // Сохраняем новый заказ
    const order = new Order(data);
    await order.save();

    res.status(201).json({ message: "Заказ успешно отправлен" });
    console.log("✅ Заказ сохранён в базе");

    // Отправляем email (асинхронно)
    console.log("📩 Отправка email началась...");
    sendEmailNotification(data).catch(console.error);
  } catch (error) {
    console.error("❌ Ошибка при сохранении заказа:", error);
    res.status(400).json({ message: error.message });
  }
}

// 📩 Функция отправки email
async function sendEmailNotification(data) {
  try {
    console.log("📩 Создание транспортера...");

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
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
