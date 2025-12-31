import az from "azbuka/az";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className={az("maxw1000 mxauto p1 desktop:py3 tac fz15")}>
        <p>
          Made with ❤️ by{" "}
          <a href="https://krasimir.dev" target="_blank">
            Krasimir Tsonev
          </a>
          <small className="b mt2">
            <a href="https://github.com/krasimir/azbuka" className="paler">
              github.com/krasimir/azbuka
            </a>
          </small>
        </p>
      </div>
    </footer>
  );
}