import { useEffect } from 'react';
import az from 'azbuka/az';

const CONFIG = [
  { name: "dir", type: <strong>required</strong>, description: "The directory of your source files (CSS and markup)." },
  { name: "out", type: <strong>required</strong>, description: "The output CSS file path." },
  {
    name: "watch",
    type: "optional",
    description: "Whether to watch for changes and rebuild automatically. Default to false."
  },
  {
    name: "inventoryFiles",
    type: "optional",
    description: 'An array file types to your build the class utilities inventory. Default is ["css", "less", "scss"].'
  },
  {
    name: "usageFiles",
    type: "optional",
    description: 'An array of file types to scan for class usage. Default is ["html", "jsx", "tsx"].'
  },
  {
    name: "usageAttributes",
    type: "optional",
    description: 'An array of attributes to scan for class usage. Default is ["class", "className"].'
  },
  {
    name: "breakpoints",
    type: "optional",
    description: (
      <span>
        An object defining custom breakpoints.
        <pre>
          <code className="language-json">{`{
  "sm": "640px",
  "md": "768px",
  "lg": "1024px",
  "xl": "1280px"
}`}</code>
        </pre>
        so you can use <code>sm:mt1</code> for example.
      </span>
    )
  },
  {
    name: "macros",
    type: "optional",
    description: (
      <span>
        An object defining custom macros. Each key is the macro name and the value is a function that returns a string
        of classes. For example:
        <pre>
          <code className="language-javascript">{`{
  "title": () => "tac fz2 desktop:fz3"
}`}</code>
        </pre>
        so you can use <code>title()</code> in your class names. Have in mind that the macros can also accept arguments. For example:
        <pre>
          <code className="language-javascript">{`{
  "layout": (type) => {
    if (type === "compact") {
      return "p1 m1";
    }
    if (type === "spacious") {
      return "p3 m3";
    }
    return "";
  }
}`}</code>
        </pre>
        so you can use <code>layout(compact)</code> or <code>layout(spacious)</code> in your class names.
      </span>
    )
  },
  {
    name: "verbose",
    type: "boolean",
    description: "Whether to log detailed information during the build process. Default is false."
  },
  { name: "minify", type: "boolean", description: "Whether to minify the output CSS. Default is false." },
  {
    name: "bundleAll",
    type: "boolean",
    description: "Whether to include all utilities in the output CSS, regardless of usage. Default is false."
  }
];

const CLI = [
  {
    name: "-c, --config <path>",
    type: "optional",
    description:
      "Path to the configuration file. Default is 'azbuka.config.json', 'azbuka.config.js' or 'azbuka.config.mjs' in the root of the project."
  },
  {
    name: "-w, --watch",
    type: "optional",
    description: "Run Azbuka in watch mode, rebuilding on file changes."
  },
  {
    name: "-v, --verbose",
    type: "optional",
    description: "Enable verbose logging for detailed build information."
  }
];

export default function API() {
  useEffect(() => {
    setTimeout(() => {
      // @ts-ignore
      Prism.highlightAll();
    }, 0);
  }, [])

  return (
    <div id="api" className="bg-black article">
      <h2 className={az("pt2 title()")}>API & Configuration</h2>
      <hr />
      <div className={az("maxw800 mxauto my3 fz09 mobile:px1")}>
        <h3 className="fz2" id="configuration">
          Configuration
        </h3>
        <p className="mt1">
          Azbuka is by default searching for <code>azbuka.config.json</code>, <code>azbuka.config.js</code> or{" "}
          <code>azbuka.config.mjs</code> in the root folder of the project. The returned object has the following
          shape:
        </p>
        <div className="mt2">
          <Table items={CONFIG} />
        </div>
        <h3 className="fz2 mt2" id="configuration">
          CLI
        </h3>
        <div className="mt2">
          <Table items={CLI} />
        </div>
        <h3 className="fz2 mt2" id="configuration">
          JavaScript
        </h3>
        <p className="mt2">If you need to you can use Azbuka as a JavaScript module:</p>
        <div className="my1">
          <pre>
            <code className="language-javascript">
              {`import Azbuka from 'azbuka';

const azbuka = Azbuka({
  inventoryFiles: ['css', 'less', 'scss'], // optional
  usageFiles: ['html', 'jsx', 'tsx'], // optional
  usageAttributes: ['class', 'className'], // optional
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  }, // optional
  verbose: false, // optional
  minify: false, // optional
  bundleAll: false // optional
});

// Parse a directory
const cssA = await azbuka.parseDirectory({
  dir: './src',
  output: './public/styles.css', // optional
  watch: false // optional
});

// Parse a single file
const cssB = await azbuka.parseFile({
  file: './src/index.html',
  output: './public/styles.css', // optional
  watch: false // optional
});

// Parse CSS string
const cssC = await azbuka.parse({
  css: '.mt1 { margin-top: 0.25rem; }',
  html: '<div class="mt1"></div>' // html or jsx
  // jsx: '<div className={"mt1"}></div>',
  // output: './public/styles.css', // optional
});`}
            </code>
          </pre>
        </div>
        <p>
          The object that you pass to the <code>Azbuka</code> function is the{" "}
          <a href="#configuration">configuration</a> object that controls how Azbuka processes your files and
          generates CSS.
        </p>
      </div>
    </div>
  );
}

function Table({ items }: { items: { name: string; type: React.ReactNode; description: React.ReactNode }[] }) {
  return items.map(({ name, type, description }) => (
    <div key={name} className={az("grid1x1x2 mobile:b border")}>
      <div className={az("flex-center desktop:border-r")}>{name}</div>
      <div className={az("paler flex-center desktop:border-r")}>{type}</div>
      <div className="p05">{description}</div>
    </div>
  ));
}