import connectDB from "../../lib/db";
import Order from "../../models/Order";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.ENCRYPTION_KEY; // Ключ для шифрования

// Функция расшифровки
function decrypt(encryptedText) {
  try {
    if (!encryptedText || typeof encryptedText !== "string") return encryptedText;
    
    const [ivHex, encryptedData] = encryptedText.split(":");
    if (!ivHex || !encryptedData) return encryptedText;

    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(SECRET_KEY, "hex"), iv);

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("❌ Ошибка при расшифровке:", error);
    return encryptedText; // Вернуть зашифрованные данные, если ошибка
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Метод не разрешён" });
  }

  try {
    await connectDB();
    console.log("БД подключена, загружаем заказы...");

    const orders = await Order.find().sort({ createdAt: -1 });

    // Расшифровка данных перед отправкой в админку
    const decryptedOrders = orders.map(order => ({
      ...order.toObject(),
      drivers: order.drivers?.map(driver => ({
        ...driver,
        firstName: decrypt(driver.firstName),
        lastName: decrypt(driver.lastName),
        middleName: decrypt(driver.middleName),
        licenseSeries: driver.licenseSeries,
        licenseNumber: driver.licenseNumber,
        birthDate: driver.birthDate, 
        drivingExperienceDate: driver.drivingExperienceDate
      })),
      car: {
        ...order.car,
        vin: decrypt(order.car.vin)
      }
    }));

    console.log("✅ Данные после расшифровки:", JSON.stringify(decryptedOrders, null, 2));

    res.status(200).json(decryptedOrders);
  } catch (error) {
    console.error("❌ Ошибка API:", error.message);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
}
