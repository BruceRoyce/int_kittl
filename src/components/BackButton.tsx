import "../style/main.scss";

export default function BackButton() {
  const handleClick = () => {
    window.location.href = "/";
  };
  return (
    <div className="btn-back" onClick={() => handleClick()}>
      <div>arrow_back_ios</div>
    </div>
  );
}
