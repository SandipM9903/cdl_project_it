import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";

const ExecutiveInsightsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fullText = `
With the physical and Digital world converging, offerings across industries are being enhanced with digital capabilities. As digital transformation and business automation accelerate, clients expect an immersive experience. This requires a slew of technologies including Web 3.0, Gen AI, Cloud, AI, ML, Blockchain, 5G/6G connectivity, LCAP, Quantum, Metaverse etc. Assembling this jigsaw of Software, Applications, Cloud and AI is complex and requires Innovation and deep Engineering expertise. We call it Imagineering.

In 2025, we operate in a world where the global economy, while resilient as inflation and war fears subside, continues to face uncertainty due to persistent geopolitical challenges. Against this backdrop, we are steadfastly positioning ourselves as a top-tier digital services and software company. We have been speaking of being a software business for a few years now. Last year, we truly started getting a move on in Software. 2024 was a year where every solved problem mattered – for the business as well as the impact we created for several marquee clients. Increasingly, we engaged with clients at a much larger scale and implemented complex technology solutions.

The pivot to software and Digital makes us stronger than ever, though there are miles to go with strong engineering and innovation. As an organisation, our focus should be on building an adaptable operational foundation, one capable of thriving amidst rapid technology change. The way to go about is by overcoming challenges, pushing limits, and doing it alongside people who care deeply.

This direction calls for a set of actions:

- Get closer to clients and understand their business better.
- Build deep expertise in software and digital technologies built around our domains – eGovernance, Crime Intelligence & Forensics, Financial Inclusion, Healthcare, Agriculture, Smart Cities, Ports, Energy and Climate Resilience.
- Change and expertise accelerate through cross-functional teams and ecosystems of technology partners. We need to be agile and market responsive to grab opportunities with partners.
- Laser-sharp focus backed by regular governance will instil disciplined execution. As a project-driven organisation, getting “right first time” is extremely crucial.

2025 is all about “what’s more” – as we build the future with Engineering and Imagination.
`;

  return (
    <>
      <Header />
      <div className="text-gray-600 text-sm  font-content relative z-10 mt-24 ml-8">
        <Link to="/Dashboard" className="text-black hover:underline font-content">Home</Link> / <span className="text-black font-semibold font-content">Insights</span>
      </div>
      <div className="relative bg-white rounded-lg shadow-lg max-w-4xl mx-auto mt-20 mb-12 p-6 max-h-full overflow-y-auto">

        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/escheresque.png')] opacity-10 pointer-events-none"></div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 font-header mb-4 relative z-10">
          Imagineer the Future
        </h2>

        {/* CEO Message */}
        <p className="text-gray-900 text-sm font-content leading-relaxed relative z-10 whitespace-pre-line text-justify">
          {fullText}
        </p>

        <div className="mt-6 border-t pt-3 text-sm text-gray-900 italic relative font-content z-10">
          <br />
          <span className="font-semibold">Anil Menon</span><br />
        </div>
      </div>
    </>
  );
};

export default ExecutiveInsightsPage;
