import az from "azbuka/az";

const EXAMPLES = [
  {
    input: (
      <span>
        <span className="bit1">foo</span> <span className="bit2">bar</span>
      </span>
    ),
    outputHTML: <span>foo bar</span>,
    outputCSS: <span>-</span>,
    text: (
      <span>
        <code className="code1">foo</code> and <code className="code2">bar</code> are just tokens here. No CSS is
        generated.
      </span>
    )
  },
  {
    input: (
      <span>
        <span className="bit1">hover</span>:<span className="bit2">bar</span>
      </span>
    ),
    outputHTML: <span>hover_bar</span>,
    outputCSS: (
      <span>
        hover_bar:<span className="bit1">hover</span> {"{"} <span className="bit2">...</span> {"}"}
      </span>
    ),
    text: (
      <span>
        If <code className="code1">hover</code> is a valid pseudo class and <code className="code2">bar</code> is a
        valid utility class, CSS will be generated for the hover state of <code>hover_bar</code> applying the styles set
        in <code className="code2">.bar</code> class.
      </span>
    )
  },
  {
    input: (
      <span>
        <span className="bit1">desktop</span>:<span className="bit2">bar</span>
      </span>
    ),
    outputHTML: <span>desktop_bar</span>,
    outputCSS: (
      <span>
        @media <span className="bit1">(min-width: 780px)</span> {"{"}
        <br />
        <span className="pl1">
          .desktop_bar {"{"} <span className="bit2">...</span> {"}"}
        </span>
        <br />
        {"}"}
      </span>
    ),
    text: (
      <span>
        If <code className="code1">desktop</code> is a valid breakpoint (defined into the Azbuka configuration) and{" "}
        <code className="code2">bar</code> is a valid utility, media query will be generated for the created class{" "}
        <code>desktop_bar</code> with the styles set in <code className="code2">.bar</code> class.
      </span>
    )
  },
  {
    input: (
      <span>
        <span className="bit1">desktop</span>:<span className="bit2">foo</span>,<span className="bit3">bar</span>
      </span>
    ),
    outputHTML: <span>desktop_foo desktop_bar</span>,
    outputCSS: (
      <span>
        @media <span className="bit1">(min-width: 780px)</span> {"{"}
        <br />
        <span className="pl1">
          .desktop_foo {"{"} <span className="bit2">...</span> {"}"}
        </span>
        <br />
        <span className="pl1">
          .desktop_bar {"{"} <span className="bit3">...</span> {"}"}
        </span>
        <br />
        {"}"}
      </span>
    ),
    text: (
      <span>
        If <code className="code1">desktop</code> is a valid breakpoint (defined into the Azbuka configuration) and{" "}
        <code className="code2">foo</code> and <code className="code3">bar</code> are valid utility classes, media query
        will be generated for the created classes <code>desktop_foo</code> and <code>desktop_bar</code>. The styles set
        in <code className="code2">.foo</code> class and <code className="code3">.bar</code> class will be applied.
      </span>
    )
  },
  {
    input: (
      <span>
        [&:<span className="bit1">hover</span>]:<span className="bit2">foo</span>
      </span>
    ),
    outputHTML: <span>I-hover_foo</span>,
    outputCSS: (
      <span>
        I-hover_foo:<span className="bit1">hover</span> {"{"} <span className="bit2">...</span> {"}"}
      </span>
    ),
    text: (
      <span>
        The string between <code>[</code> and <code>]</code> is treated as a selector. In this case, it creates a class
        called
        <br />
        <code>I-hover_foo</code> with a hover pseudo class. The <code>&</code> basically represents the current element.
        The styles set in <code className="code2">.foo</code> class will be applied.
      </span>
    )
  },
  {
    input: (
      <span>
        [<span className="bit1">.dark &</span>]:<span className="bit2">foo</span>
      </span>
    ),
    outputHTML: <span>dark-I_foo</span>,
    outputCSS: (
      <span>
        <span className="bit1">.dark .dark-I_foo</span> {"{"} <span className="bit2">...</span> {"}"}
      </span>
    ),
    text: (
      <span>
        The string between <code>[</code> and <code>]</code> is treated as a selector. In this case, it creates a class
        called
        <br />
        <code>dark-I_foo</code>. The <code>&</code> basically represents the current element. The styles set in{" "}
        <code className="code2">.foo</code> class will be applied.
      </span>
    )
  },
  {
    input: (
      <span>
        [<span className="bit1">true</span>]:<span className="bit2">foo</span>
      </span>
    ),
    outputHTML: <span>foo</span>,
    outputCSS: <span>-</span>,
    text: (
      <span>
        If the string between <code>[</code> and <code>]</code> is <code className="code1">true</code> then the class{" "}
        <code className="code2">foo</code> is left. No additional CSS is generated. This is useful when used in the
        context of React apps where we have
        <br />
        <code>
          className={"{az(`["}
          {"${condition"}
          {"}]:foo"}
          {"`)}"}
        </code>{" "}
        which means that if <code>condition</code> is <code className="code1">false</code> then the class{" "}
        <code className="code2">foo</code> is removed.
      </span>
    )
  },
  {
    input: (
      <span>
        <span className="bit1">layout</span>(<span className="bit2">compact</span>)
      </span>
    ),
    outputHTML: <span>layout-compact</span>,
    outputCSS: <span>.layout-compact {"{"} ... {"}"}</span>,
    text: (
      <span>
        If <code className="code1">layout</code> is a valid macro a class called <code>layout-compact</code> is created and the styles defined in the macro for the{" "}
        <code>compact</code> argument are applied. Check out the Macros field in the <a href="#api">Configuration</a> section for more details.
      </span>
    )
  }
];

export default function Syntax() {
  return (
    <div id="syntax" className="bg-black py3">
      <h2 className={az("title()")}>Syntax</h2>
      {EXAMPLES.map((example, i) => {
        return (
          <div className="maxw800 mxauto mt2 syntax-example border-l border-t" key={i}>
            <div className={az("grid2 mobile:b")}>
              <div className="tac p1 input border-r flex-center fz2" data-label="class=">
                {example.input}
              </div>
              <div>
                <div className="p1 output bg" data-label=".html">
                  {example.outputHTML}
                </div>
                <div className="p1 output bg-dark bgborder-t" data-label=".css">
                  {example.outputCSS}
                </div>
                <div className="p1 border-t border-b">
                  <small>{example.text}</small>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
