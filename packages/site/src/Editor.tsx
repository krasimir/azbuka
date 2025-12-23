import { useRef, useState, useEffect } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "monaco-editor/esm/vs/basic-languages/html/html.contribution";
import "monaco-editor/esm/vs/basic-languages/css/css.contribution";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";

monaco.editor.defineTheme("fcss", {
  base: "vs-dark", // or 'vs'
  inherit: true,
  rules: [
    { token: "comment", foreground: "6A9955" },
    { token: "string", foreground: "CE9178" },
    { token: "keyword", foreground: "C586C0" }
  ],
  colors: {
    "editor.background": "#292929",
    "editor.foreground": "#d4d4d4",
    "editorCursor.foreground": "#ffffff",
    "editor.lineHighlightBackground": "#1e1e1e",
    "editorLineNumber.foreground": "#5a5a5a",
    "editor.selectionBackground": "#264f78",
    "editor.inactiveSelectionBackground": "#3a3d41"
  }
});
type EditorProps = {
  language: string;
  code: string;
  className?: string,
  onChange?: (code: string) => void,
  readonly?: boolean
};

export function Editor({ language, code, className, onChange, readonly }: EditorProps) {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);

  useEffect(() => {
    if (monacoEl) {
      setEditor((editor) => {
        if (editor) return editor;

        monaco.editor.setTheme("fcss");
        
        const editorInstance = monaco.editor.create(monacoEl.current!, {
          value: code,
          language: language || "javascript",
          minimap: { enabled: false },
          lineNumbers: "off",
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          scrollbar: {
            vertical: "auto",
            horizontal: "hidden"
          },
          overviewRulerLanes: 0,
          fontSize: 14,
          lineHeight: 24,
          letterSpacing: 0.4,
          contextmenu: false,
          renderLineHighlight: "none",
          cursorBlinking: "smooth",
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          readOnly: readonly,
          wordWrap: "on"
        });
        editorInstance.onDidChangeModelContent(() => {
          onChange && onChange(editorInstance.getValue());
        });
        return editorInstance;
      });
    }

    return () => {
      editor?.dispose();
    }
  }, [monacoEl.current]);

  useEffect(() => {
    if (!editor) return;
    if (editor.getValue() !== code) {
      editor.setValue(code);
    }
    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, language);
    }
  }, [code, language])

  return (
    <div className={`p1 editor-wrapper ${className ?? ''}`}>
      <div className="editor" ref={monacoEl}></div>
    </div>
  );
};
