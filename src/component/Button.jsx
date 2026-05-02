
const Button = ({ text, onClick, color = '' }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`btn ${color}`}
        >
            {text}
        </button>
    )
}

export default Button