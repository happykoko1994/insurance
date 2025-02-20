import * as z from "zod";

export const schema = z.object({
  region: z.string().min(2, "Минимум 2 символа").max(50, "Максимум 50 символов"),

  drivers: z.array(
    z.object({
      lastName: z.string()
        .min(2, "Минимум 2 символа")
        .max(50, "Максимум 50 символов")
        .regex(/^[А-Яа-яЁё-]+$/, "Только буквы"),
      firstName: z.string()
        .min(2, "Минимум 2 символа")
        .max(50, "Максимум 50 символов")
        .regex(/^[А-Яа-яЁё-]+$/, "Только буквы"),
      middleName: z.string()
        .max(50, "Максимум 50 символов")
        .regex(/^[А-Яа-яЁё-]*$/, "Только буквы")
        .optional(),
      licenseSeries: z.string().min(4, "Минимум 4 символа").max(10, "Максимум 10 символов"),
      licenseNumber: z.string().min(6, "Минимум 6 символов").max(10, "Максимум 10 символов"),
      drivingExperienceDate: z.string().refine(
        (date) => !isNaN(Date.parse(date)),
        "Некорректная дата начала стажа"
      ),
      birthDate: z.string().refine(
        (date) => !isNaN(Date.parse(date)),
        "Некорректная дата рождения"
      ),
    })
  ).max(4, "Максимум 4 водителя"),

  car: z.object({
    brand: z.string().min(2, "Минимум 2 символа").max(30, "Максимум 30 символов"),
    model: z.string().min(2, "Минимум 2 символа").max(30, "Максимум 30 символов"),
    year: z.preprocess((val) => Number(val), z.number()
      .int("Должно быть целым числом")
      .min(1900, "Некорректный год")
      .max(new Date().getFullYear(), "Год не может быть в будущем")),
    power: z.preprocess((val) => Number(val), z.number()
      .int("Должно быть целым числом")
      .min(10, "Мощность должна быть не менее 10 л.с.")
      .max(2000, "Некорректная мощность")),
    vin: z.string().max(50, "Максимум 50 символов").optional(),
  }),

  insurancePeriod: z.string().min(1, "Обязательное поле"),
});
