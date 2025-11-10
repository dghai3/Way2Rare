import React from "react";
import Hero from "../components/Hero";
import { Slides } from "../assets/asset.js";   // ✅ matches export
import HeroCarousel from "../components/HeroCarousel";
import OurPolicy from "../components/OurPolicy.jsx";
import NewsletterBox from "../components/NewsletterBox"

const Home = () => {
  return (
    <div>
      <HeroCarousel slides={Slides} />  {/* ✅ pass the array of slide objects */}

      <Hero />
      <OurPolicy />
      <NewsletterBox />

    </div>
  );
};

export default Home;
