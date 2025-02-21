"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "../styles/form.css";
import { schema } from "../utils/validation";
import DriverInput from "./DriverInput";
import CarDetails from "./CarDetails";
import TextInput from "./TextInput";

const COOLDOWN_TIME = 60 * 1000;
const INSURANCE_PERIODS = ["3 мес", "6 мес", "1 год"];

export default function InsuranceForm() {
  const [cooldown, setCooldown] = useState(0);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(0), cooldown);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    if (cooldown > 0) {
      toast.warn(
        `Подождите ${Math.ceil(cooldown / 1000)} сек перед повторной отправкой`
      );
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data }),
      });

      if (!res.ok) throw new Error("Ошибка при отправке заявки");

      setCooldown(COOLDOWN_TIME);
      setSuccess("Заявка отправлена!");
      toast.success("Заявка отправлена!");
    } catch (err) {
      setError(err.message);
      toast.error("Произошла ошибка при отправке");
    }
  };

  console.log("Ошибки валидации:", errors);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <h1 className="form-title">Заявка на оформление страхового полиса</h1>
      
      <TextInput
        label="Регион страхования"
        name="region"
        register={register}
        error={errors.region}
        placeholder="Регион прописки, например, Москва"
      />

      {/* Поле ввода телефона */}
      <TextInput
        label="Телефон для связи"
        name="phone"
        register={register}
        error={errors.phone}
        type="tel"
        placeholder="Например, +79261234567"
      />

      <DriverInput control={control} register={register} errors={errors} />
      <CarDetails register={register} errors={errors} />

      {/* Выбор срока страхования */}
      <div className="form-group">
        <label className="custom-label">Срок страхования</label>
        <select
          {...register("insurancePeriod")}
          defaultValue=""
          className="input-field"
        >
          <option value="" disabled>
            Выберите срок страхования
          </option>
          {INSURANCE_PERIODS.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
        {errors.insurancePeriod && (
          <p className="error-message">{errors.insurancePeriod.message}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className="submit-button">
        {isSubmitting ? <ClipLoader color="white" size={24} /> : "Отправить"}
      </button>
      
      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}
