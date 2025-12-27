import React from 'react';
import az from 'azbuka/az';

export default function App({ className }: { className?: string }) {
  const foo = 'bar';
  const flagA = true;
  const flagB = false;

  return (
    <main>
      <h1 className={az("a desktop:b")}>Hello world!</h1>
      <p className={az(`c mobile:d desktop:b2 ${className} e`)}>Something else</p>
      <p className="f desktop:g">No usage of az so no pick up</p>
      <p className={az(`a [${flagA}]:b [${flagB}]:c`)}></p>
      <button className={az("[&:hover]:a")}></button>
      <p className={az("a [.dark &]:b c")}></p>
      <p className={az("a [.dark desktop:b]:c d")}></p>
      <p className={az("a [.dark &:has(.desc)]:c d")}></p>
      <p className={az("a [.dark &[type='password']]:c d")}></p>
    </main>
  );
}