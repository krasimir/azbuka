<p align="center">
  <img src="./packages/site/public/azbuka.svg" width="200" />
</p>

# Azbuka

Azbuka - Write CSS styles in your own alphabet.

How and why + documentation here https://azbuka.krasimirtsonev.com

## Getting started

Azbuka is distributed as an **npm** package. So:

```bash
npm install azbuka
```

Create a configuration file named `azbuka.config.json` in the root of your project:

```json
{
  "dir": "./src",
  "output": "./public/styles.css",
  "breakpoints": {
    "mobile": "480px",
    "tablet": "768px",
    "desktop": "1024px"
  }
}
```

Now, you can use the Azbuka CLI to compile your CSS:

```bash
npx azbuka
```

or

```bash
npx azbuka -w
```

if you want to run Azbuka in watch mode.

This command will read your source files:

- It will find the `.css/.less/.scss` files and build an inventory of utility classes.
- It will then parse your `.html/.jsx/.tsx` files to find the utility class usages.
- Finally, it will generate a compiled CSS file at the specified output path (`./public/styles.css` in this case).

One last thing – since Azbuka is not touching your source files you have to use the `az` (Azbuka expression) helper function:

```jsx
import az from 'azbuka/az';

function MyComponent() {
  return (
    <div className={az("p2 mobile:p1")}>
      Hello, Azbuka!
    </div>
  );
}
```

This is so you get the proper class name strings transformed. For example, `p2 mobile:p1` becomes  
`p2 mobile_p1`.

If you don't use React there is an `az` function that you can use in the browser:

```html
<script src="http://unpkg.com/azbuka@latest/dist/client.min.js"></script>
```

Once you include that file on your page you'll get the `class` attributes converted automatically.  
If you later want to trigger that logic manually you can execute the globally available function `azAll`.  
Internally it calls `az`, which is also available globally for manual usage.

## API and configuration

Go to the official page for the CLI and JavaScript API docs: https://azbuka.krasimirtsonev.com