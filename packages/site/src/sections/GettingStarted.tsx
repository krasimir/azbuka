import { useEffect } from 'react';
import az from 'azbuka/az';

export default function GettingStarted() {
  useEffect(() => {
    setTimeout(() => {
      // @ts-ignore
      Prism.highlightAll();
    }, 0);
  }, [])

  return (
    <div id="getting-started" className="bg-black article">
      <h2 className={az("pt2 title()")}>Getting started</h2>
      <div className={az("maxw800 mxauto my3 mobile:px1")}>
        <p>
          Azbuka is distributed as a <strong>npm</strong> package. So:
        </p>
        <div className="my1">
          <pre>
            <code className="language-javascript">{">"} npm install azbuka</code>
          </pre>
        </div>
        <p>
          Create a configuration file named <code>azbuka.config.js</code> in the root of your project:
        </p>
        <div className="my1">
          <pre>
            <code className="language-json">
              {`export default {
  "dir": "./src",
  "output": "./public/styles.css",
  "breakpoints": {
    "mobile": "480px",
    "tablet": "768px",
    "desktop": "1024px"
  }
}`}
            </code>
          </pre>
        </div>
        <p>Now, you can use the Azbuka CLI to compile your CSS:</p>
        <div className="my1">
          <pre>
            <code className="language-javascript">{">"} npx azbuka</code>
          </pre>
        </div>
        <p>or</p>
        <div className="my1">
          <pre>
            <code className="language-javascript">{">"} npx azbuka -w</code>
          </pre>
        </div>
        <p>if you want to run Azbuka in watch mode.</p>
        <div className="mt1">
          This command will read your source files.
          <ul>
            <li>
              It will find the <code>.css/.less/.scss</code> files and will build an inventory of utility classes.
            </li>
            <li>
              It will then parse your <code>.html/.jsx/.tsx</code> files to find the utility class usages.
            </li>
            <li>
              Finally, it will generate a compiled CSS file at the specified output path (
              <code>./public/styles.css</code> in this case).
            </li>
          </ul>
        </div>
        <p>
          Since Azbuka is not touching your source files you have to use the <code>az</code>{" "}
          (Azbuka expression) helper function:
        </p>
        <div className="my1">
          <pre>
            <code className="language-jsx">
              {`import az from 'azbuka/az';

function MyComponent() {
  return (
    <div className={az("p2 mobile:p1")}>
      Hello, Azbuka!
    </div>
  );
}`}
            </code>
          </pre>
          <p>
            This is so you get the proper class name strings transformed. For example <code>p2 mobile:p1</code>{" "}
            to <br /><code>p2 mobile_p1</code>.
          </p>
          <p className="mt1">
            If you don't use React there is a <code>az</code> function that you can use in the browser:
          </p>
          <pre>
            <code className="language-html">{`<script src="http://unpkg.com/azbuka@latest/dist/client.min.js"></script>`}</code>
          </pre>
          <p>
            Once you include that file onto your page you'll get the <code>class</code> attributes converted
            automatically. If you later want to trigger that logic you can execute the globally available function{" "}
            <code>azAll</code>. Internally calls <code>az</code> which is also available globally for manual usage.
          </p>
        </div>
      </div>
    </div>
  );
}