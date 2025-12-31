import az from 'azbuka/az'
import Header from './Header';
import Footer from './Footer';

function App() {
  return (
    <>
      <Header />
      <section className={az("hero bg-black py3 mobile:p1")}>
        Hey
      </section>
      <Footer />
    </>
  );
}

export default App
