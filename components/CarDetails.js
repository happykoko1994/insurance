import TextInput from "./TextInput";

export default function CarDetails({ register, errors }) {
  return (
    <div className="form-group">
      <label>Данные автомобиля</label>
      <TextInput label="Марка" name="car.brand" register={register} error={errors?.car?.brand} placeholder="Введите марку, например, Toyota" />
      <TextInput label="Модель" name="car.model" register={register} error={errors?.car?.model} placeholder="Введите модель, например, Camry" />
      <TextInput label="Год выпуска" name="car.year" register={register} type="number" error={errors?.car?.year} placeholder="Введите год, например, 2020" />
      <TextInput label="Мощность (л.с.)" name="car.power" register={register} type="number" error={errors?.car?.power} placeholder="Введите мощность, например, 150" />
      <TextInput 
        label="VIN-номер" 
        name="car.vin" 
        register={register} 
        error={errors?.car?.vin} 
        placeholder="Введите VIN-номер, например, XW8ZZZ61ZKG004567"
        onInput={(e) => e.target.value = e.target.value.toUpperCase()} 
        style={{ textTransform: "uppercase" }}
      />
    </div>
  );
}
