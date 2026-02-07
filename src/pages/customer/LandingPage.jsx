import { useEffect } from 'react';
import HeroSection from '../../components/layout/HeroSection';
import TopPathologies from '../../components/layout/TopPathologies';
import AboutSection from '../../components/layout/AboutSection';
import WhyChooseSection from '../../components/layout/WhyChooseSection';
import TopTests from '../../components/layout/TopTests';
import HowItWorks from '../../components/layout/HowItWorks';
import PlatformFeatures from '../../components/layout/PlatformFeatures';
import GrowBusiness from '../../components/layout/GrowBusiness';
import BrandsSection from '../../components/layout/BrandsSection';
import ContactSection from '../../components/layout/ContactSection';
import { useLocation } from 'react-router-dom';


const LandingPage = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    return (
        <div className="flex flex-col">
            <div id="home">
                <HeroSection />
            </div>
            <TopPathologies />
            <div id="about">
                <AboutSection />
            </div>
            <WhyChooseSection />
            <div id="services">
                <TopTests />
            </div>
            <HowItWorks />
            <GrowBusiness />
            <PlatformFeatures />
            <BrandsSection />
            <div id="contact">
                <ContactSection />
            </div>
        </div>
    );
};

export default LandingPage;
