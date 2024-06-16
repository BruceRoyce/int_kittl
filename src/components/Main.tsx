import "../style/main.scss";

export default function Main() {
  const handleClick = (url: string) => {
    window.open(url);
  };
  return (
    <main id="menu-page">
      <h1>Kittl</h1>
      <div className="announcement">
        Bruce Royce's submission for Kittl's front-end engineering position.
        <br />
        <a href="mailto:bruceroyce@yahoo.com">bruceroyce@yahoo.com</a>
      </div>
      <div className="vSpacer"></div>
      <div className="ttl">
        Please select a part:
        <br />
        (Desktop only)
      </div>
      <div className="btn-wrapper">
        <div className="btn main" onClick={() => handleClick("rendering")}>
          Rendering
        </div>
        <div className="btn main" onClick={() => handleClick("transform")}>
          Transform
        </div>
      </div>
    </main>
  );
}
