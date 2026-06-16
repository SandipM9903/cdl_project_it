import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ToastContainer, toast } from "react-toastify";
import Service from "../../services/Service";
import { FaRegCircleXmark } from "react-icons/fa6";
const UserSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  employeeCode: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  department: z.string().nonempty({ message: "Department is required" }),
  mobileNumber: z
    .string()
    .regex(/^[0-9]{10}$/, { message: "Invalid mobile number" }),
});

export default function SpocDetailForm({
  setModalOpen,
  opportunity,
  onDivClick,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(UserSchema),
  });
  const empCode = localStorage.getItem("empId");
  const [rfpSpocs, setRfpSpocs] = useState([]);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);

  useEffect(() => {
    Service.getSpocs()
      .then((response) => {
        setRfpSpocs(response.data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const onSubmit = async (data) => {
    const formData = {
      oppId: opportunity.oppId,
      spocName: data.name,
      spocEmpId: data.employeeCode,
      spocEmail: data.email,
      spocContactNumber: data.mobileNumber,
      spocTypeId: data.department,
      createdBy: empCode
    };

    try {
      const response = await Service.addSpoc(formData);
      const { errors: responseErrors = {} } = response.data;

      const fieldMap = {
        spocName: "name",
        spocEmpId: "employeeCode",
        spocEmail: "email",
        spocContactNumber: "mobileNumber",
        spocTypeId: "department",
      };

      const fieldWithError = Object.keys(fieldMap).find(
        (key) => responseErrors[key]
      );

      if (fieldWithError) {
        setError(fieldMap[fieldWithError], {
          type: "server",
          message: responseErrors[fieldWithError],
        });
      } else {
        Service.getRfpByOppId(opportunity.oppId)
          .then((getResponse) => {
            const updatedOpportunity = getResponse.data;
            setSelectedOpportunityId(null);
            setSelectedOpportunityId(updatedOpportunity.oppId);
            onDivClick(updatedOpportunity);
            setModalOpen(false);
          })
          .catch((error) => {
            console.error("Error fetching updated opportunity:", error);
          });
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-3 text-sm space-y-4 w-full max-w-md"
      >
        <div className="flex justify-between items-center border-b pb-1 mb-2">
          <h3 className="text-base font-semibold pb-1">SPOC Details</h3>
          <button onClick={() => setModalOpen(false)} className="text-red-500 text-m">
            <FaRegCircleXmark />
          </button>
        </div>

        {/* Department */}
        <div className="grid gap-1">
          <label className="text-gray-700">Department</label>
          <select
            {...register("department")}
            className="bg-gray-100 rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Department</option>
            {rfpSpocs.map((type) => (
              <option key={type.rfpSpocId} value={type.rfpSpocId}>
                {type.spocType}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="text-xs text-red-500">{errors.department.message}</p>
          )}
        </div>

        {/* Name */}
        <div className="grid gap-1">
          <label className="text-gray-700">Name</label>
          <input
            type="text"
            {...register("name")}
            className="bg-gray-100 rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Employee Code */}
        <div className="grid gap-1">
          <label className="text-gray-700">Employee Code</label>
          <input
            type="text"
            {...register("employeeCode")}
            className="bg-gray-100 rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Email */}
        <div className="grid gap-1">
          <label className="text-gray-700">Email</label>
          <input
            type="text"
            {...register("email")}
            className="bg-gray-100 rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div className="grid gap-1">
          <label className="text-gray-700">Mobile Number</label>
          <input
            type="text"
            {...register("mobileNumber")}
            className="bg-gray-100 rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.mobileNumber && (
            <p className="text-xs text-red-500">
              {errors.mobileNumber.message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
      <ToastContainer />
    </>
  );
}
