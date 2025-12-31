import az from 'azbuka/az'

export default function Header() {
  return (
    <header>
      <div className={az("maxw1000 mxauto p1 desktop:py3")}>
        <div className="flex-center gap1">
          <a href="/">
            <img src="/azbuka.svg" width="100" height="100" alt="Azbuka logo" />
          </a>
        </div>
      </div>
    </header>
  );
}