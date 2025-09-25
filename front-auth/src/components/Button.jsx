export default function Button({ type = "button", onClick, children, disabled }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="btn"
        >
            {children}
        </button>
    );
}