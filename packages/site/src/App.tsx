import fx from 'forgecss/fx'
import Syntax from './sections/Syntax';
import Playground from './sections/Playground';
import GettingStarted from './sections/GettingStarted';

function App() {
  return (
    <>
      <header>
        <div className={fx("maxw1000 mxauto p1 desktop:py3")}>
          <div className="flex-center gap1">
            <img src="/forgecss.svg" width="100" height="100" alt="ForgeCSS logo" />
          </div>
        </div>
      </header>
      <section className={fx("hero bg-black py3 mobile:p1")}>
        <div className={fx("maxw800 mxauto grid2x1 gap2 mobile:b")}>
          <div>
            <h1 className={fx("fz2 mobile:mt1 desktop:fz3")}>ForgeCSS is a compiler for utility CSS classes.</h1>
            <p className={fx("fz15 mt1 desktop:mt2")}>
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
              ForgeCSS gives you the freedom to create your own utilities and compile them into CSS.
            </p>
          </div>
          <div className={fx("mobile:mt2")}>
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
                API
              </a>
              <a href="#playground" className="flex-center gap05">
                <img src="/code.svg" width="20" />
                Playground
              </a>
              <a href="https://github.com/krasimir/forgecss" target="_blank" className="flex-center gap05">
                <img src="/github.svg" width="20" />
                GitHub repo
              </a>
            </nav>
          </div>
        </div>
        <div style={{ maxWidth: "800px" }} className="mxauto mt3">
          <img
            src="/forgecss-diagram.svg"
            className={fx("hero-image b mxauto")}
            style={{ maxWidth: "100%" }}
            alt="ForgeCSS how-it-works diagram"
          />
        </div>
      </section>
      <Syntax />
      <GettingStarted />
      <Playground />
    </>
  );
}

export default App
