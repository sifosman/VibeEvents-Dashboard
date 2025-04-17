import React from "react";
import Hero from "../components/home/Hero";
import ServiceCategories from "../components/home/ServiceCategories";
import FeaturedVendors from "../components/home/FeaturedVendors";
import PlannerFeatures from "../components/home/PlannerFeatures";
import VendorCategories from "../components/home/VendorCategories";
import PlannerScreens from "../components/home/PlannerScreens";
import CallToAction from "../components/home/CallToAction";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>WeddingPro - Your Wedding Planning Solution</title>
        <meta name="description" content="Plan your perfect wedding day with WeddingPro. Find and book the best service providers for your special day." />
      </Helmet>
      
      <Hero />
      <ServiceCategories />
      <FeaturedVendors />
      <PlannerFeatures />
      <VendorCategories />
      <PlannerScreens />
      <CallToAction />
    </>
  );
}
