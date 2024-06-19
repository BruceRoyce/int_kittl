import { useNavigate } from "react-router-dom";
import "../style/main.scss";

export default function BackButton() {
  const nav = useNavigate();
  const handleClick = () => {
    nav("/");
  };
  return (
    <div className="btn-back" onClick={() => handleClick()}>
      <div>arrow_back_ios</div>
    </div>
  );
}
