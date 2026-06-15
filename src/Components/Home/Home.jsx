import "./Home.css";
import Hero from "./Hero/Hero";
import Category from "./Category/Category";
import Medications from "../Medications/Medications";
import Testimonials from "./Testimonials/Testimonials";
import JoinNow from "./JoinNow/JoinNow";
import WhyUs from "./WhyUs/WhyUs";

export default function Home() {
  return (
    <div className="home-page">
      <Hero />
      <Medications />
      <Category />
      <WhyUs />
      <Testimonials />
      <JoinNow />
    </div>
  );
}
