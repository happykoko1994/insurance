import connectDB from "../../lib/db";
import Order from "../../models/Order";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Метод не разрешён" });
  }

  try {
    await connectDB();
    console.log("БД подключена, загружаем заказы...");
    
    const orders = await Order.find().sort({ createdAt: -1 });
    console.log("Найдено заказов:", orders.length);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Ошибка API:", error.message);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
}
