
import { useState } from "react";
import Header from "../components/Header";

function OrganizationStructure() {
  const [toggleBusiness, setToggleBusiness] = useState(false);
  const handleBusiness = () => {
    setToggleBusiness(!toggleBusiness);
  };

  const [togglePresales, setTogglePresales] = useState(false);
  const handlePresales = () => {
    setTogglePresales(!togglePresales);
  };

  const [businessFunction, setBusinessFunction] = useState(false);
  const handleFunction = () => {
    setBusinessFunction(!businessFunction);
  };
  const [treeData, setTreeData] = useState({
    id: 1,
    // name: "AARTI GROVER",
    title: "Chairperson",
    // image: "./cropped_image.png",
    children: [
      {
        id: 2,
        // name: "ANIL MENON",
        // empCode: "9070698",
        title: "Chief Executive Officer",
        // image: "./cropped_image (1).png",
      },
    ],
  });
  return (
    <>
      <Header />
      <div className="p-10 min-h-[calc(100vh-64px)] mt-24">
        {/* Top-Level Hierarchy */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            {/* Chairperson */}
            <div className="flex flex-col items-center bg-neutral-600 p-2 whitespace-nowrap">
              {/* <img src={treeData.image} alt="Chairperson" className="w-24 h-24 rounded-full object-cover border-4 border-gray-900" /> */}
              <p className="font-semibold mt-2">{treeData.name}</p>
              <p className="text-sm text-white">{treeData.title}</p>
            </div>

            {/* Vertical line */}
            <div className="w-0.5 h-8 bg-gray-900"></div>

            {/* CEO */}
            <div className="flex flex-col items-center bg-neutral-600 p-2 whitespace-nowrap">
              {/* <img src={treeData.children[0].image} alt="CEO" className="w-24 h-24 rounded-full object-cover border-4 border-gray-900" /> */}
              <p className="font-semibold mt-2">{treeData.children[0].name}</p>
              <p className="text-sm text-white">{treeData.children[0].title}</p>
            </div>

            {/* Connecting line to management */}
            <div className="w-0.5 h-8 bg-gray-900"></div>
          </div>
        </div>

        <div className="px-[165px] ">
          <div className="div">
            <div className="border-b-2 border-b-gray-900"></div>
          </div>

          <div className="hover:cursor-pointer ">
            <div className="grid grid-cols-4 gap-[312px]">
              <div
                className="flex flex-col items-center  font-semibold"
                onClick={handleBusiness}
              >
                <div className="w-0.5 h-10 bg-gray-900"></div>
                <p className="bg-red-800 p-2 whitespace-nowrap text-sm text-white ">
                  BUSINESS
                </p>
              </div>

              <div className="flex flex-col items-center hover:cursor-not-allowed  font-semibold">
                <div className="w-0.5 h-10 bg-gray-900"></div>
                <p className="bg-red-800 p-2 whitespace-nowrap text-sm text-white bg-red-800">
                  CMS TRAFFIC LTD.
                </p>
              </div>

              <div
                className="flex flex-col items-center mr-6 hover:cursor-pointer  font-semibold"
                onClick={handleFunction}
              >
                <div className="w-0.5 h-10 bg-gray-900"></div>

                <div className="flex flex-row items-center">
                  {businessFunction ? (
                    <div className="w-8 h-0.5 bg-gray-900 ml-[78px]"></div>
                  ) : (
                    ""
                  )}
                  <p className="bg-red-800 p-2 whitespace-nowrap text-sm text-white bg-red-800">
                    BUSINESS FUNCTIONS
                  </p>
                </div>
              </div>
             
              <div
                className="hover:cursor-pointer  font-semibold"
                onClick={handlePresales}
              >
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-10 bg-gray-900"></div>

                  <div className="flex flex-row items-center">
                    {togglePresales ? (
                      <div className="w-2 h-0.5 bg-gray-900 ml-[10px]"></div>
                    ) : (
                      ""
                    )}

                    <p className="bg-red-800 p-2 whitespace-nowrap text-sm text-white bg-red-800">
                      PRACTICES
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <div className="grid grid-cols-3 gap-5">
            <div className="col pl-2 ">
              {toggleBusiness ? (
                <>
                  <div className="flex flex-col items-center">
                    <div className="w-[20px]">
                      <div className="w-0.5 h-10 bg-gray-900 -ml-8"></div>
                    </div>
                  </div>

                  <div className="ml-20">
                    <div className="border-b-2 border-b-gray-900 w-[467px]"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-20">
                    <div className="col-span-1">
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 h-10 bg-gray-900"></div>

                        <div className="flex flex-row items-start">
                          <div className="w-0.5  h-[320px] bg-gray-900 mt-[27px]">
                            {" "}
                          </div>

                          <div className="">
                            <div className="flex flex-row items-center">
                              <div className="w-10  h-0.5 bg-gray-900"></div>
                              <div className="bg-neutral-400 p-2 text-sm">
                                <p>GOVT. SOLUTIONS </p>
                                <p className="text-center">DIVISION</p>
                              </div>
                            </div>

                            <div className="flex flex-row items-center my-2">
                              <div className="w-10  h-0.5 bg-gray-900"></div>
                              <div className="bg-neutral-600 p-2 text-sm w-full ">
                                <p className="text-center text-white whitespace-nowrap text-s">
                                  SALES
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-row items-center my-2">
                              <div className="w-10  h-0.5 bg-gray-900"></div>
                              <div className="bg-neutral-600 p-2 text-sm w-full ">
                                <p className="text-center text-white whitespace-nowrap text-s">
                                  PRE SALES
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-row items-center my-2">
                              <div className="w-10  h-0.5 bg-gray-900"></div>
                              <div className="bg-neutral-600 p-2 text-sm w-full ">
                                <p className="text-center text-white whitespace-nowrap text-s">
                                  SOLUTIONS
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-row items-center my-2">
                              <div className="w-10  h-0.5 bg-gray-900"></div>
                              <div className="bg-neutral-600 p-2 text-sm w-full ">
                                <p className="text-center text-white whitespace-nowrap text-s">
                                  STRATEGIC INITIATIVES
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-row items-center my-2">
                              <div className="w-10  h-0.5 bg-gray-900"></div>
                              <div className="bg-neutral-600 p-2 text-sm w-full ">
                                <p className="text-center text-white whitespace-nowrap text-s">
                                  DELIVERY AND SUPPORT
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-row items-center my-2">
                              <div className="w-10  h-0.5 bg-gray-900"></div>
                              <div className="bg-neutral-600 p-2 text-sm w-full ">
                                <p className="text-center text-white whitespace-nowrap text-s">
                                  STRATEGIC SUPPORT
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-row items-center my-2">
                              <div className="w-10  h-0.5 bg-gray-900"></div>
                              <div className="bg-neutral-600 p-2 text-sm w-full ">
                                <p className="text-center text-white whitespace-nowrap text-s">
                                  OPERATIONS
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 ">
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 h-1 bg-gray-900 "></div>
                        <div className="w-0.5 h-10 bg-gray-900"></div>

                        <div className="flex flex-row items-start">
                          <div className="w-0.5  h-[276px] bg-gray-900 mt-[27px] ">
                            {" "}
                          </div>

                          <div className="">
                            <div className="flex flex-row items-center">
                              <div className="w-10  h-0.5 bg-gray-900"></div>
                              <div className="bg-neutral-400 p-2 text-sm">
                                <p className="text-center">BUSINESS</p>
                                <div className="text-center">
                                  <p>SOLUTIONS DIVISION</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-row items-center my-2">
                              <div className="w-10  h-0.5 bg-gray-900"></div>
                              <div className="bg-neutral-600 p-2 text-sm w-full ">
                                <p className="text-center text-white whitespace-nowrap text-s">
                                  SALES
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-row items-center my-2">
                              <div className="w-10  h-0.5 bg-gray-900"></div>
                              <div className="bg-neutral-600 p-2 text-sm w-full ">
                                <p className="text-center text-white whitespace-nowrap text-s">
                                  DELIVERY & SUPPORT
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-row items-center my-2">
                              <div className="w-10  h-0.5 bg-gray-900"></div>
                              <div className="bg-neutral-600 p-2 text-sm w-full ">
                                <p className="text-center text-white whitespace-nowrap text-s">
                                  PRODUCT & DEVELOPMENT
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-row items-center my-2">
                              <div className="w-10  h-0.5 bg-gray-900"></div>
                              <div className="bg-neutral-600 p-2 text-sm w-full ">
                                <p className="text-center text-white whitespace-nowrap text-s">
                                  SMART CITIES & PORTS
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-row items-center my-2">
                              <div className="w-10  h-0.5 bg-gray-900"></div>
                              <div className="bg-neutral-600 p-2 text-sm w-full ">
                                <p className="text-center text-white whitespace-nowrap text-sm">
                                  INDUSTRY SOLUTIONS
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-row items-center my-2">
                              <div className="w-10  h-0.5 bg-gray-900"></div>
                              <div className="bg-neutral-600 p-2 text-sm w-full ">
                                <p className="text-center text-white whitespace-nowrap text-s">
                                  OPERATIONS
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>

            {toggleBusiness ? (
              <>
                <div className="bg-neutral-400 p-2 text-sm   mt-20 h-10 absolute z-50 right-[652px]">
                  <div className="flex flex-col items-center">
                    <div className="flex justify-center items-center -mt-[47px]">
                      <div className="w-0.5 h-[45px] bg-gray-900"></div>
                    </div>
                    <p className="text-center whitespace-nowrap text-sm">
                      ENTERPRISE SALES DIVISION
                    </p>
                  </div>

                  <div className="flex flex-col items-center ">
                    <div className="flex justify-center items-center ">
                      <div className="w-0.5 h-[45px] bg-gray-900"></div>
                    </div>
                    <p className="text-center whitespace-nowrap bg-neutral-600  p-2 text-sm text-white">
                      SALES
                    </p>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}

            {businessFunction ? (
              <div className="col -mt-[19px] ml-[300px]">
                <div className="flex">
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 bg-gray-900 h-[551px]" />
                  </div>

                  <div className="mt-10">
                    {/* <div className="flex flex-row items-center absolute z-50 mb-20">
                      <div className="flex flex-row items-center my-2">
                        <div className="w-10 h-0.5 bg-gray-900"></div>
                        <div className="bg-neutral-600 p-2 text-sm w-full">
                          <p className="text-center text-white whitespace-nowrap test-xm">
                            FINANCE & ACCOUNTS
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-row items-center">
                        <div className="flex flex-row items-center">
                          <div className="w-10 h-0.5 bg-gray-900"></div>
                          <div className="bg-neutral-600 p-2 text-sm w-full">
                            <p className="text-center text-white">AUDIT</p>
                          </div>
                        </div>

                        <div className="w-10 h-0.5 bg-gray-900"></div>
                        <div className="bg-neutral-600 p-2 text-sm w-full">
                          <p className="text-center text-white">TREASURY</p>
                        </div>

                        <div className="w-10 h-0.5 bg-gray-900"></div>
                        <div className="bg-neutral-600 p-2 text-sm w-full">
                          <p className="text-center text-white text-sm">
                            TAXATION
                          </p>
                        </div>
                      </div>
                    </div> */}

                    <div className="flex flex-row items-center my-2">
                      <div className="w-10 h-0.5 bg-gray-900"></div>
                      <div className="bg-neutral-600 p-2 text-sm w-full">
                        <p className="text-center text-white whitespace-nowrap text-sm ">
                          FINANCE & ACCOUNTS
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center my-2">
                      <div className="w-10 h-0.5 bg-gray-900"></div>
                      <div className="bg-neutral-600 p-2 text-sm w-full">
                        <p className="text-center text-white whitespace-nowrap text-sm ">
                          HUMAN RESOURCE & ADMINISTRATION
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center my-2">
                      <div className="w-10 h-0.5 bg-gray-900"></div>
                      <div className="bg-neutral-600 p-2 text-sm w-full">
                        <p className="text-center text-white">COMMERCIAL</p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center my-2">
                      <div className="w-10 h-0.5 bg-gray-900"></div>
                      <div className="bg-neutral-600 p-2 text-sm w-full">
                        <p className="text-center text-white">
                          MARKETING & COMMUNICATION
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center my-2">
                      <div className="w-10 h-0.5 bg-gray-900"></div>
                      <div className="bg-neutral-600 p-2 text-sm w-full">
                        <p className="text-center text-white">
                          ALLIANCE & ECO SYSTEM
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center ">
                      <div className="w-10 h-0.5 bg-gray-900"></div>
                      <div className="bg-neutral-600 p-2 text-sm w-full">
                        <p className="text-center text-white">PMO</p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center my-2">
                      <div className="w-10 h-0.5 bg-gray-900"></div>
                      <div className="bg-neutral-600 p-2 text-sm w-full">
                        <p className="text-center text-white">PURCHASE</p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center my-2">
                      <div className="w-10 h-0.5 bg-gray-900"></div>
                      <div className="bg-neutral-600 p-2 text-sm w-full">
                        <p className="text-center text-white">OEG & STORES</p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center my-2">
                      <div className="w-10 h-0.5 bg-gray-900"></div>
                      <div className="bg-neutral-600 p-2 text-sm w-full">
                        <p className="text-center text-white">CS & LEGAL</p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center my-2">
                      <div className="w-10 h-0.5 bg-gray-900"></div>
                      <div className="bg-neutral-600 p-2 text-sm w-full">
                        <p className="text-center text-white">QUALITY</p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center my-2">
                      <div className="w-10 h-0.5 bg-gray-900"></div>
                      <div className="bg-neutral-600 p-2 text-sm w-full">
                        <p className="text-center text-white">INTERNAL IT</p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center my-2">
                      <div className="w-10 h-0.5 bg-gray-900"></div>
                      <div className="bg-neutral-600 p-2 text-sm w-full">
                        <p className="text-center text-white">INTERNAL AUDIT</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            {businessFunction === false && togglePresales === true ? (
              <div className="col"></div>
            ) : (
              ""
            )}

            <div className="col -mt-[18px] ">
              {togglePresales ? (
                <div className="flex">
                  <div className="flex flex-col items-center">
                    {/* <div className="w-0.5 bg-gray-900 h-full" /> */}
                    <div className="w-0.5 bg-gray-900 h-[175px] ml-[200px]" />
                  </div>

                  <div className="mt-10">
                    <div className="flex flex-row items-center my-2">
                      <div className="w-10 h-0.5 bg-gray-900"></div>
                      <div className="bg-neutral-600 p-2 text-sm w-full">
                        <p className="text-center text-white">DIGITAL</p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center my-2">
                      <div className="w-10 h-0.5 bg-gray-900"></div>
                      <div className="bg-neutral-600 p-2 text-sm w-full">
                        <p className="text-center text-white">
                          SOFTWARE SOLUTION DIVISION
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center my-2">
                      <div className="w-10 h-0.5 bg-gray-900"></div>
                      <div className="bg-neutral-600 p-2 text-sm w-full">
                        <p className="text-center text-white">
                          IT INFRA SERVICES
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrganizationStructure;
