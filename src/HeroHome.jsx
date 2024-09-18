import About from './HomePage/About';
import AllInOne from './HomePage/AllInOne';
import Footer from './HomePage/Footer';
import Hero from './HomePage/Hero';
import Navbar from './HomePage/Navbar'
import Pricing from './HomePage/Pricing';
import Support from './HomePage/Support'

function HeroHome() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Support />
      <AllInOne />
      <Pricing />
      <Footer />
    </>
  );
}

export default HeroHome;
