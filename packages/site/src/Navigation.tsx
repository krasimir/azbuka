export default function Navigation() {
  return (
    <nav className="flex-col gap1">
      <a href="/why" className="flex-center gap05 why">
        <img src="/thumbs-up.svg" width="20" />
        Why Azbuka?
      </a>
      <a href="#syntax" className="flex-center gap05">
        <img src="/align-left.svg" width="20" />
        Syntax
      </a>
      <a href="#getting-started" className="flex-center gap05">
        <img src="/play-circle.svg" width="20" />
        Getting started
      </a>
      <a href="#api" className="flex-center gap05">
        <img src="/sliders.svg" width="20" />
        API & Configuration
      </a>
      <a href="#playground" className="flex-center gap05">
        <img src="/code.svg" width="20" />
        Playground
      </a>
      <a href="https://github.com/krasimir/azbuka" target="_blank" className="flex-center gap05">
        <img src="/github.svg" width="20" />
        GitHub repo
      </a>
      <a
        href="https://krasimirtsonev.com/blog/article/azbuka-treating-css-like-a-real-programming-language-finally"
        target="_blank"
        className="flex-center gap05"
      >
        <img src="/edit.svg" width="20" />
        Introductory blog post
      </a>
    </nav>
  );
}