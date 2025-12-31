import az from 'azbuka/az'
import Syntax from './sections/Syntax';
import Playground from './sections/Playground';
import GettingStarted from './sections/GettingStarted';
import API from './sections/API';
import Navigation from './Navigation';
import Header from './Header';
import Footer from './Footer';

function App() {
  return (
    <>
      <Header />
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
            <p className="mt1">Azbuka gives you the freedom to create your own utilities and compile them into CSS.</p>
          </div>
          <div className={az("mobile:mt2")}>
            <Navigation />
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
      <Footer />
    </>
  );
}

export default App
