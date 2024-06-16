import "../style/main.scss";

export default function BackButton() {
  const handleClick = () => {
    window.open("/", "_self");
  };
  return (
    <div className="btn-back" onClick={() => handleClick()}>
      <div>arrow_back_ios</div>
    </div>
  );
}
