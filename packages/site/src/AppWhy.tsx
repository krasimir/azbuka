import React from 'react';
import az from 'azbuka/az'
import Header from './Header';
import Footer from './Footer';

const COMPARISON = [
  ["Ships with fixed utilities", "You define your own utilities"],
  ["Framework + defaults", "Compiler + primitives"],
  ["Encourages reuse of library ecosystem", "Encourages domain-specific utility languages"],
  ["You configure", "You design"],
  ["Avoids abstraction", "Gives you macros as a first-class feature"],
  ["CSS is the backend", "CSS is the output of a compiler"]
];

function App() {
  return (
    <>
      <Header />
      <section className={az("hero bg-black py3 mobile:p1")}>
        <div className={az("maxw800 mxauto mobile:b")}>
          <div className="tac">
            <a href="/">
              <small>back to home page</small>
            </a>
          </div>
          <h1 className="tac mt2 fz3">Why Azbuka?</h1>
          <p className="my1 maxw500 mxauto">
            The very first question that you probably ask yourself is why use Azbuka for your CSS? Why not something
            like Tailwind. And you'll be right to ask that question.
          </p>
          <hr />
        </div>

        <div className="grid2 maxw600 mxauto">
          <div className="tac p1 paler">
            <small>Other similar libraries</small>
          </div>
          <div className="tac p1">
            <small>Azbuka</small>
          </div>
          {COMPARISON.map(([left, right], index) => (
            <React.Fragment key={index}>
              <div className="border-r border-t p1 paler">{left}</div>
              <div className="border-t p1">{right}</div>
            </React.Fragment>
          ))}
        </div>

        <div className="mt3 maxw600 mxauto">
          <h2>What Azbuka is</h2>
          <p className="mt1">
            Azbuka is a <strong>CSS compiler</strong>.
          </p>
          <p>
            It doesn’t ship a predefined set of classes. Instead, it gives you the tools to{" "}
            <strong>design your own utility language</strong>
            and compile it into CSS.
          </p>
          <p>
            You don’t adopt someone else’s vocabulary — you{" "}
            <strong>create the one that matches your product and team</strong>.
          </p>
        </div>

        <div className="mt3 maxw600 mxauto">
          <h2>Philosophy</h2>
          <p className="mt1">Azbuka is built around a simple idea:</p>
          <blockquote>
            CSS is not just something you write. It’s something that can be{" "}
            <strong>compiled from a higher-level language that you control.</strong>
          </blockquote>
          <p>Azbuka focuses on:</p>
          <ul className="mt1 list">
            <li>defining utilities instead of consuming predefined ones</li>
            <li>expressing design decisions through syntax, not configuration files</li>
            <li>generating CSS as a compiler output, not hand-crafted stylesheets</li>
          </ul>
          <p>
            You don’t configure a framework. You <strong>design a language</strong> for your UI.
          </p>
        </div>

        <div className="mt3 maxw600 mxauto">
          <h2>How working with Azbuka feels</h2>
          <p className="mt1">With Azbuka, your workflow looks like this:</p>
          <ol className="mt1 list">
            <li>decide on your tokens and constraints</li>
            <li>define utilities that reflect your design system</li>
            <li>introduce macros for common UI patterns</li>
            <li>let the compiler generate the CSS</li>
          </ol>
          <p>
            The output is clean CSS.
            <br />
            The input is <strong>your own utility syntax</strong>.
          </p>
        </div>

        <div className="mt3 maxw600 mxauto">
          <h2>What makes Azbuka different conceptually</h2>

          <h3 className="mt2">🔤 You own the vocabulary</h3>
          <p className="mt1">Instead of learning someone else’s naming system, you:</p>
          <ul className="mt1 list">
            <li>create domain-specific utilities</li>
            <li>tune naming to your team’s taste</li>
            <li>express semantics that match the product</li>
          </ul>
          <p className="mt1">
            The class names belong to <strong>your design system</strong>, not to a library.
          </p>

          <h3 className="mt2">🧩 Macros as first-class citizens</h3>
          <p className="mt1">Long chains of utilities like:</p>
          <pre className="why-code">
            <code>p-4 mt-2 rounded shadow-sm text-sm bg-white/70 backdrop-blur</code>
          </pre>
          <p>can instead become:</p>
          <pre className="why-code">
            <code>card(primary compact)</code>
          </pre>
          <p>Macros let you:</p>
          <ul className="mt1 list">
            <li>bundle recurring patterns</li>
            <li>give things names that make sense</li>
            <li>avoid “utility soup”</li>
            <li>keep everything at the utility level, not components</li>
          </ul>
          <p className="mt1">
            They behave much more like <strong>functions</strong> than static classes.
          </p>
          <pre className="why-code">
            <code>{`{
  macros: {
    card: (type, size) => {
      if (type === "primary" && size === "compact") {
        return "p-4 mt-2 rounded shadow-sm text-sm bg-white/70 backdrop-blur";
      }
      // ...
    }
  }
}`}</code>
          </pre>

          <h3 className="mt2">🧠 Programmable utility language</h3>
          <p className="mt1">
            Utilities in Azbuka are not strings — they are <strong>syntax trees</strong>.
          </p>
          <p className="mt1">That means they can:</p>
          <ul className="mt1 list">
            <li>compose</li>
            <li>nest</li>
            <li>accept parameters</li>
            <li>respond to variants (like responsive conditions)</li>
            <li>expand into multiple rules</li>
            <li>be analyzed and optimized</li>
          </ul>
          <p className="mt1">
            This gives you <strong>tools normally reserved for programming languages</strong>, applied to CSS.
          </p>
        </div>

        <div className="mt3 maxw600 mxauto">
          <h2>Why this matters for large projects</h2>
          <p className="mt1">As systems scale, CSS problems aren’t about colors or spacing. They’re about:</p>
          <ul className="mt1 list">
            <li>consistency</li>
            <li>name explosion</li>
            <li>long unreadable class strings</li>
            <li>inability to encode conventions</li>
            <li>drift between design and implementation</li>
          </ul>
          <p className="mt1">Azbuka addresses these by giving you:</p>
          <ul className="mt1 list">
            <li>
              <strong>macros instead of copy-paste</strong>
            </li>
            <li>
              <strong>language rules instead of conventions written in wikis</strong>
            </li>
            <li>
              <strong>compile-time guarantees instead of “be careful”</strong>
            </li>
          </ul>
          <hr className="mt3 mb3" />
          <div className="tac">
            <a href="/">
              <small>back to home page</small>
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default App
