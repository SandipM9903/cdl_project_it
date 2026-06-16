import React, { useEffect, useState } from "react";
import postsData from "./postsData";
import { FaHeart, FaRegComment, FaShare } from "react-icons/fa";
import linkedinLogo from "../assets/linkedin-icon.png";
import cmslogo from "../assets/cmslogo.png";
import Header from "../components/Header";
import { Link } from "react-router-dom";

const SocialCorner = () => {
  const [likes, setLikes] = useState(
    postsData.map(() => ({ count: 67, liked: false }))
  );
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  const handleLike = (index) => {
    setLikes((prevLikes) =>
      prevLikes.map((like, i) =>
        i === index
          ? { count: like.liked ? like.count - 1 : like.count + 1, liked: !like.liked }
          : like
      )
    );
  };

  return (
    <><Header /><div className="px-4 sm:px-6 md:px-10 lg:px-16 py-6 mt-20 bg-white">
    <div className="text-sm text-[#777] font-medium mb-8">
  <Link to="/Dashboard" className="hover:underline">Home</Link> /{" "}
  <span className="text-black font-header">Social Corner</span>
</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {postsData.map((post, index) => (
          <div
            key={index}
            className="bg-gray-100 border rounded-2xl shadow-md overflow-hidden flex flex-col h-[390px]"
          >
            {/* Header */}
            <div className="flex font-content justify-between items-center px-3 py-1 border-b text-xs text-gray-600">
              <img src={cmslogo} alt="CMS" className="h-4 w-auto" />
              
              <img src={linkedinLogo} alt="LinkedIn" className="h-7 w-auto" />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between flex-grow">
              <div className="px-4 pt-2 pb-2 flex-grow">
                <p className="text-[14px] font-content font-medium leading-snug text-gray-900">{post.title}</p>
                {post.subtitle && (
                  <p className="text-[12px] text-gray-400 font-medium mt-1">Read more</p>
                )}
              </div>

              {/* Wrap the image with an anchor tag */}
              <a href={post.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-60 object-cover font-content cursor-pointer" />
              </a>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center font-content px-4 py-2 border-t text-xs text-gray-500">
              <div className="flex items-center">
                <button
                  onClick={() => handleLike(index)}
                  className="flex items-center focus:outline-none"
                >
                  <FaHeart
                    className={likes[index].liked ? "text-red-500" : "text-gray-500"}
                    size={14} />
                  {/* <span className="text-[13px] ml-1">{likes[index].count}</span> */}
                </button>
                <FaRegComment className="text-gray-500 ml-4" size={14} />
              </div>
              <FaShare className="text-gray-500" size={14} />
            </div>
          </div>
        ))}
      </div>
    </div></>
  );
};

export default SocialCorner;












