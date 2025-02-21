import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  lastName: { type: String, required: true }, // Фамилия
  firstName: { type: String, required: true }, // Имя
  middleName: { type: String, required: false }, // Отчество (может отсутствовать)
  licenseSeries: { type: String, required: true }, // Серия ВУ
  licenseNumber: { type: String, required: true }, // Номер ВУ
  drivingExperienceDate: { type: Date, required: true }, // Дата начала стажа
  birthDate: { type: Date, required: true } // Дата рождения
});

const orderSchema = new mongoose.Schema(
  {
    region: { type: String, required: true },
    phone: { type: String, required: true }, // Добавляем телефон

    drivers: { 
      type: [driverSchema], 
      validate: v => v.length > 0 && v.length <= 4 
    },

    car: {
      brand: { type: String, required: true },
      model: { type: String, required: true },
      year: { type: Number, required: true },
      power: { type: Number, required: true },
      vin: { type: String, required: true },
    },

    insurancePeriod: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
