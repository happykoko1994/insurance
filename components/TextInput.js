export default function TextInput({ label, name, register, error, type = "text", placeholder = "" }) {
  return (
    <div className="form-group">
      <label className="custom-label" htmlFor={name}>{label}</label>
      <input 
        id={name} 
        {...register(name)} 
        type={type} 
        placeholder={placeholder} 
        className={`input-field ${error ? "input-error" : ""}`}
      />
      {error && <p className="error-message">{error.message}</p>}
    </div>
  );
}
