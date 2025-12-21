import { useReducer } from 'react';
import './forgecss.css';
import fx from 'forgecss/fx'
import { Editor } from './Editor';

const HTML = `<div class="mt1">Hello world</div>`
const CSS = `mt1 {
  margin-top: 1rem;
}`

type File = {
  filename: string,
  content: string,
  selected: boolean
}

function filesReducer(state: File[], action: { type: string; payload?: any }) {
  if (action.type === "selected") {
    state = state.map((file, i) => ({
      ...file,
      selected: action.payload === i
    }))
  }
  return state;
}

function App() {
  const [files, updateFiles] = useReducer(filesReducer, [
    { filename: 'page.html', content: '', selected: false },
    { filename: 'styles.css', content: '', selected: true },
    { filename: 'forgecss.config.js', content: '', selected: false },
  ]);


  return (
    <>
      <header>
        <div className={fx("maxw1000 mxauto p1 desktop:mt1")}>
          <img src="/forgecss.svg" width="100" height="100" />
        </div>
      </header>
      <main>
        <div className={fx("maxw1000 mxauto")}>
          <div className="grid2 gap1 p1">
            <div className="flex-col minh400">
              <Tabs files={files} onClick={(i: number) => updateFiles({ type: 'selected', payload: i})} />
              <Editor code={HTML} language="html" className="flex1" />
            </div>
            <div className="flex-col minh400">
              <p>Compiles to</p>
              <Editor code={CSS} language="css" className="mt1 flex1" />
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
