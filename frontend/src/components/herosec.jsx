import BulletinCard from "./BulletinCard";
import EssentialsSection from "./EssentialsSection";
import IdeaSuggestionFooter from "./IdeaSuggestionFooter";
import MilestoneSection from "./MilestoneSection";
import QuickLinks from "./QuickLinks";
import WhatsNewSection from "./WhatsNewSection";
import h4Icon from '../assets/Banner 2.jpg';
//import h4Icon from '../assets/Green and Red Playful Christmas Sale Banner.jpg';
const Herosec = () => {

  const Name = localStorage.getItem("firstName");
  return (
    <section className="relative">

      {/* Hero Gradient and Bulletin in one block */}
      <div className="relative bg-white">
        {/* Hero Gradient Background */}

        <div id="bulletinCard" className="h-[65vh] ">
          <img
            src={h4Icon}
            alt="Hero Banner"
            className="w-full h-full object-cover mt-10"
          />

          <h3 className="absolute text-5xl font-header font-normal tracking-widest text-white top-[24vh] left-1/2 transform -translate-x-1/2 w-9/12 max-w-8xl">
            Welcome {Name}
          </h3>

        </div>

        {/* Bulletin Card sits overlapping naturally */}
        <div className="relative -mt-[8rem] sm:-mt-[10rem] md:-mt-[10rem] mx-auto w-[95%] sm:w-9/12 max-w-8xl z-20 shadow-2xl rounded-2xl bg-white">
          <BulletinCard />
        </div>
      </div>

      {/* White Content Starts clean after bulletin */}
      <div className="bg-white pt-14">
        {/* QuickLinks */}
        <div id="quickLinks"  className="relative   mx-auto w-[95%] sm:w-9/12 max-w-8xl min-h-[200px]">
          <QuickLinks onCardClick={(item) => console.log('Clicked:', item.title)} />
        </div>

        {/* Essentials */}
        <div id="essentialsSection" className="bg-essentials w-full">
          <div className="relative mx-auto w-[95%] sm:w-9/12 max-w-8xl py-12">
            <EssentialsSection />
          </div>
        </div>


        {/* Milestone */}

        <div  id="milestoneSection" className="bg-milestone w-full">
          <div className="relative mb-18 mx-auto w-[95%] sm:w-9/12 max-w-8xl py-14">
            <MilestoneSection />
          </div>
        </div>

        {/* What's New */}
        <div id="whatsNewSection"  className="relative  mb-12 mx-auto w-[95%] sm:w-9/12 max-w-8xl">
          <WhatsNewSection />
        </div>

        {/* Footer */}
        <IdeaSuggestionFooter />
      </div>
    </section>
  );
};

export default Herosec;
