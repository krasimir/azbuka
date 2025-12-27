import fx from 'azbuka/az'
import Syntax from './sections/Syntax';
import Playground from './sections/Playground';
import GettingStarted from './sections/GettingStarted';
import API from './sections/API';

function App() {
  return (
    <>
      <header>
        <div className={az("maxw1000 mxauto p1 desktop:py3")}>
          <div className="flex-center gap1">
            <img src="/azbuka.svg" width="100" height="100" alt="Azbuka logo" />
          </div>
        </div>
      </header>
      <section className={az("hero bg-black py3 mobile:p1")}>
        <div className={az("maxw800 mxauto grid2x1 gap2 mobile:b")}>
          <div>
            <h1 className={az("fz2 mobile:mt1 desktop:fz3")}>Azbuka is a compiler for utility CSS classes.</h1>
            <p className={az("fz15 mt1 desktop:mt2")}>
              <span className="success">✔</span> Compiler that understands CSS class syntax
              <br />
              <span className="success">✔</span> It parses class strings, applies rules and structure, and compiles them
              into CSS.
            </p>
            <p className="mt1">
              What it isn’t!
              <small className="b">
                <span className="warning">✖</span> Not a CSS framework or a transformer
              </small>
              <small className="b">
                <span className="warning">✖</span> Not utility library
              </small>
              <small className="b">
                <span className="warning">✖</span> Not a Tailwind plugin
              </small>
              <small className="b">
                <span className="warning">✖</span> Not a runtime style engine
              </small>
              <small className="b">
                <span className="warning">✖</span> Not a CSS-in-JS solution
              </small>
            </p>
            <p className="mt1">
              Azbuka gives you the freedom to create your own utilities and compile them into CSS.
            </p>
          </div>
          <div className={az("mobile:mt2")}>
            <nav className="flex-col gap1">
              <a href="#syntax" className="flex-center gap05">
                <img src="/align-left.svg" width="20" />
                Syntax
              </a>
              <a href="#getting-started" className="flex-center gap05">
                <img src="/play-circle.svg" width="20" />
                Getting started
              </a>
              <a href="#api" className="flex-center gap05">
                <img src="/sliders.svg" width="20" />
                API & Configuration
              </a>
              <a href="#playground" className="flex-center gap05">
                <img src="/code.svg" width="20" />
                Playground
              </a>
              <a href="https://github.com/krasimir/azbuka" target="_blank" className="flex-center gap05">
                <img src="/github.svg" width="20" />
                GitHub repo
              </a>
            </nav>
          </div>
        </div>
        <div style={{ maxWidth: "800px" }} className="mxauto mt3">
          <img
            src="/azbuka-diagram.svg"
            className={az("hero-image b mxauto")}
            style={{ maxWidth: "100%" }}
            alt="Azbuka how-it-works diagram"
          />
        </div>
      </section>
      <Syntax />
      <GettingStarted />
      <API />
      <Playground />
      <footer className="border-t">
        <div className={az("maxw1000 mxauto p1 desktop:py3 tac fz15")}>
          <p>
            Made with ❤️ by{" "}
            <a href="https://krasimir.dev" target="_blank">
              Krasimir Tsonev
            </a>
            <small className="b mt2">
              <a href="https://github.com/krasimir/azbuka" className="paler">github.com/krasimir/azbuka</a>
            </small>
          </p>
        </div>
      </footer>
    </>
  );
}

export default App
