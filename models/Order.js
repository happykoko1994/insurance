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
    region: { type: String, required: true }, // Регион страхования
    drivers: { 
      type: [driverSchema], 
      validate: v => v.length > 0 && v.length <= 4 
    }, // Водители (до 4-х)
    car: {
      brand: { type: String, required: true }, // Марка авто
      model: { type: String, required: true }, // Модель авто
      year: { type: Number, required: true }, // Год выпуска
      power: { type: Number, required: true }, // Мощность (л.с.)
      vin: { type: String, required: true } // VIN-номер
    },
    insurancePeriod: { type: String, required: true }, // Срок страхования
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
