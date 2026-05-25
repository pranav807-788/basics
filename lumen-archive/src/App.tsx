import { useLenis } from "./lib/useLenis";
import BulbScene from "./components/BulbScene";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import WhatWeDo from "./components/WhatWeDo";
import Showcase from "./components/Showcase";
import HowWeWork from "./components/HowWeWork";
import BehindMagic from "./components/BehindMagic";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";

export default function App() {
  useLenis();
  return (
    <div className="relative grain min-h-screen overflow-x-hidden bg-ink-900 text-white">
      <BulbScene />
      <Navigation />
      <main className="relative">
        <Hero />
        {/* Soft transition seam from hero into services */}
        <div className="pointer-events-none relative -mt-16 h-32 bg-gradient-to-b from-transparent via-ink-900/70 to-ink-900" />
        <WhatWeDo />
        <Showcase />
        <HowWeWork />
        <BehindMagic />
        <Testimonials />
        <Contact />
      </main>
    </div>
  );
}
