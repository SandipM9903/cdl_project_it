// import React from "react";
// import { useParams } from "react-router-dom";
// import blogPosts from "./blogPosts";
// import { FaCalendarAlt } from "react-icons/fa";
// import { FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";
// import { formatDistanceToNow } from "date-fns";
// import Header from "../components/Header";

// const BlogPost = () => {
//   const { id } = useParams();
//   const post = blogPosts.find((p) => p.id === parseInt(id));

//   if (!post) return <p className="px-4 py-6">Blog not found</p>;

//   const postAge = formatDistanceToNow(new Date(post.date), { addSuffix: true });

//   return (
//     <><Header /><div className="mt-20 max-w-5xl mx-auto bg-white">
//       {/* Breadcrumb */}
//       <div className="text-sm text-[#777] font-medium mb-4">
//         Home / <span className="text-black">Blogs</span>
//       </div>

//       <h1 className="text-[24px] md:text-[32px] font-bold mb-4 text-center">
//         {post.title}
//       </h1>

//       {/* <img
//       src={post.image}
//       alt={post.title}
//       className="w-full h-auto rounded-lg mb-6"
//     /> */}
//       <img
//         src={post.image}
//         alt={post.title}
//         className="w-full h-80 object-cover rounded-lg mb-6" />

//       <div className="grid grid-cols-[1fr_3fr] gap-6">
//         {/* Left Column */}
//         <div>
//           <div className="flex items-center text-gray-500 text-sm mb-4 space-x-6">
//             <div className="flex items-center space-x-1">
//               <FaCalendarAlt />
//               <span>{post.date}</span>
//             </div>
//             <span className="px-2 py-1 text-gray-500 rounded text-xs">
//               -- {postAge}
//             </span>
//           </div>
//         </div>

//         {/* Right Column */}
//         <div>
//           <p className="text-gray-700 text-[15px] leading-7 mb-6 whitespace-pre-line">
//             {post.body}
//           </p>
//           <p className="text-gray-700 text-[15px] leading-7 mb-6 whitespace-pre-line">
//             {post.body}
//           </p>

//           <h2 className="text-[18px] md:text-[22px] font-semibold mb-2">
//             {/* “IS ORGANIZATION USE FOR PROCESSED MINING VS DATA MINING – BOTH ARE
//     NECESSARY?” – SAMPLE ANALYSIS HIGHLIGHT */}
//             {post.title}
//           </h2>
//           <p className="text-gray-700 text-[15px] leading-7 mb-12">
//             {post.body}
//           </p>

//           <span className="px-2 py-1 border border-gray-300 rounded text-xs">
//             {post.category}
//           </span>

//           <div className="border-t border-gray-200 pt-4 flex justify-between items-center mt-3">
//             <div className="flex items-center">
//               <img
//                 src={post.authorImg}
//                 alt={post.author}
//                 className="w-10 h-10 rounded-full" />
//               <div className="ml-3">
//                 <p className="text-sm font-medium text-gray-800">
//                   {post.author}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {post.authorDesignation}
//                 </p>
//               </div>
//             </div>

//             <div className="flex space-x-3 text-gray-500">
//               <FaLinkedin className="cursor-pointer" />
//               <FaTwitter className="cursor-pointer" />
//               <FaFacebook className="cursor-pointer" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Related Posts (Static Placeholder for now) */}
//       <h3 className="text-xl font-semibold mt-12 mb-4">Related Posts</h3>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {blogPosts.slice(0, 3).map((relPost) => (
//           <div
//             key={relPost.id}
//             className="bg-white border rounded-lg overflow-hidden shadow-sm"
//           >
//             <img
//               src={relPost.image}
//               alt={relPost.title}
//               className="w-full h-[160px] object-cover" />
//             <div className="p-4">
//               <p className="text-xs text-gray-400">{relPost.date}</p>
//               <h4 className="text-[15px] font-semibold">{relPost.title}</h4>
//               <div className="flex items-center mt-2">
//                 <img
//                   src={relPost.authorImg}
//                   alt={relPost.author}
//                   className="w-6 h-6 rounded-full" />
//                 <span className="text-sm text-gray-700 ml-2">
//                   {relPost.author}
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div></>
//   );
// };

// export default BlogPost;
