import React, { useState, useEffect } from 'react';
import './WorkflowStatusTracker.css';
import axios from 'axios';
import { useLocation, useNavigate, useNavigation } from 'react-router-dom';

import { FaRegCircleXmark } from "react-icons/fa6";
import Header from '../../components/Header';
import { BASE_URL } from '../../config/Config';


export const WorkflowStatusTracker = () => {
  const [treeData, setTreeData] = useState([]);
  const [itemStatusInfo, setItemStatusInfo] = useState([]);
  const [mainStatus, setMainStatus] = useState("");
  const navigate = useNavigate();
  const workflowName = sessionStorage.getItem("workflowName");
  // const wfSeqId = sessionStorage.getItem("wfSeqId");
  const empCode = localStorage.getItem("empId")

  const location = useLocation();
  const {wfSeqId} = location?.state || {}

  function closeDetails(){
    navigate('/ExitForm')
  }

  useEffect(() => {
  
     
    const loadDataFromBackend = async() => {
      try {
        
        if (workflowName) {
         
          console.log("setvalue:-" + workflowName);
          console.log("wfseqid====",wfSeqId);
          //const response = await ExitService.loadData(workflowName,empCode);
          // Fetching data from the backend
      const response = await axios.get(
        `${BASE_URL}:9028/api/workflow/loadData/${workflowName}/${empCode}/${wfSeqId}`
      );
          const data = response?.data || {};
          console.log("Data received from the backend:", data);

          const setArray = data.setArray || [];
          const listArray = data.listArray || [];
          const stageArray = data.stageArray || [];
          const itemStatusInfo = data["itemstatusinfoObj"] || [];
        setItemStatusInfo(itemStatusInfo);
          const addedNodes = {};
          const setNodes = [];

          setArray.forEach((setItem) => {
            const setChildren = [];

            for (let i = 1; i <= 10; i++) {
              const wfListNameProperty = "wfListName" + i;
              const wfListPrevProperty = "wfListPrev" + i;

              if (setItem[wfListNameProperty] && setItem[wfListNameProperty].trim() !== "") {
                const listName = setItem[wfListNameProperty];

                if (!addedNodes[listName]) {
                  addedNodes[listName] = true;

                  const listNode = {
                    text: setItem[wfListNameProperty],
                    li_attr: {
                      Type: "list",
                      description: setItem[wfListPrevProperty]
                    },
                    children: []
                  };

                  listArray.forEach((listItem) => {
                    if (listItem.wfListName === setItem[wfListNameProperty]) {
                      for (let j = 1; j <= 10; j++) {
                        const wfStageNameProperty = "wfStageName" + j;
                        const wfStagePrevProperty = "wfStagePrev" + j;

                        if (listItem[wfStageNameProperty] && listItem[wfStageNameProperty].trim() !== "") {
                          const stageName = listItem[wfStageNameProperty];

                          if (!addedNodes[stageName]) {
                            addedNodes[stageName] = true;

                            const stageNode = {
                              text: listItem[wfStageNameProperty],
                              li_attr: {
                                Type: "stage",
                                description: listItem[wfStagePrevProperty]
                              },
                              children: []
                            };

                            stageArray.forEach((stageItem) => {
                              if (stageItem.wfStageName === listItem[wfStageNameProperty]) {
                                for (let k = 1; k <= 10; k++) {
                                  const wfLevelNameProperty = "wfLevelName" + k;
                                  const wfLevelPrevProperty = "wfLevelPrev" + k;

                                  if (stageItem[wfLevelNameProperty] && stageItem[wfLevelNameProperty].trim() !== "") {
                                    const levelName = stageItem[wfLevelNameProperty];

                                    if (!addedNodes[levelName]) {
                                      addedNodes[levelName] = true;

                                      const levelNode = {
                                        text: stageItem[wfLevelNameProperty],
                                        li_attr: {
                                          Type: "level",
                                          description: stageItem[wfLevelPrevProperty]
                                        },
                                        children: []
                                      };
                                  

                                      stageNode.children.push(levelNode);
                                    }
                                  }
                                }
                              }
                            });

                            listNode.children.push(stageNode);
                          }
                        }
                      }
                    }
                  });

                  setChildren.push(listNode);
                }
              }
            }

            setNodes.push(...setChildren);
          });

          setTreeData(setNodes);
        }
      } catch (error) {
        console.error('Failed to load tree data:', error);
      }
    };

    loadDataFromBackend();
  }, [workflowName, wfSeqId]);

  useEffect(() => {
    // Fetch status when component mounts
    if (empCode && workflowName) {
      //ExitService.getMainStatusToCheckUserExistsOrNot(empCode, workflowName)
      axios.get(`${BASE_URL}:9028/api/workflow/getMainStatusToCheckUserExistsOrNot/${empCode}/${workflowName}`)
        .then((response) => {
          console.log("StatusResponse::::::", response.data);
          setMainStatus(response.data);
        })
        .catch(error => console.log(error));
    }
  }, [empCode, workflowName]);

  // Function to get node color based on WFItemStatusInfo
  const getNodeColor = (nodeText) => {
    const statusInfo = itemStatusInfo.find(
      (info) => info.wfItemName === nodeText
    );
    if (statusInfo) {
      switch (statusInfo.status) {
        case "Approved":
          return "#0BDA51"; // Light green
        case "Rejected":
          return "#F44336"; // Light red
        case "Pending":
          return "yellow"; // Light yellow
        default:
          return ""; // Default color
      }
    }
    
    return ""; // No status info found, return default color
  };
  if (mainStatus !== "Pending" && mainStatus !== "Approved") {
    return (
      <div className="text-center bg-blue-500 text-white p-4">
        Your resignation is not submitted yet.
      </div>
    );
  }

  console.log("treeData>>>>", JSON.stringify(treeData));

  const renderNodeContent = (node) => {
    const nodeColor = getNodeColor(node.text);

    switch (node.li_attr.Type) {
      case "list":
        return (
          <tr>
            <td className="p-2 py-3 text-center font-extrabold text-sm">
              <button
                style={{ backgroundColor: nodeColor }}
                className=" w-36 mr-2 py-1 rounded-lg hover:bg-gray-200 focus:outline-none shadow-lg transform transition-transform hover:scale-110"
              >
                {node.text}
              </button>
            </td>
          </tr>
        );
      case "stage":
        return (
          <td colSpan="2" className="p-2 " style={{ verticalAlign: "top" }}>
            <div className="flex items-center font-semibold">
              <img
                src={require("../Images/RightWF.png")}
                alt=""
                className="w-12 h-8 inline-block align-middle"
              />
              &nbsp;&nbsp;
              <button
                style={{ backgroundColor: nodeColor }}
                className=" w-36 mr-2 py-1 rounded-lg hover:bg-gray-200 focus:outline-none shadow-lg transform transition-transform hover:scale-110"
              >
                {node.text}
              </button>
            </div>
            {/* <br /> */}
            {node.children &&
              node.children.map((child, childIndex) => (
                <React.Fragment key={childIndex}>
                  <tr>
                    <td
                      colSpan="3"
                      className="pt-0 flex items-center justify-center"
                    >
                      <img
                        src={require("../Images/DownWF.png")}
                        alt=""
                        className="w-8 h-8 inline-block align-middle ml-12"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="pl-14 font-semibold">
                      <button
                        style={{ backgroundColor: getNodeColor(child.text) }}
                        className="w-36 mr-2 py-1 rounded-lg hover:bg-gray-200 focus:outline-none shadow-lg transform transition-transform hover:scale-110"
                      >
                        {child.text}
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            <br />
          </td>
        );
      default:
        return null;
    }
  };
  let roles = [];
  try {
    roles = JSON.parse(sessionStorage.getItem('role')) || [];
  } catch (e) {
    console.error('Error parsing roles from sessionStorage:', e);
  }

  // Function to check if the user has a specific role
  const hasRole = (role) => roles.includes(role);
  return (
    <div className="">
<Header/>
      <div className=" mt-20 bg-white">

      <div className='container mx-auto'>
<div className=" fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-70 flex justify-center items-center">
    <div className="w-[50%] h-[90%] left-20 bg-white relative overflow-y-auto z-200">
    <><div className="flex justify-between"> {/* Updated div */}
      <div>
      <button className="text-red-500 text-xl" 
      onClick={closeDetails}
      >
          <FaRegCircleXmark />
        </button>
       </div>
       <h1 className='ml-44 text-base font-semibold mb-2'>Workflow Status Tracker</h1>
      <div className="border border-gray-800 p-1 rounded h-30 w-48 mt-8"> {/* Color legend */}
        <h2 className="text-base font-semibold mb-2">Color Legend</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-800">Rejected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-300 rounded-full mr-2"></div>
            <span className="text-sm text-gray-800">Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-800">Approved</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-stone-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-800">Hold</span>
          </div>
        </div>
      </div>
    </div>
    <div className="overflow-auto"> {/* Table container */}
    <h1 className='ml-36 text-sm font-semibold '>
  Workflow/Department <span className="mx-6">
    <img src={require("../Images/RightWF.png")} alt="arrow" className="w-12 h-8 inline-block align-middle" />
  </span> 
  Stage 
  <span className="block mt-2 ml-[262px] font-semibold ">
    <img src={require("../Images/DownWF.png")} alt="arrow" className="w-8 h-8 " />
  </span>
<span className="block mt-2 ml-[260px] font-semibold">Level</span>
  
</h1>

<hr className="my-2 border-gray-400" />


        <table className="flex justify-center">
          <tbody>
            {treeData.map((node, index) => (
              <tr key={index}>
                {renderNodeContent(node)}
                {node.children &&
                  node.children.map((childNode, childIndex) => (
                    <React.Fragment key={childIndex}>
                      {renderNodeContent(childNode)}
                    </React.Fragment>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
        
      </div></>
      </div>
      </div>
  </div>
      </div>
     </div>
  );
};

export default WorkflowStatusTracker;;
