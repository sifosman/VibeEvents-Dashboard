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
        <title>EventZA - Venues, Vendors, Vibes for Your Perfect Event</title>
        <meta name="description" content="Plan your perfect event with EventZA. Find and book the best service providers for all your special occasions." />
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
