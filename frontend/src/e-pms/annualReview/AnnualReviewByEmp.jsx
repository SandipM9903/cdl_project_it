// annualReviewEmp.jsx
import React, { useEffect, useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Service from "../Service";

function AnnualReviewByEmp() {
  const [rows, setRows] = useState(1);
  const [mgrAnnRevValues, setMgrAnnRevValues] = useState([]);
  const [empAnnRevValues, setEmpAnnRevValues] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [icon, setIcon] = useState();

  const [popoverVisible1, setPopoverVisible1] = useState(false);
  const [popoverVisible2, setPopoverVisible2] = useState(false);

  const handleSubmit = () => {
    Service.postByAnnRevEmp(empAnnRevValues).then((response) => {
      setEmpAnnRevValues(response.data);

      Service.getByAnnualEmpById().then((response) =>
        setEmpAnnRevValues(response.data)
      );
    });

    setSubmitted("You have filled annual review.");
    setIcon(<IoMdCheckmarkCircleOutline />);
    setPopoverVisible1(false);
    setPopoverVisible2(false);
  };

  // const handleSubmit = () => {
  //   Service.postByAnnRevEmp(empAnnRevValues).then((response) =>
  //     console.log("employeeComment", response.data)
  //   );
  // };

  // console.log(empAnnRevValues, "employeeComment+++++++++++++++++++++++++++++");

  const handleAnnRevValueChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setEmpAnnRevValues({ ...empAnnRevValues, [key]: value });
  };
  console.log(empAnnRevValues, "empAnnRevValues");

  const handleSaveAsDraft = () => {
    setPopoverVisible1(false);
    setPopoverVisible2(false);
  };

  // Assuming you want this effect to run only once on component mount

  console.warn(empAnnRevValues, "empAnnRevValues");
  console.log(empAnnRevValues, "empAnnRevValues");

  useEffect(() => {
    Service.getByAnnualEmpById()
      .then((response) => setMgrAnnRevValues(response.data))
      .catch((err) => console.log(err));
  }, []);

  console.warn(mgrAnnRevValues, "mgrAnnRevValues");

  return (
    <div className="w-full h-screen bg-gray-200">
      <div className="bg-white top-2 pb-24">
        <div className="flex space-x-[500px] pt-6">
          <div className="flex space-x-2 text-green-500 items-center text-sm">
            <h1 className="text-sm">{icon}</h1>
            <h1 className="">{submitted} </h1>
          </div>
        </div>

        {/* Adding one seprating line according to the figma design */}

        <h1 className="border-b-[1px] border-gray-300 ml-4 mr-4"> </h1>

        <h2 className="text-sm font-normal text-black pl-6 pt-6">
          Manager Feedback
        </h2>

        {/* NOW CREATING THE GRID AND TEXT AREAS FOR THE COMMENTS AND THYE ANNUAL REVIEW */}

        <div className="container">
          {[...Array(rows)].map((_, index) => (
            <div className="grid grid-cols-10 ml-5">
              <div className="col-span-2 mt-5 ">
                <div className="pl-4 text-gray-600 space-y-16 ml-2">
                  <h2 className={`text-sm pt-2 ${index !== 0 && "hidden"}`}>
                    Manager Rating
                  </h2>
                  <h2 className={`text-sm pt-1.5 ${index !== 0 && "hidden"}`}>
                    Manager Comment
                  </h2>
                  <h2
                    className={`text-sm pt-[320px] ${index !== 0 && "hidden"}`}
                  >
                    Area of imporvement
                  </h2>
                  <h2 className={`text-sm pt-16 ${index !== 0 && "hidden"}`}>
                    Strength
                  </h2>
                </div>
              </div>

              <div className="col-span-6  mt-5  space-y-6 -ml-14">
                {/* <h2 className={`text-sm ${index !== 0 && 'hidden'}`}>Manager Comment</h2> */}
                <textarea
                  type="text"
                  placeholder=""
                  className=" placeholder-gray-400 overflow-hidden resize-none w-[23%] h-[60px] font-extralight text-normal text-gray-600 -ml-0 pt-2 border-[1px] border-gray-300 p-1 mt-3 cursor-not-allowed outline-none"
                  value={mgrAnnRevValues.ratings}
                  readOnly
                />
                <textarea
                  type="text"
                  placeholder=""
                  className=" placeholder-gray-400 overflow-hidden resize-none w-[78%] h-[375px] font-extralight text-normal text-gray-600 -ml-0 pt-2 border-[1px] border-gray-300 p-1 mt-3 cursor-not-allowed outline-none"
                  value={mgrAnnRevValues.managerComment}
                  readOnly
                />
                <textarea
                  type="text"
                  placeholder=""
                  className=" placeholder-gray-400 overflow-hidden resize-none w-[78%] h-[120px] font-extralight text-normal text-gray-600 -ml-0 pt-2 border-[1px] border-gray-300 p-1 mt-3 cursor-not-allowed outline-none"
                  value={mgrAnnRevValues.areaOfImprovement}
                  readOnly
                />
                <textarea
                  type="text"
                  placeholder=""
                  className=" placeholder-gray-400 overflow-hidden resize-none w-[78%] h-[120px] font-extralight text-normal text-gray-600 -ml-0 pt-2 border-[1px] border-gray-300 p-1 mt-3 cursor-not-allowed outline-none"
                  value={mgrAnnRevValues.appraiseeStrength}
                  readOnly
                />
              </div>

              <div className="col-span-2 mt-5">
                <ul className="pr-4 ml-4 mb-12 -mt-8 space-y-2 text-m font-medium">
                  <li className="text-green-400">5 - Outstanding</li>
                  <li className="text-blue-400">4 - Above Plan</li>
                  <li className="text-blue-900">3 - Meets Expectations</li>
                  <li className="text-yellow-400">2 - Below Plan</li>
                  <li className="text-red-500">1 - Unsatisfactory</li>
                </ul>
              </div>
            </div>
          ))}
        </div>

        <h1 className="border-b-[1px] border-gray-300 ml-4 mr-4 pt-12"> </h1>

        <div className="">
          <h2 className="text-sm font-normal text-black pl-6 pt-10">
            Employee Feedback
          </h2>
          <h2 className="text-sm font-normal text-gray-600 pl-6 pt-10 ml-5">
            Employee Comment
          </h2>

          <textarea
            type="text"
            placeholder="Enter here"
            className=" placeholder-gray-400 overflow-hidden resize-none w-[49%] h-[120px] font-extralight text-normal text-gray-600 ml-52 pt-2 border-[1px] border-gray-300 p-1 -mt-5"
            onChange={handleAnnRevValueChange}
            value={empAnnRevValues.appraiseComment}
          />
        </div>

        {/* NOW THE SUBMIT, DRAFT AND CANCEL BUTTONS */}
        <div className="grid grid-cols-3 ml-[700px] mt-24 ">
          <div className="col-span-1">
            <div className="relative">
              <button
                className="border-2 border-white bg-blue-500 text-white  rounded-md hover:bg-gray-500 w-[100px] h-11 font-medium"
                onClick={handleSubmit}
                onMouseMove={() => setPopoverVisible1(true)}
                onMouseOut={() => {
                  setPopoverVisible1(false);
                }}
                onBlur={() => {
                  setPopoverVisible1(false);
                }}
              >
                Submit
              </button>
              {popoverVisible1 && (
                <div className="absolute top-[calc(100%+10px)] left-0 bg-gray-200 p-2 rounded-md shadow-md font-extralight pl-2">
                  {/* Your popover content goes here */}
                  <p className="space-x-4">Once submitted cannot edit</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1">
            <div className="relative">
              <button
                className="border-2 border-white bg-gray-500 text-white w-[100px] h-11 rounded-md hover:bg-blue-500 -ml-24 font-medium"
                onClick={handleSaveAsDraft}
                onMouseMove={() => setPopoverVisible2(true)}
                onMouseOut={() => setPopoverVisible2(false)}
                onBlur={() => {
                  setPopoverVisible1(false);
                }}
              >
                Save as Draft
              </button>
              {popoverVisible2 && (
                <div className="absolute top-[calc(100%+10px)] left-0 bg-gray-200 p-2 rounded-md shadow-md font-extralight">
                  {/* Your popover content goes here */}
                  <p>You can edit it later</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1 ">
            <button className="border-2 border-white bg-black text-white rounded-md w-[100px] h-11 -ml-48 font-medium">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnualReviewByEmp;
