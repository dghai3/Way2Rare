import React from "react";
import Hero from "../components/Hero";
import { Slides } from "../assets/asset.js";   // ✅ matches export
import HeroCarousel from "../components/HeroCarousel";

const Home = () => {
  return (
    <div>
      <HeroCarousel slides={Slides} />  {/* ✅ pass the array of slide objects */}

      <Hero />

    </div>
  );
};

export default Home;
