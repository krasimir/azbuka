import { useEffect, useReducer, useState } from 'react';
import './forgecss.css';
import fx from 'forgecss/fx'
import { Editor } from './Editor';
import { DEFAULT_FILES, DEFAULT_OUTPUT_FILES } from './constants';
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
    updateOutputFiles({ type: "change", payload: ["forgecss.css", result] });
    const normalizedHtml = transformHtmlClassAttributes(html, (className: string) => {
      return fx(className)
    });
    updateOutputFiles({ type: "change", payload: ["page.html", normalizedHtml] });
  }

  useEffect(() => {
    compile();
  }, [inputFiles])

  return (
    <>
      <header>
        <div className={fx("maxw1000 mxauto p1 desktop:mt1")}>
          <img src="/forgecss.svg" width="100" height="100" />
        </div>
      </header>
      <main className="bg">
        <div className={fx("black-bg")}>
          <div className={fx("p1 desktop:grid2,p3 gap1 mxauto")} style={{ maxWidth: '1700px'}}>
            <div className="flex-col minh500">
              <Tabs files={inputFiles} onClick={(i: number) => updateInputFiles({ type: "selected", payload: i })} />
              <Editor
                code={selectedInput.content}
                language={selectedInput.type}
                className="flex1"
                key={selectedInput.filename}
                onChange={(code) => updateInputFiles({ type: "change", payload: [selectedInput.filename, code] })}
              />
            </div>
            <div className={fx("flex-col minh500 mobile:mt1")}>
              <Tabs files={outputFiles} onClick={(i: number) => updateOutputFiles({ type: "selected", payload: i })} />
              <Editor
                code={selectedOutput.content}
                language={selectedOutput.type}
                className="flex1"
                readonly
              />
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
