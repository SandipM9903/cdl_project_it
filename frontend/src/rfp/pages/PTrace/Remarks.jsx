import { useState, useEffect, useRef } from "react";
import { MdSend } from "react-icons/md";
import { toast } from "react-toastify";
import Service from "../../services/Service";
import { IoPersonCircleOutline } from "react-icons/io5";
import { animate, stagger } from "animejs";
import axios from "axios";

export default function Remarks({ opportunity, onDivClick }) {
  const [remarks, setRemarks] = useState("");
  const chatRef = useRef(null);
  const [empData, setEmpData] = useState({});


  const oppId = opportunity.oppId;

  // Logged-in employee info
  // const currentUser = {
  //   empName: "Raghu",
  //   empDept: "sales",
  //   empId: "9085505",
  // };

  // // const empCode= "9085492";  
  //   const empCode = localStorage.getItem('empId');


  useEffect(()=>{
    const empCode = localStorage.getItem("empId");
    axios.get(`http://43.205.24.208:9020/employee/eCode/${empCode}`).then(res=>{
      setEmpData({});
      setEmpData(res.data);
    }).catch(err=>{
      alert(err);
    })
  },[])

  
  const loggedInUserName = empData?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar;


  const handleRemarks = (e) => setRemarks(e.target.value);

  const handleSubmit = () => {
    if (!remarks.trim()) {
      toast.error("Remarks cannot be empty!");
      return;
    }

    const rfpRemarks = {
      oppId,
      remarks,
      remarksBy: loggedInUserName,
    };

    Service.addRemarks(rfpRemarks)
      .then(() => Service.getRfpByOppId(oppId))
      .then((getResponse) => {
        onDivClick(getResponse.data);
        setRemarks("");
      })
      .catch(() => toast.error("Submitting failed!"));
  };

  // Animate messages used animejs in this
  useEffect(() => {
    if (chatRef.current) {
      animate(chatRef.current.children, {
        opacity: [0, 1],
        transform: ["translateY(20px)", "translateY(0px)"],
        delay: stagger(100),
        duration: 400,
        easing: "easeOutQuad",
      });
    }
  }, [opportunity.remarks]);

  return (
    <div className="relative w-full bg-white h-[362px] rounded-md border border-gray-200 flex flex-col">
      {/* Heading */}
      <div className="bg-sky-100 rounded-t-md px-2 py-1 border-b text-sky-400 font-semibold flex items-center text-xs">
        Remarks
      </div>

      {/* Chatbox */}
      <div
        className="px-1 py-0.5 overflow-y-auto flex-1 space-y-1 mt-[2px] scroll-smooth"
        ref={chatRef}
      >
        {!opportunity.remarks || opportunity.remarks.length === 0 ? (
          <div className="text-gray-400 text-center text-sm py-6">
            No remarks added yet.
          </div>
        ) : (
          opportunity.remarks|| []).map((remark) => {
            const isCurrentUser = remark.remarksBy === loggedInUserName;

            return (
              <div
                key={remark.remarksId}
                className={`flex items-end gap-2 ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isCurrentUser && (
                  <IoPersonCircleOutline className="text-2xl text-gray-500" />
                )}

                <div
                  className={`max-w-[70%] rounded-lg py-0.5 pt-0 text-xs shadow-sm group border border-gray-200 gap-1${
                    isCurrentUser
                      ? "bg-white text-sky-500"
                      : "bg-gray-100 text-gray-800"
                  }`} 
                  
                >
                  <div className="flex items-center text-[10px] mb-0.5 justify-between ">
                    <span className="p-0.5 font-md text-black opacity-40 border-b ">
                    {remark.remarksBy}
                    </span>
                    <span
                      className="p-0.5  font-xs text-[8px] 
                      text-gray-300 cursor-pointer border-b group-hover:text-gray-500 " 
                    >
                        {`${remark.createdAt.slice(8,10)}/${remark.createdAt.slice(5,7)}/${remark.createdAt.slice(0,4)} ${remark.createdAt.slice(11,16)}`}
                    </span>

                  </div>
                  <div className="break-words px-1 tracking-wide">
                    {remark.remarks}
                  </div>
                </div>

                {isCurrentUser && (
                  <IoPersonCircleOutline className="text-2xl text-sky-400" />
                )}
              </div>
            );
          })
        }
      </div>

      {/* Input */}
      <div className="p-1 border-t flex flex-col sm:flex-row gap-1">
        <textarea
          rows="2"
          className="w-full text-sm p-1 border rounded resize-none focus:outline-none"
          placeholder="Write a remark..."
          value={remarks}
          onChange={handleRemarks}
        />
        <button
          onClick={handleSubmit}
          className="bg-sky-500 hover:bg-sky-600 text-white px-1 py-0.5 rounded text-xs flex items-center justify-center"
        >
          <MdSend className="text-3xl" />
        </button>
      </div>
    </div>
  );
}

// import { useState, useEffect, useRef } from "react";
// import { MdSend } from "react-icons/md";
// import { toast } from "react-toastify";
// import Service from "../../services/Service";
// import { IoPersonCircleOutline } from "react-icons/io5";
// import { animate, stagger } from "animejs";
// import axios from "axios";

// export default function Remarks({ opportunity, onDivClick }) {
//   const [remarks, setRemarks] = useState("");
//   const chatRef = useRef(null);
//   const [empData, setEmpData] = useState({});


//   const oppId = opportunity.oppId;

//   // Logged-in employee info
//   // const currentUser = {
//   //   empName: "Raghu",
//   //   empDept: "sales",
//   //   empId: "9085505",
//   // };

// useEffect(()=>{

//     const empCode = localStorage.getItem("empId");

//     axios.get(`http://43.205.24.208:9020/employee/eCode/${empCode}`).then(res=>{

//       setEmpData({});

//       setEmpData(res.data);

//     }).catch(err=>{

//       alert(err);

//     })

//   },[])



  

//   const loggedInUserName = empData?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar;






//   const handleRemarks = (e) => setRemarks(e.target.value);

//   const handleSubmit = () => {
//     if (!remarks.trim()) {
//       toast.error("Remarks cannot be empty!");
//       return;
//     }

//     const rfpRemarks = {
//       oppId,
//       remarks,
//       remarksBy: loggedInUserName,
//     };

//     Service.addRemarks(rfpRemarks)
//       .then(() => Service.getRfpByOppId(oppId))
//       .then((getResponse) => {
//         onDivClick(getResponse.data);
//         setRemarks("");
//       })
//       .catch(() => toast.error("Submitting failed!"));
//   };

//   // Animate messages used animejs in this
//   useEffect(() => {
//     if (chatRef.current) {
//       animate(chatRef.current.children, {
//         opacity: [0, 1],
//         transform: ["translateY(20px)", "translateY(0px)"],
//         delay: stagger(100),
//         duration: 400,
//         easing: "easeOutQuad",
//       });
//     }
//   }, [opportunity.remarks]);

//   return (
//     <div className="relative w-full bg-white h-[362px] rounded-md border border-gray-200 flex flex-col">
//       {/* Heading */}
//       <div className="bg-sky-100 rounded-t-md px-2 py-1 border-b text-sky-400 font-semibold flex items-center text-xs">
//         Remarks
//       </div>

//       {/* Chatbox */}
//       <div
//         className="px-1 py-0.5 overflow-y-auto flex-1 space-y-1 mt-[2px] scroll-smooth"
//         ref={chatRef}
//       >
//         {!opportunity.remarks || opportunity.remarks.length === 0 ? (
//           <div className="text-gray-400 text-center text-sm py-6">
//             No remarks added yet.
//           </div>
//         ) : (
//           opportunity.remarks|| []).map((remark) => {
//             const isCurrentUser = remark.remarksBy === loggedInUserName;

//             return (
//               <div
//                 key={remark.remarksId}
//                 className={`flex items-end gap-2 ${
//                   isCurrentUser ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 {!isCurrentUser && (
//                   <IoPersonCircleOutline className="text-2xl text-gray-500" />
//                 )}

//                 <div
//                   className={`max-w-[70%] rounded-lg py-0.5 pt-0 text-xs shadow-sm group border border-gray-200 gap-1${
//                     isCurrentUser
//                       ? "bg-white text-sky-500"
//                       : "bg-gray-100 text-gray-800"
//                   }`} 
                  
//                 >
//                   <div className="flex items-center text-[10px] mb-0.5 justify-between ">
//                     <span className="p-0.5 font-md text-black opacity-40 border-b ">
//                     {remark.remarksBy}
//                     </span>
//                     <span
//                       className="p-0.5  font-xs text-[8px] 
//                       text-gray-300 cursor-pointer border-b group-hover:text-gray-500 " 
//                     >
//                         {`${remark.createdAt.slice(8,10)}/${remark.createdAt.slice(5,7)}/${remark.createdAt.slice(0,4)} ${remark.createdAt.slice(11,16)}`}
//                     </span>

//                   </div>
//                   <div className="break-words px-1 tracking-wide">
//                     {remark.remarks}
//                   </div>
//                 </div>

//                 {isCurrentUser && (
//                   <IoPersonCircleOutline className="text-2xl text-sky-400" />
//                 )}
//               </div>
//             );
//           })
//         }
//       </div>

//       {/* Input */}
//       <div className="p-1 border-t flex flex-col sm:flex-row gap-1">
//         <textarea
//           rows="2"
//           className="w-full text-sm p-1 border rounded resize-none focus:outline-none"
//           placeholder="Write a remark..."
//           value={remarks}
//           onChange={handleRemarks}
//         />
//         <button
//           onClick={handleSubmit}
//           className="bg-sky-500 hover:bg-sky-600 text-white px-1 py-0.5 rounded text-xs flex items-center justify-center"
//         >
//           <MdSend className="text-3xl" />
//         </button>
//       </div>
//     </div>
//   );
// }
