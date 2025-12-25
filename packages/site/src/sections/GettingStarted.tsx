import { useEffect } from 'react';
import fx from 'forgecss/fx';

export default function GettingStarted() {
  useEffect(() => {
    setTimeout(() => {
      // @ts-ignore
      Prism.highlightAll();
    }, 0);
  }, [])

  return (
    <div id="getting-started" className="bg-black article">
      <h2 className={fx("pt2 tac fz2 desktop:fz3")}>Getting started</h2>
      <div className={fx("maxw800 mxauto my3 mobile:px1")}>
        <p>
          ForgeCSS is distributed as a <strong>npm</strong> package. So:
        </p>
        <div className="my1">
          <pre>
            <code className="language-javascript">{">"} npm install forgecss</code>
          </pre>
        </div>
        <p>
          Create a configuration file named <code>forgecss.config.json</code> in the root of your project:
        </p>
        <div className="my1">
          <pre>
            <code className="language-json">
              {`{
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
        <p>Now, you can use the ForgeCSS CLI to compile your CSS:</p>
        <div className="my1">
          <pre>
            <code className="language-javascript">{">"} npx forgecss</code>
          </pre>
        </div>
        <p>
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
        </p>
        <p>
          One last thing - to get proper class name strings you have to use the <code>fx</code> (ForgeCSS expression)
          helper function:
        </p>
        <div className="my1">
          <pre>
            <code className="language-jsx">
              {`import fx from 'forgecss/fx';

function MyComponent() {
  return (
    <div className={fx("p2 bg-blue mobile:p1")}>
      Hello, ForgeCSS!
    </div>
  );
}`}
            </code>
          </pre>
          <p>
            If you don't use React there is a <code>fx</code> function that you can use in the browser:
          </p>
          <pre>
            <code className="language-html">{`<script src="http://unpkg.com/forgecss@latest/dist/client.min.js"></script>`}</code>
          </pre>
          <p>
            Once you include that file onto your page you'll get the <code>class</code> attributes converted
            automatically. If you later want to trigger that logic you can execute the globally available function{" "}
            <code>fxAll</code>. Internall calls <code>fx</code> which is also available globally for manual usage.
          </p>
        </div>
      </div>
    </div>
  );
}