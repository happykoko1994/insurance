import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import TextInput from "./TextInput";

export default function DriverInput({ control, register, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "drivers",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append(
        {
          lastName: "",
          firstName: "",
          middleName: "",
          birthDate: "",
          licenseSeries: "",
          licenseNumber: "",
          drivingExperienceDate: "",
        },
        { shouldFocus: false }
      );
    }
  }, [fields, append]);

  return (
    <div className="form-group">
      <label>Водители (до 4-х)</label>
      {fields.map((driver, index) => (
        <div key={driver.id} className="driver-container">
          <span>Водитель {index + 1}</span>

          <div className="driver-grid">
            {/* Левая колонка – Данные о водителе */}
            <div className="driver-info">
              <TextInput
                label="Фамилия"
                name={`drivers.${index}.lastName`}
                register={register}
                placeholder="Введите фамилию"
                error={errors?.drivers?.[index]?.lastName}
              />
              <TextInput
                label="Имя"
                name={`drivers.${index}.firstName`}
                register={register}
                placeholder="Введите имя"
                error={errors?.drivers?.[index]?.firstName}
              />
              <TextInput
                label="Отчество"
                name={`drivers.${index}.middleName`}
                register={register}
                placeholder="Введите отчество"
                error={errors?.drivers?.[index]?.middleName}
              />
              <TextInput
                label="Дата рождения"
                name={`drivers.${index}.birthDate`}
                register={register}
                type="date"
                error={errors?.drivers?.[index]?.birthDate}
              />
            </div>

            {/* Правая колонка – Данные о ВУ */}
            <div className="license-info">
              <TextInput
                label="Серия ВУ"
                name={`drivers.${index}.licenseSeries`}
                register={register}
                placeholder="77 00"
                error={errors?.drivers?.[index]?.licenseSeries}
              />
              <TextInput
                label="Номер ВУ"
                name={`drivers.${index}.licenseNumber`}
                register={register}
                placeholder="1234567"
                error={errors?.drivers?.[index]?.licenseNumber}
              />
              <TextInput
                label="Дата начала стажа"
                name={`drivers.${index}.drivingExperienceDate`}
                register={register}
                type="date"
                error={errors?.drivers?.[index]?.drivingExperienceDate}
              />
            </div>
          </div>

          <div className="driver-buttons">
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="remove-driver-btn"
              >
                Удалить водителя
              </button>
            )}
            {fields.length < 4 && index === fields.length - 1 && (
              <button
                type="button"
                onClick={() =>
                  append(
                    {
                      lastName: "",
                      firstName: "",
                      middleName: "",
                      birthDate: "",
                      licenseSeries: "",
                      licenseNumber: "",
                      drivingExperienceDate: "",
                    },
                    { shouldFocus: false }
                  )
                }
                className="add-driver-btn"
              >
                Добавить водителя
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
