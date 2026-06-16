
import React from 'react';
import { Link } from "react-router-dom";
import Header from '../components/Header';
function Trending() {
    return (
        <><Header /><div className="pt-24 px-4 sm:px-6 md:px-10 lg:px-32 max-w-screen-2xl mx-auto">
            {/* Breadcrumb */}
            <h1 className="text-xs sm:text-sm font-medium text-gray-400">
                <Link to="/Dashboard">
                    <span className="hover:underline cursor-pointer text-gray-500">Home</span>
                </Link>
                {" / "}
                <span className="font-bold text-sm sm:text-[16px] text-black font-header">What's Trending</span>
            </h1>

            {/* Heading */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-6 pb-2">
                {/* <img src="/Img.jpeg" className="h-8 w-8 sm:h-9 sm:w-9" alt="trending" /> */}
                <h1 className="text-[24px] sm:text-3xl font-bold">What's Trending</h1>
            </div>
            {/* Subheading */}
            <div className="text-[20px] sm:text-xl font-semibold">
                Your Daily Dose of Buzz, Business & Big Wins
            </div>
            {/* Paragraph */}
            <div className="text-base sm:text-[16px] mt-2 leading-relaxed font-content">
                Welcome to the pulse of the moment! Whether you're tracking the markets, catching up on sports drama, or staying ahead of the headlines.<br />
                "What’s Trending" brings it all together in one dynamic space.
            </div>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 mt-12">
                {/* Card 1 */}
                <div className="lg:col-span-6 sm:col-span-2 col-span-1">
                    <div className="relative group rounded-lg shadow-md w-full">
                        <img src="/bulb.jpg" alt="Bulb" className="h-64 sm:h-72 w-full object-cover rounded-lg grayscale group-hover:grayscale-0 transition duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 bg-white/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-3">
                            <div className="flex flex-col sm:flex-row justify-between gap-3">
                                <div className="text-black">
                                    <h2 className="text-lg sm:text-xl font-bold font-header flex items-center gap-2">
                                        <img src="paper.png" alt="News Icon" className="w-5 h-5 sm:w-6 sm:h-6" />
                                        Business Buzz
                                    </h2>
                                    <h1 className="text-base font-medium mt-1">Boardroom to Bull Run</h1>
                                    <p className="text-sm font-content">
                                        Updates from ET, NASDAQ & Sensex—your daily <br />dose of market moves.
                                    </p>
                                </div>

                                <Link to="/news/business">
                                    <button className="sm:mt-[60px] text-sm font-semibold py-2 px-6 rounded-lg text-white bg-[#EC221F] hover:bg-[#F54A47]">
                                        See More
                                    </button>  </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Card 2 */}
                <div className="lg:col-span-5 sm:col-span-2 col-span-1">
                    <div className="relative group rounded-lg shadow-md w-full">
                        <img src="/sports.jpg" alt="Cycle" className="w-full h-64 sm:h-80 object-cover rounded-lg grayscale group-hover:grayscale-0 transition duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 bg-white/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-3">
                            <div className="flex flex-col sm:flex-row justify-between gap-3">
                                <div className="text-black">
                                    <h2 className="text-lg sm:text-xl font-bold flex font-header gap-2">
                                        <img src="ball.png" alt="News Icon" className="w-5 h-5 sm:w-6 sm:h-6" />
                                        Sports Spotlight</h2>
                                    <h1 className="text-base font-medium mt-1">Game On!</h1>
                                    <p className="text-sm font-content">
                                        Catch the latest scores and stories from <br />NDTV Sports—fast, fun, and full of action.
                                    </p>
                                </div>
                                <Link to="/news/sports">
                                    <button className="sm:mt-[60px] text-sm font-semibold py-2 px-6 rounded-lg text-white bg-[#EC221F] hover:bg-[#F54A47]">
                                        See More</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Side Bars */}
                <div className="hidden lg:block col-span-1 justify-end bg-[#DC3545] w-14 rounded-2xl"></div>
                <div className="hidden lg:block col-span-1 bg-[#DC3545] w-14 rounded-2xl -mt-8"></div>
                {/* Card 3 */}
                <div className="lg:col-span-5 sm:col-span-2 col-span-1 sm:-ml-7 sm:-mt-8">
                    <div className="relative group rounded-lg border w-full">
                        <img src="/trending.jpg" alt="Trending" className="w-full h-64 sm:h-80 rounded-lg grayscale group-hover:grayscale-0 transition duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 bg-white/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-3">
                            <div className="flex flex-col sm:flex-row justify-between gap-3">
                                <div className="text-black">
                                    <h2 className="text-lg sm:text-xl font-bold flex gap-2 font-header">
                                        <img src="news.png" alt="News Icon" className="w-5 h-5 sm:w-6 sm:h-6" />
                                        Technove</h2>
                                    <h1 className="text-base font-medium mt-1">India Now</h1>
                                    <p className="text-sm font-content">
                                        Top stories from HT—politics, culture, and<br />everything shaping the nation.
                                    </p>
                                </div>
                                <Link to="/news/tech">
                                    <button className="sm:mt-[60px] text-sm font-semibold py-2 px-6 rounded-lg text-white bg-[#EC221F] hover:bg-[#F54A47]">
                                        See More</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Card 4 */}
                <div className="lg:col-span-6 sm:col-span-2 col-span-1 mr-0 sm:mr-7">
                    <div className="relative group rounded-lg shadow-md h-64 sm:h-72 w-full">
                        <img src="/animal.jpg" alt="Bull" className="h-full w-full object-cover rounded-lg grayscale group-hover:grayscale-0 transition duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 bg-white/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-3">
                           <div className="flex flex-col sm:flex-row justify-between gap-3">
  <div className="text-black">
    <h2 className="text-lg sm:text-xl font-bold flex gap-2 font-header">
      <img src="bar.png" alt="News Icon" className="w-5 h-5 sm:w-6 sm:h-6" />
      Market Pulse
    </h2>
    <h1 className="text-base font-medium mt-1">Ticker Talk</h1>
    <p className="text-sm font-content">
      Live trends from NASDAQ & Sensex—real-time data, fast insights.
    </p>
  </div>

  {/* Button aligned to bottom-right in one line */}
  <div className="flex sm:items-end sm:justify-end">
    <Link to="/news/market">
      <button className="whitespace-nowrap text-sm font-semibold py-2 px-6 rounded-lg text-white bg-[#EC221F] hover:bg-[#F54A47]">
        See More
      </button>
    </Link>
  </div>
</div>

                        </div>
                    </div>
                </div>
            </div>
            {/* Bottom Heading */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-12">
                <div className="text-xl sm:text-2xl flex gap-2 mt-1">
                    <img src="rocket.png" alt="News Icon" className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-xl sm:text-[32px] font-semibold font-header">
                        Why Just Read When You Can Ride the Trend?
                    </span></div>
            </div>
            <div className="text-base sm:text-lg font-semibold mb-12 mt-2 font-content">
                From boardroom buzz to locker room legends, this is your one-stop scroll for everything that’s making waves today.
            </div>
        </div></>
    );
}
export default Trending;