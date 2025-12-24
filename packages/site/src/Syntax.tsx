import fx from "forgecss/fx";

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
        valid utility, CSS will be generated for the hover state applying the styles set in{" "}
        <code className="code2">bar</code> class.
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
          desktop_bar {"{"} <span className="bit2">...</span> {"}"}
        </span>
        <br />
        {"}"}
      </span>
    ),
    text: (
      <span>
        If <code className="code1">desktop</code> is a valid breakpoint (defined into the ForgeCSS configuration) and <code className="code2">bar</code> is a
        valid utility, media query will be generated for the created class <code>desktop_bar</code> with the styles set in <code className="code2">bar</code> class.
      </span>
    )
  }
];

export default function Syntax() {
  return (
    <div id="syntax" className="black-bg">
      <h2 className={fx("pt2 tac fz2 desktop:fz3")}>syntax</h2>
      {EXAMPLES.map((example, i) => {
        return (
          <div className="maxw800 mxauto mt2 syntax-example border-l border-t" key={i}>
            <div className={fx("grid2")}>
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
                <div className="p1 border-t border-b paler">
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
