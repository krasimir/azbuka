import { useEffect, useReducer } from "react";
import fx from "forgecss/fx";
import { Editor } from "../Editor";
import { ACTUAL_HTML_FILE, DEFAULT_FILES, DEFAULT_OUTPUT_FILES, TOTAL_CSS_FILE } from "../constants";
import transformHtmlClassAttributes from "../utils/transformHtmlClassAttributes";

type File = {
  filename: string;
  content: string;
  selected: boolean;
  type: string;
};

function filesReducer(state: File[], action: { type: string; payload?: any }) {
  if (action.type === "selected") {
    state = state.map((file, i) => ({
      ...file,
      selected: action.payload === i
    }));
  } else if (action.type === "change") {
    const [filename, content] = action.payload;
    state = state.map((file) => ({
      ...file,
      content: file.filename === filename ? content : file.content
    }));
  }
  return state;
}

export default function Playground() {
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
    } catch (err) {
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
          return fx(className);
        })
      ]
    });
  }

  useEffect(() => {
    compile();
  }, [inputFiles]);

  useEffect(() => {
    setTimeout(() => {
      // @ts-ignore
      Prism.highlightAll();
    }, 0);
  }, [outputFiles]);

  return (
    <section className="bg-black" id="playground">
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
            <div className="editor-wrapper">
              <pre>
                <code className={`language-${selectedOutput.type}`}>{selectedOutput.content}</code>
              </pre>
            </div>
            <div className={fx("flex-center mt1 mobile:hidden")}>
              <img src="/output.svg" width="100" />
            </div>
          </div>
        </div>
      </div>
    </section>
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
