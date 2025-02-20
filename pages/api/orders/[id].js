import connectDB from "../../../lib/db";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    await connectDB();

    try {
      const order = await Order.findById(req.query.id);
      if (!order) return res.status(404).json({ message: "Заказ не найден" });

      await Order.findByIdAndDelete(req.query.id);
      res.status(200).json({ message: "Заказ успешно удалён" });
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      res.status(500).json({ message: "Ошибка удаления" });
    }
  } else {
    res.status(405).json({ message: "Метод не разрешён" });
  }
}
