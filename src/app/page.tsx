// import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer/Footer";
import Navbar from "@/components/common/Navbar/Navbar";
import AdviceBanner from "@/components/Home/AdviceBanner/AdviceBanner";
import DiseasesSection from "@/components/Home/DiseasesSection/DiseasesSection";
import DoctorByCity from "@/components/Home/DoctorByCity/DoctorByCity";
import DoctorSection from "@/components/Home/DoctorSection/DoctorSection";

import HealthBlogs from "@/components/Home/HealthBlogs/HealthBlogs";
import HeroSearch from "@/components/Home/HeroSearch/HeroSearch";
import PartnerSlider from "@/components/Home/PartnerSlider/PartnerSlider";
import ReviewSlider from "@/components/Home/ReviewSlider/ReviewSlider";
import ServiceGrid from "@/components/Home/ServiceGrid/ServiceGrid";
import SymptomsSection from "@/components/Home/SymptomsSection/SymptomsSection";
import WhyDoctorKendro from "@/components/Home/WhyDoctorKendro/WhyDoctorKendro";
// import Navbar from "@/components/layouts/Navbar/Navbar";
import React from "react";

const Home = () => {
  return (
    <div>
      <Navbar></Navbar>
      <HeroSearch></HeroSearch>
      <ServiceGrid></ServiceGrid>
      <AdviceBanner></AdviceBanner>
      <DoctorSection></DoctorSection>
      <SymptomsSection></SymptomsSection>
      <DiseasesSection></DiseasesSection>
      <ReviewSlider></ReviewSlider>
      <HealthBlogs></HealthBlogs>
      {/* <WhyMarham></WhyMarham> */}
      <WhyDoctorKendro></WhyDoctorKendro>
      <PartnerSlider></PartnerSlider>
      <DoctorByCity></DoctorByCity>
      <Footer></Footer>
    </div>
  );
};

export default Home;
