import React from "react";
import Hero from "../components/home/Hero";
import ServiceCategories from "../components/home/ServiceCategories";
import FeaturedVendors from "../components/home/FeaturedVendors";
import PlannerFeatures from "../components/home/PlannerFeatures";
import VendorCategories from "../components/home/VendorCategories";
import PlannerScreens from "../components/home/PlannerScreens";
import SubscriptionPlans from "../components/home/SubscriptionPlans";
import CallToAction from "../components/home/CallToAction";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>HowzEvent - Venues, Vendors, Vibes for All Your Events</title>
        <meta name="description" content="Plan any type of event with HowzEvent. Find and book the best service providers for corporate functions, markets, festivals, concerts, sports events and celebrations." />
      </Helmet>
      
      <Hero />
      <ServiceCategories />
      <FeaturedVendors />
      <PlannerFeatures />
      <VendorCategories />
      <PlannerScreens />
      <SubscriptionPlans />
      <CallToAction />
    </>
  );
}
