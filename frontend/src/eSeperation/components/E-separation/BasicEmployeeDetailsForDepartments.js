import React from 'react';
import { FaRegCircleXmark } from 'react-icons/fa6';

function BasicEmployeeDetailsForDepartments({ selectedEmployee, onClose }) {

    const formatDate = (dateString) => {
        if (!dateString || isNaN(new Date(dateString).getTime())) return '-';
        const d = new Date(dateString);
        return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${d.getFullYear()}`;
    };

    return (
        // <div className="container mx-auto h-[650px] px-4">


        <div className="bg-white  rounded-xl p-6 border">
            <div className="p-3 text-right">
                <button className="text-red-500 text-xl" onClick={onClose}>
                    <FaRegCircleXmark />
                </button>
            </div>
            {/* Header - Photo + Name */}
            <div className="text-center mb-6">
                {selectedEmployee?.fileAndContentTypeBean?.file ? (
                    <img
                        src={`data:${selectedEmployee?.fileAndContentTypeBean?.contentType};base64,${selectedEmployee?.fileAndContentTypeBean?.file}`}
                        className="rounded-full h-20 w-20 mx-auto shadow-md"
                        alt="Profile"
                    />
                ) : (
                    <img
                        src="/profile.jpg"
                        className="rounded-full h-20 w-20 mx-auto shadow-md"
                        alt="Default Profile"
                    />
                )}

                <h1 className="text-2xl font-semibold mt-3 text-gray-800">
                    {selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar || '-'}
                </h1>
                <p className="text-gray-500 text-sm">
                    {selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.designation || '-'}
                </p>
            </div>

            {/* Divider */}
            <div className="border-b my-4"></div>

            {/* Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">

                {/* Column 1 */}
                <div className="space-y-5">
                    <div>
                        <p className="text-gray-500">Employee Code</p>
                        <p className="text-blue-900 font-medium">
                            {selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.empCode || '-'}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Department</p>
                        <p className="text-blue-900 font-medium">
                            {selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.mainDeptResDTO?.mainDepartment || '-'}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Reporting To</p>
                        <p className="text-blue-900 font-medium">
                            {selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.reportingManager || '-'}
                        </p>
                    </div>


                </div>

                {/* Column 2 */}
                <div className="space-y-5">

                    <div>
                        <p className="text-gray-500">Email</p>
                        <p className="text-blue-900 font-medium break-words">
                            {selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.emailId || '-'}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500">Project Name</p>
                        <p className="text-blue-900 font-medium">
                        {selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.projectResDTO?.projectName || '-'}
                        </p>
                    </div>
                   
                    <div>
                        <p className="text-gray-500">Reporting Manager ECode</p>
                        <p className="text-blue-900 font-medium">
                            {selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.reportTo|| '-'}
                        </p>
                    </div>
                    
                </div>

                {/* Column 3 */}
                <div className="space-y-5">


                    <div>
                        <p className="text-gray-500">Designation</p>
                        <p className="text-blue-900 font-medium">
                            {selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.designationResDTO?.designationName || '-'}
                        </p>
                    </div>
                     <div>
                        <p className="text-gray-500">Location</p>
                        <p className="text-blue-900 font-medium">
                            {selectedEmployee?.userDTO?.locationResDTO?.locationName || '-'}
                        </p>
                    </div>
                    
                    <div>
                        <p className="text-gray-500">Joining Date</p>
                        <p className="text-blue-900 font-medium">
                            {formatDate(selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.dateOfJoining)}
                        </p>
                    </div>
                </div>

            </div>



        </div>

    );
}

export default BasicEmployeeDetailsForDepartments;
