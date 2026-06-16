import React, { useEffect, useState } from 'react';
import Header from '../components/Header';

const leaders = [
    {
        id: 1,
        name: 'Satish Jorapur',
        title: 'Chief Operations Officer - Government Solution Division',
        image: './thumbnail_Satish Jorapur (1).png',
        message: `Satish Jorapur leads the Government Solutions Division (GSD) at CMS, with full P&L responsibility and a focus on driving sustained business growth, operational excellence, and successful project delivery.

He holds an MBA in Marketing from the Eastern Institute for Integrated Learning in Management and has completed the FNFE course from IIM Bangalore. With a two-decade-long association with CMS, Satish brings extensive experience in leading complex e-Governance programs. He oversees a multidisciplinary team comprising Sales, Pre-Sales, Solutions, Software, Infrastructure, Strategy, and Delivery. His leadership ensures that CMS consistently meets business targets while delivering mission-critical solutions that enhance transparency, efficiency, and citizen services across various states in India.

Under his guidance, GSD has successfully executed large-scale projects including BOOT initiatives, CSC deployments, system integration engagements, and manpower augmentation programs. These projects play a transformative role in enabling governments to improve service delivery and governance at scale.

Satish is committed to continuous improvement and innovation across operations. By aligning cross-functional teams of engineers, architects, project managers, and operations leaders, he ensures GSD remains a high-performing division—consistently achieving growth, profitability, and impact year after year.`,
    },
    {
        id: 2,
        name: 'Mathimaran.P',
        title: 'Head - Software Solutions Division',
        image: './Mathimaran.png',
        message: `Mathimaran leads the Software Services Division (SSD) at CMS, focusing on delivering high-quality, scalable software solutions that drive business growth and customer satisfaction.

He holds a degree in Computer Science (NIT, Tiruchirappalli) and joined CMS in 2022. With deep expertise in emerging technologies and software delivery practices, he oversees business development, pre-sales, platform and POC development, software delivery management, process standardization, and internal IT automation. He ensures strong technical governance while promoting knowledge management and competency enablement across teams.

Under his leadership, SSD has successfully secured and executed several strategic software projects in a competitive landscape—including Invest India-PMG, PFRDA-HRMS & Finance, ORGI-CRS, SBM, and DIC-NHAI—strengthening CMS’s digital transformation capabilities.`,
    },
    {
        id: 3,
        name: 'Anup Desai',
        title: 'General Manager & Head - Industry Solutions',
        image: './Anup.png',
        message: `At CMS, I'm focused on driving strategic growth across Energy, Utilities, Climate Resilience, Healthcare, and Agriculture by aligning innovation with real-world impact. Our goal is to build scalable, cost-effective, and sustainable solutions that address critical customer challenges through cutting-edge technologies, AI/ML, and automation. We are committed to enhancing operational excellence, fostering a culture of collaboration, and delivering measurable value to our clients. As we look ahead, our priority is to continuously evolve, anticipate market needs, and expand our digital footprint—strengthening CMS's position as a trusted partner in building smarter, greener, and more resilient systems for the future.`,
    },
    {
        id: 5,
        name: 'Balvinder Cheema',
        title: 'Senior Vice President - Digital Practices',
        image: './Balvinder Photo.png',
        message: `Balvinder Singh Cheema leads the Digital Centre of Excellence (DCoE) at CMS Computers, driving innovation across AI Labs, Cloud Infrastructure, UI/UX, Mobility, and Data Engineering.

With a background in Electronics & Computer Hardware Technology and extensive experience in digital transformation, Balvinder brings a strong blend of technical expertise and strategic vision. He joined CMS in 2022 and has been instrumental in delivering citizen-centric platforms powered by next-generation technologies. His initiatives—such as GenAI-powered systems, SmartPulse BI, Road AI, conversational AI tools, and reusable mobility frameworks—have expanded CMS’s footprint across Public Infrastructure, Smart Cities, and E-Governance.

Balvinder works closely with cross-functional teams to modernize legacy systems into agile, cloud-native platforms that promote transparency, operational efficiency, and real-time governance. His leadership ensures CMS’s digital solutions are purpose-built for scale, impact, and future readiness.
`,
    },
    {
        id: 4,
        name: 'Sudhir Shetty',
        title: 'Head - Enterprise Sales & Ecosystems',
        image: './Sudhir Shetty_Leadership Corner .jpg',
        message: `Sudhir Shetty leads Strategic Alliances & Ecosystems as well as Enterprise Business Development at CMS, playing a pivotal role in shaping the company’s long-term innovation and growth strategy. He drives high-impact partnerships with global cloud providers, SaaS platforms, and industry leaders to co-develop solutions, expand market presence, and build joint go-to-market frameworks.

Sudhir also spearheads enterprise business growth by addressing complex customer needs across IT modernization, digital transformation, healthcare innovation, and cloud adoption. His dual responsibility fuses strategic vision with execution excellence—positioning CMS at the forefront of ecosystem-led innovation.

With a Bachelor’s degree in Commerce from the University of Mumbai, a Postgraduate qualification in Sales and Marketing Management from the National Institute of Sales, and a Senior Management Program from IIM Kozhikode, Sudhir joined CMS in 2000. He firmly believes that modern business is powered by ecosystems, not just products. By harnessing the power of partnerships, he enables CMS to accelerate innovation, deliver scalable, future-ready solutions, and create measurable impact across industries`,
    },
    {
        id: 6,
        name: 'Vaibhav Chavan',
        title: 'Head - Smart City & Traffic Practices',
        image: './Vaibhav C.jpg',
        message: `As Business Head for Smart City, Traffic & Ports, I'm focused on shaping future-ready infrastructure through scalable, secure, and citizen-centric solutions. From smart mobility and intelligent traffic systems to public safety and digital transformation, we're driving large-scale impact across urban India. With full P&L ownership, my role is to ensure seamless delivery, spark product innovation, and deepen stakeholder trust. Looking ahead, we're committed to expanding our portfolio with AI-powered platforms, connected systems, and data-driven insights—making cities smarter, ports more efficient, and public services more responsive to the needs of tomorrow's India.`,
    },
    {
        id: 7,
        name: 'Manisha Patil',
        title: 'Chief General Manager & Head - Human Resources & Administration',
        image: './Manisha Patil.jpeg',
        message: `Manisha Patil leads the Human Resources and Administration function at CMS, overseeing Talent Management, HR Shared Services & Compliance, Industrial Relations, and the HR Business Partner organization.

She holds a BSc (Hons), an MBA in Human Resources and CRM, and certifications in ITIL, Talent Management (Vskills), HR Analytics (IIM Rohtak), and Corporate Directorship (Institute of Directors). With a career at CMS spanning over two decades, she brings deep institutional knowledge and a people-centric approach to her leadership.

Manisha is known for driving organizational transformation through data-driven HR strategies, compliance-led governance, and a strong focus on employee experience and culture. Her leadership fosters collaboration, operational efficiency, and continuous learning across the workforce.

Committed to building a future-ready and inclusive workplace, Manisha is focused on creating a culture that empowers people, adapts to change, and supports CMS’s long-term vision for sustainable growth.`,
    },
    {
        id: 8,
        name: 'Ravindra Jha',
        title: 'Head-Commercial',
        image: './Ravindrakumar Jha.jpg',
        message: `Ravindra Jha leads the Commercial function at CMS, ensuring that every bid and business proposal aligns with the company’s strategic, financial, and operational goals.

He holds a degree in MBA(Finance) & CA(Finalist) and joined CMS in 2023. With strong expertise in commercial strategy and governance, Ravindra leads a dynamic team focused on strengthening cross-functional collaboration and enhancing decision-making across the bid lifecycle. His efforts have led to the development of structured governance models that help mitigate risks and drive profitability.


Under his leadership, the commercial team has implemented key frameworks to increase bid success rates and improve financial foresight for long-term, large-scale projects. These frameworks play a vital role in

CMS’s ability to deliver competitive, compliant, and strategically sound proposals.

Looking ahead, Ravindra is focused on leveraging digital tools and predictive analytics to sharpen CMS’s bid processes—positioning the company to scale efficiently, win high-value projects, and lead with commercial agility in an evolving market landscape`,
    },
    {
        id: 9,
        name: 'Ganesh Pillutla',
        title: 'Vice President-Finance',
        image: './Ganesh Pillutla_Leadership Corner.jpg',
        message: `Ganesh Pillutla brings over three decades of financial leadership experience, guiding organizations through transformation, growth, and long-term value creation.

He holds a degree in B.com, A.C.A. and joined CMS in 2022 and currently leads the Finance, Supply Chain, and Legal functions, ensuring operational efficiency, compliance, and strategic alignment across business units.

Known for balancing ambition with financial discipline, he focuses on smarter resource planning, capital optimization, and building a strong financial foundation that supports sustainable business expansion. His experience spans risk management, budgeting, and performance-driven governance.

Operating at the intersection of finance and strategy, Ganesh plays a pivotal role in navigating CMS through an evolving regulatory and economic landscape, ensuring the company stays agile, future-ready, and positioned for responsible growth.`,
    },
    {
        id: 10,
        name: 'Amarnath Chattopadhaya',
        title: 'Head-Business Solutions Division',
        image: './Amarnath.png',
        message: `Amarnath Chattopadhyay leads the Business Solutions Division at CMS, driving innovation through data-driven, scalable, and impactful business solutions.

With a background in Electronics & Telecommunication Engineering from Kolkata University, a Master’s in Data Science from BITS Pilani, and executive management training from IIM Lucknow, Amarnath brings a unique blend of technical expertise and strategic leadership. He joined CMS in 2007 and has played a pivotal role in aligning technology with business goals across the organization.

Amarnath excels at bridging the gap between technical teams and business stakeholders, ensuring seamless solution delivery that meets evolving client needs. Under his leadership, the division has grown significantly, fostering a culture of innovation and delivering measurable outcomes.

Based in Delhi, he continues to lead CMS’s Business Solutions Division through a rapidly evolving digital landscape, turning complex data into strategic advantage.`,
    },
     {
        id: 10,
        name: 'Satish Shetty',
        title: 'Vice President - Service Delivery & Support',
        image: './Satish Shetty.jpg',
        message: `Satish Shetty leads the Service Delivery & Support division at CMS, overseeing end-to-end delivery operations across critical verticals including Smart Cities, Energy Management, IT Infrastructure, and Digital Solutions. As Business Head of Delivery, he holds full P&L responsibility and drives strategic execution, customer satisfaction, and operational excellence.

An Electronics and Telecommunication Engineering graduate from Karnatak University, Satish joined CMS in December 2021. With over 30 years of industry experience, he brings deep expertise in managed services, program management, project execution, and service transitions. His leadership has been instrumental in aligning delivery strategies with business objectives, streamlining processes, and strengthening solution outcomes.

Satish’s focus is on building a world-class delivery organization capable of managing both new software development and application support. Through his customer-first approach and commitment to continuous improvement, he empowers high-performing teams to deliver consistent value—supporting CMS’s long-term growth and transformation goals.`,
    }
];

