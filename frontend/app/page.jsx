import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Benefits from '../components/landing/Benefits';
import HowItWorks from '../components/landing/HowItWorks';
import ProductDemo from '../components/landing/ProductDemo';
import AISection from '../components/landing/AISection';
import Testimonials from '../components/landing/Testimonials';
import CTABanner from '../components/landing/CTABanner';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Benefits />
      <HowItWorks />
      <ProductDemo />
      <AISection />
      <Testimonials />
      <CTABanner />
      <Footer />
    </main>
  );
}
