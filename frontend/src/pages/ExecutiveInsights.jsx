import React, { useState } from 'react';
import Header from '../components/Header';
import { useLocation } from 'react-router-dom';

function ExecutiveInsights() {

   

    const leaders = [
      {
  id: 1,
  name: 'Aarti Grover',
  title: 'Chairperson',
  image: './cropped_image.png',
  message: `Aarti Grover is the chairperson of CMS Computers Group. As Chairperson, she provides strategic thrust to the company’s growth across various markets and businesses.

 

Ms Grover is the chief architect of CMS’s purpose of Simplifying Life for Citizens, Government and businesses through a 5000 strong team. Simplifying Life is a commitment to sustained growth with focus on Performance, Environment, public safety and transparent governance leveraging the power of technology. Ms Grover has directed the company's strategy for over 15 years and led its restructuring, including the divestiture of a few non-core businesses.

 

She works with the board setting strategy around the changing business landscape, C-suite needs, the multigenerational workforce, and what it takes for the government to provide transparent and inclusive governance leveraging technology. She is a passionate advocate for women in technology and government; technology led innovation and an outspoken advocate on the need for science and engineering education. 

 

Ms Grover’s philanthropic efforts are geared towards the underprivileged girl child delivered through various sponsorships, scholarships and social intervention at orphanage, trusts and educational institutes of repute. Ms Grover holds an MBA from the  University of San Fransisco. In addition to leading the CMS Computers Board of Directors, Ms Grover serves as a member of few other boards in addition to mentoring a slew of startups in healthcare and technology.`,
}
,
        {
  id: 2,
  name: 'Anil Menon',
  title: 'Chief Executive Officer',
  image: './cropped_image (1).png',
  message: `As the CEO of CMS Computers and CMS Traffic, Anil oversees CMS’s growth transformation into a software and Services leader and the technology partner of choice for our clients.


Anil’s early life set the foundation for his approach to life and career. His neighborhood was a mix of cultures and alive with people who celebrated their unique traditions, learning that became invaluable in his career. His professional career began as a Management Trainee at Fujitsu ICIM, subsidiary of global giant Fujitsu. In 1997, Anil joined Sun Microsystems handling product management and channel management where he was recognized for his contribution to India’s highest level scientific project - the PARAM 10000 Supercomputer built along with CDAC. He subsequently set up Citrix’s South Asia operations and scaled up business rapidly overseeing the acquisition of an Indian company.


In 2002, Anil along with others set up SecureSynergy, an Information Security Services firm as its CEO. Expanding quickly across India and GCC Countries, the firm, became the region’s leader in Managed Security. Prior to CMS, Anil was with IBM India. As its Executive Director, he ran various businesses including the Software Organization, Marketing, Geo Expansion, Ecosystems, General Business Sales as well as IBM’s Innovation Centre. He also had a stint leading Industry Solutions Channels across Growth markets covering hundred odd countries.


Anil won IBM’s prestigious Global Management Award in recognition of excellence in demonstrating IBM values, business acumen, & effective people management. He is a recipient of the Indira National Award for Engineering Excellence, 2011. Anil holds a B-Tech in Electronics, an MBA in Marketing and an Executive Leadership Certification from Cornell.`,
}
,
    ];
const location = useLocation();
    const defaultLeaderName = location.state?.defaultLeader;
    // Find and set the default leader by name
    const [selectedLeader, setSelectedLeader] = useState(() => {
        const defaultLeader = leaders.find(l => l.name === defaultLeaderName);
        return defaultLeader || '';
    });
    return (
        <><Header /><div className='px-4 mt-24 sm:px-8 md:px-12 lg:px-[100px] xl:px-[140px] bg-[#FAFAFA] min-h-[calc(100vh-64px)] pb-10'>
            <div>
                <h1 className='text-[30px] sm:text-[36px] md:text-[36px] lg:text-[38px] xl:text-[40px] text-[#060606] font-[400]'>Executive Insights</h1>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 space-x-6 mt-5 sm:mt-6 xl:mt-12 font-raleway h-full'>
                {leaders.map((leader, index) => (
                    <>
                        <div
                            key={index}
                            onClick={() => setSelectedLeader(leader)}
                            className='cursor-pointer p-2 rounded-md '>
                            <img
                                src={leader.image}
                                alt='Profile pic'
                                className={`w-[130px] sm:w-[150px] md:w-[180px] lg:w-[200px] xl:w-[232px] h-[130px] sm:h-[150px] md:h-[180px] lg:h-[200px] xl:h-[232px] rounded-full z-10`} />
                            {selectedLeader?.id === leader.id && (
                                <div className="">
                                    <div className={`absolute ml-5 top-[187px] sm:top-[313px] md:top-[236px] lg:top-[454px] xl:top-[392px] w-[2px] bg-[#DC3545] h-[120px] sm:h-[120px] md:h-[140px] lg:h-[150px] xl:h-[170px]`} />
                                    <div className={`absolute w-10 h-10 rounded-full top-[392px] md:top-[360px] lg:top-[390px] xl:top-[558px] bg-[#DC3545]`} /></div>
                            )}
                            <div className='text-left ml-6 md:text-left md:ml-9 sm:text-left sm:ml-7 lg:text-left lg:ml-8 xl:text-left xl:ml-12 '>
                                <h1 className='text-[#060606] text-[16px] xl:text-[20px]'>{leader.name}</h1>
                                <h1 className='text-[#060606] text-[12px] xl:text-[14px]'>{leader.title}</h1>
                            </div>
                        </div>
                    </>
                ))}
            </div>
            {selectedLeader && (
                <div className='bg-[#FFFFFF] mt-16 sm:mt-8 md:mt-14 p-5 sm:p-7 xl:p-12 h-full'>
                    <h1 className='text-[40px] text-[#000000] font-[700]'>{selectedLeader.name}</h1>
                    <div className="text-[#616060] mt-6 space-y-4 leading-relaxed text-justify max-w-4xl">
  {selectedLeader.message.split('\n\n').map((para, idx) => (
    <p key={idx}>{para.trim()}</p>
  ))}
</div>

                </div>
            )}
        </div></>
    );
}
export default ExecutiveInsights;