function Leadership() {
    const [selectedLeader, setSelectedLeader] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [leadersPerPage, setLeadersPerPage] = useState(4);

    useEffect(() => {
        const updateLayout = () => {
            setLeadersPerPage(window.innerWidth <= 768 ? 2 : 4); // ← responsive items per page
            setCurrentPage(0); // reset to first page on resize
        };
        updateLayout(); // initial check
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, []);

    const prevLeader = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            setSelectedLeader(null);
        }
    };

    const nextLeader = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
            setSelectedLeader(null);
        }
    };

    const totalPages = Math.ceil(leaders.length / leadersPerPage);

    // Create a sorted copy of the leaders array for display
    // This is where the fix goes: sort the leaders array once, then slice it.
    const sortedLeaders = [...leaders].sort((a, b) => a.name.localeCompare(b.name));
    const currentLeaders = sortedLeaders.slice(currentPage * leadersPerPage, (currentPage + 1) * leadersPerPage);

    return (
        <>
            <Header />
            <div className="bg-[#FAFAFA] min-h-[calc(100vh-64px)]">
                <div className="px-6 sm:px-10 lg:px-[140px] pt-24 text-sm text-gray-500 font-medium">
                    <a href="/Dashboard" className="text-black hover:underline">Home</a> /
                    <span className="text-black ml-1">Leadership Corner</span>
                </div>
                <div>
                    <h1 className="text-[30px] sm:text-[36px] md:text-[36px] lg:text-[38px] xl:text-[40px] text-[#060606] font-[400] px-6 sm:px-10 lg:px-[140px]">
                        Leadership Corner
                    </h1>
                </div>
                <div className='grid grid-cols-12 mx-10'>
                    <div className='col-span-1 mt-36'>
                        {totalPages > 1 && (
                            <div className="">
                                <button
                                    onClick={prevLeader}
                                    disabled={currentPage === 0}
                                    className={`px-5 py-4 rounded-full text-sm transition ${currentPage === 0 ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-[#923A39] text-white hover:bg-[#7c2c2b]'}`}
                                >
                                    <span>{'<'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className='col-span-10'>
                        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 space-x-6 mt-5 sm:mt-6 xl:mt-12 font-raleway'>
                            {currentLeaders.map((leader) => ( // Removed index from here as key should be stable
                                <div
                                    key={leader.id} // Use leader.id for a stable key
                                    onClick={() => setSelectedLeader(leader)}
                                    className='cursor-pointer p-2 rounded-md'>
                                    <img
                                        src={leader.image}
                                        alt='Profile pic'
                                        className={`w-[130px] sm:w-[150px] md:w-[180px] lg:w-[200px] xl:w-[232px] h-[130px] sm:h-[150px] md:h-[180px] lg:h-[200px] xl:h-[232px] rounded-full`} />
                                    {selectedLeader?.id === leader.id && (
                                           <div className="">
                                            {/* These absolute positioning values will need to be carefully checked for responsiveness */}
                                            <div className={`absolute ml-[15px] top-[171px] sm:top-[236px] md:top-[266px] lg:top-[288px] xl:top-[396px] w-[2px] bg-[#DC3545] h-[130px] sm:h-[130px] md:h-[130px] lg:h-[150px] xl:h-[175px]`} />
                                            <div className={`absolute -ml-[5px] w-10 h-10 rounded-full top-[285px] sm:top-[330px] md:top-[370px] lg:top-[400px] xl:top-[555px] bg-[#DC3545]`} />
                                        </div>
                                    )}
                                    <div className='text-center mt-3'>
                                        <h1 className='text-[#060606] text-[16px] xl:text-[20px] font-header'>{leader.name}</h1>
                                        <p className="text-[13px] text-gray-600 font-content">{leader.title}</p>
                                    </div>

                                </div>
                            ))}
                        </div>

                        {selectedLeader && (
                            <div className='bg-[#FFFFFF] mt-2 sm:mt-5 md:mt-6 lg:mt-10 xl:mt-7 p-5 sm:p-7 xl:p-12 shadow-lg border border-gray-100'>
                                <h1 className="text-2xl font-semibold text-[#060606]">{selectedLeader.name}</h1>
                                <p className="text-[#333333] text-base leading-7 text-justify max-w-4xl mb-4 mt-3">{selectedLeader.message}</p>
                            </div>
                        )}
                    </div>
                    <div className='col-span-1 mt-36'>
                        {totalPages > 1 && (
                            <div className="w-full flex justify-between mt-6 px-4 sm:px-6 md:px-12">
                                <button
                                    onClick={nextLeader}
                                    disabled={currentPage === totalPages - 1}
                                    className={`px-5 py-4 rounded-full text-sm transition ${currentPage === totalPages - 1 ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-[#923A39] text-white hover:bg-[#7c2c2b]'}`}
                                >
                                    <span>{'>'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Leadership;