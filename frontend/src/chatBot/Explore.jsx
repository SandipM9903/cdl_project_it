
import React, { useState } from 'react';

// import { useState } from 'react';
import { motion } from 'framer-motion';

// import styles from '../styles';
// import { exploreWorlds } from '../constants';
import { staggerContainer } from '../utils/motion';
import {ExploreCard} from '../components/ExploreCard';
import projectImage from './projectImage.png'
import complaint from './complaint.jfif'
import agent from './agent1.jfif'
import promoter from './promoter1.jfif'
// import { ExploreCard, TitleText, TypingText } from '../components';

export const Explore = () => {
    const exploreWorlds = [
        {
          id: 'world-1',
          imgUrl: projectImage,
          title: 'Projects',
      
        },
        {
          id: 'world-2',
          imgUrl: promoter,
          title: 'Promoters',
        },
        {
          id: 'world-3',
          imgUrl: agent,
          title: 'Real Estate Agents',
         
        },
        {
          id: 'world-4',
          imgUrl:complaint,
          title: 'Complaints'
        },
      ];
      const [active, setActive] = useState('world-2');
  return (
    <section className="sm:p-[0rem] xs:p-[0rem] px-6 py-[0rem]"id="explore">
    <motion.div
       variants={staggerContainer}
       initial="hidden"
       whileInView="show"
       viewport={{ once: false, amount: 0.25 }}
       className="2xl:max-w-[1280px] w-full mx-auto flex flex-col"
     >
       {/* <TypingText title="| Search " textStyles="text-center" />
       <TitleText
         title={<>Search for UP-RERA Information <br className="md:block hidden" /> to explore</>}
         textStyles="text-center"
       /> */}
         <div className="mt-[50px] flex-col min-h-[40vh] flex lg:flex-row sm:min-h-[100vh] gap-5" style={{ backgroundImage: 'url("https://media.licdn.com/dms/image/C5612AQHi0bXQrmQvyQ/article-cover_image-shrink_600_2000/0/1599113994925?e=2147483647&v=beta&t=ABzL4e9B7Gd1YqyslrSfMtqEQpzX8pQmnu_BiyoZ7v8")', backgroundSize: 'cover'}}>
         {exploreWorlds.map((world, index) => (
           <ExploreCard
             key={world.id}
             {...world}
             index={index}
             active={active}
             handleClick={setActive}
           />
         ))}
       </div>
     </motion.div>
 </section>

  )
}
