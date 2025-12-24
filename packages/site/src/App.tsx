import { useEffect, useReducer } from 'react';
import fx from 'forgecss/fx'
import { Editor } from './Editor';
import { ACTUAL_HTML_FILE, DEFAULT_FILES, DEFAULT_OUTPUT_FILES, TOTAL_CSS_FILE } from './constants';
import transformHtmlClassAttributes from './utils/transformHtmlClassAttributes';

type File = {
  filename: string,
  content: string,
  selected: boolean,
  type: string
}

function filesReducer(state: File[], action: { type: string; payload?: any }) {
  if (action.type === "selected") {
    state = state.map((file, i) => ({
      ...file,
      selected: action.payload === i
    }))
  } else if (action.type === "change") {
    const [filename, content] = action.payload;
    state = state.map((file) => ({
      ...file,
      content: file.filename === filename ? content : file.content
    }))
  }
  return state;
}

function App() {
  const [inputFiles, updateInputFiles] = useReducer(filesReducer, DEFAULT_FILES);
  const [outputFiles, updateOutputFiles] = useReducer(filesReducer, DEFAULT_OUTPUT_FILES);
  const selectedInput = inputFiles.filter((f) => f.selected)[0];
  const selectedOutput = outputFiles.filter((f) => f.selected)[0];

  async function compile() {
    const css = inputFiles.filter((f) => f.filename === "styles.css")[0].content;
    const html = inputFiles.filter((f) => f.filename === "page.html")[0].content;
    let config = inputFiles.filter((f) => f.filename === "forgecss.config.json")[0].content;
    try {
      config = JSON.parse(config);
      // @ts-ignore
      config.minify = false;
    } catch(err) {
      console.error(err);
      return;
    }
    // @ts-ignore
    const forgecss = ForgeCSS(config);
    const result = await forgecss.parse({ css, html });
    updateOutputFiles({
      type: "change",
      payload: [TOTAL_CSS_FILE.filename, result]
    });
    updateOutputFiles({
      type: "change",
      payload: [
        ACTUAL_HTML_FILE.filename,
        transformHtmlClassAttributes(html, (className: string) => {
          return fx(className)
        })
      ]
    });
  }

  useEffect(() => {
    compile();
  }, [inputFiles])

  return (
    <>
      <header>
        <div className={fx("maxw1000 mxauto p1 desktop:py3")}>
          <div className="flex-center gap1">
            <img src="/forgecss.svg" width="100" height="100" alt="ForgeCSS logo"/>
          </div>
        </div>
      </header>
      <section className={fx("hero py3 mobile:p1")}>
        <div className={fx("maxw800 mxauto grid2x1 gap2 mobile:b")}>
          <div>
            <h1 className={fx("fz2 mobile:mt1 desktop:fz3")}>A compiler for utility classes.</h1>
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
          <img src="/forgecss-diagram.svg" className={fx("hero-image b mxauto")} style={{ maxWidth: "100%" }} alt="ForgeCSS how-it-works diagram" />
        </div>
      </section>
      <main className="black-bg" id="playground">
        <h2 className={fx("pt2 tac fz2 desktop:fz3")}>Test it out!</h2>
        <div>
          <div className={fx("p1 desktop:grid2,pt3,pl3,pr3 gap1 mxauto")} style={{ maxWidth: "1700px" }}>
            <div className="flex-col">
              <Tabs files={inputFiles} onClick={(i: number) => updateInputFiles({ type: "selected", payload: i })} />
              <Editor
                code={selectedInput.content}
                language={selectedInput.type}
                key={selectedInput.filename}
                onChange={(code) => updateInputFiles({ type: "change", payload: [selectedInput.filename, code] })}
              />
              <div className={fx("flex-center mt1 mobile:hidden")}>
                <img src="/input.svg" width="100" />
              </div>
            </div>
            <div className={fx("flex-col mobile:mt1")}>
              <Tabs files={outputFiles} onClick={(i: number) => updateOutputFiles({ type: "selected", payload: i })} />
              <Editor code={selectedOutput.content} language={selectedOutput.type} readonly />
              <div className={fx("flex-center mt1 mobile:hidden")}>
                <img src="/output.svg" width="100" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Tabs({ files, onClick }: { files: File[]; onClick: Function }) {
  return (
    <ul className="files">
      {files.map((file, i) => {
        return (
          <li key={file.filename} className={fx(`[${file.selected}]:selected`)}>
            <button onClick={() => onClick(i)}>{file.filename}</button>
          </li>
        );
      })}
    </ul>
  );
}

export default App
