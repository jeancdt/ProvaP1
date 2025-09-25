export default function FormInput({
    label,
    type = "text",
    value,
    onChange,
    name,
    placeholder,
    required,
}) {
    return (
        <label className="form-group">
            <span className="form-label">{label}</span>
            <input
                className="form-input"
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                required={required}
            />
        </label>
    );
}