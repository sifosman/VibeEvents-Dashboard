import React from "react";
import Hero from "../components/home/Hero";
import FeaturedVendors from "../components/home/FeaturedVendors";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>HowzEvent - Connect, Collaborate, Celebrate</title>
        <meta name="description" content="Plan any type of event with HowzEvent. Find and book the best service providers for corporate functions, markets, festivals, concerts, sports events and celebrations." />
      </Helmet>
      
      <Hero />
      <FeaturedVendors />
    </>
  );
}
