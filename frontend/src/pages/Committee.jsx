import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useEffect } from "react";

const Committee = () => {
  const navigate = useNavigate();
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  return (
    <><Header /><div className="ml-2 relative mt-24">
      {/* Breadcrumb */}
    <div className="ml-8 text-sm text-[#777] font-medium mb-8">
  <span
    onClick={() => navigate('/Dashboard')}
    className="text-black cursor-pointer hover:underline"
  >
    Home
  </span>
  <span className="mx-1">/</span>
  <span className="text-black">Committee</span>
</div>


      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center">
          <span className="mr-12">🌻</span>
          Welcome to Our Committees!
          <span className="ml-12">🌸</span>
        </h1>
        <h2 className="text-3xl md:text-4xl font-medium">
          Where Work Meets Wow!
        </h2>
      </div>

      {/* Scalable container */}
      <div className="overflow-x-auto relative w-full mb-10 flex justify-center overflow-hidden">
        <div
          className="relative origin-top scale-90 sm:scale-100"
          style={{ width: 1280, height: 680 }}
        >
          {/* Left-side description */}
          <div
            className="absolute text-[#333] text-sm leading-relaxed font-semibold"
            style={{ width: 310, top: 45, left: 4 }}
          >
            At CMS, we don't just work—we celebrate, create, play, and plant!
            Our <strong>Digital Lounge Committees</strong> are your backstage
            pass to all the fun, flavor, fitness, and foliage that make CMS a
            truly awesome place to be.
          </div>

          {/* Committee 1 */}
          <div
            className="absolute bg-[#FF755A] overflow-hidden shadow-xl transform transition-transform duration-200 cursor-pointer hover:scale-105"
            style={{ width: 220, height: 220, top: 245, borderRadius: 38 }}
            onClick={() => navigate("/committee1", { state: { committee: "Canteen Committee" } })} // Navigate to Happitude Committee
          >
            <img
              src="/canteenCommittee.png "
              className="object-cover p-3"
              alt="Canteen Committee" />

            <div className="absolute inset-0 flex mt-[186px] px-16 transition-colors duration-200 hover:text-yellow-200">
              <span className="font-bold text-xl drop-shadow-lg">
                Canteen 
              </span>
            </div>
          </div>

          <div
            className="absolute text-[#333] text-sm leading-relaxed font-semibold"
            style={{
              width: 310,
              top: 580, // Adjust this up or down as you fine-tune
              left: 4, // Keeps a small left margin
            }}
          >
          
          </div>

          {/* Committee 2 */}
          <div
            className="absolute bg-[#DC3545] overflow-hidden shadow-xl"
            style={{
              width: 220,
              height: 144,
              top: 160,
              left: 235,
              borderRadius: 38,
            }}
          >
            <img
              src="/committee2.png"
              className=" object-cover p-7 "
              alt="Committee 2" />
          </div>

          {/* Committee 3 */}
          <div
            className="absolute bg-[#FFE9E8] overflow-hidden shadow-xl"
            style={{
              width: 220,
              height: 224,
              top: 320,
              left: 235,
              borderRadius: 38,
            }}
          >
            <img
              src="/committee3.png"
              className="w-full h-full object-cover"
              alt="Committee 3" />
          </div>

          {/* Committee 4 */}
          <div
            className="absolute bg-[#DC3545] overflow-hidden shadow-xl transform transition-transform duration-200 cursor-pointer hover:scale-105"
            style={{
              width: 258,
              height: 502,
              top: 110,
              left: 470,
              borderRadius: 38,
            }}
            onClick={() => navigate("/committee1", { state: { committee: "Happitude Committee" } })}
          >
            <img
              src="/happitudeCommittee.png"
              className="object-cover mt-10"
              alt="Happitude Committee" />
            <div className="absolute inset-0 flex mt-[450px] px-12">
              <span className="font-bold text-xl drop-shadow-lg transition-colors duration-200 hover:text-yellow-200">
                😁 Happitude
              </span>
            </div>
          </div>

          {/* Committee 5 */}
          <div
            className="absolute bg-[#FFE9E8] overflow-hidden shadow-xl transform transition-transform duration-200 cursor-pointer hover:scale-105"
            style={{
              width: 220,
              height: 224,
              top: 160,
              left: 745,
              borderRadius: 38,
            }}
            onClick={() => navigate("/committee1", { state: { committee: "Sports Committee" } })}
          >
            {/* Image fills the top part */}
            <img
              src="/sportsCommittee.png"
              className="object-cover w-full h-3/4"
              alt="Sports Committee" />


            {/* Text fixed at bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex">
              <span className="font-bold text-xl drop-shadow-lg transition-colors duration-200 hover:text-yellow-200">
                🏏 Sports
              </span>
            </div>
          </div>

          {/* Committee 6 */}
          <div
            className="absolute bg-[#DC3545] overflow-hidden shadow-xl"
            style={{
              width: 220,
              height: 144,
              top: 400,
              left: 745,
              borderRadius: 38,
            }}
          >
            <img
              src="/committee6.png"
              className="object-cover p-5"
              alt="Committee 6" />
          </div>

          {/* Committee 7 */}
          <div
            className="absolute bg-[#FF755A] overflow-hidden shadow-xl transform transition-transform duration-200 cursor-pointer hover:scale-105"
            style={{
              width: 220,
              height: 220,
              top: 245,
              left: 985,
              borderRadius: 38,
            }}
            onClick={() => navigate("/committee1", { state: { committee: "Garden Committee" } })}
          >
            <img
              src="/gardenCommittee.png"
              className="object-cover h-3/4 mt-3 ml-7"
              alt="Committee 7" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex">
              <span className="font-bold text-xl drop-shadow-lg transition-colors duration-200 hover:text-yellow-200 ">
                🌻 Garden
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
          ⭐ Want to Join the Fun?
        </h2>
        <p className="text-[#555] max-w-3xl mx-auto text-sm md:text-base">
          Every year, new members are nominated to join these committees.
          Whether you're a party planner, food lover, sports enthusiast, or
          plant whisperer—there's a place for you to shine! Stay tuned for
          nominations and get ready to make CMS even more amazing!
        </p>
      </div>
    </div></>
  );
};

export default Committee;