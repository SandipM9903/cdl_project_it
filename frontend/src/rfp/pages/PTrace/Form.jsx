import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FaRegCircleXmark } from "react-icons/fa6";
import { UserSchema } from "./validationSchemas";
import Service from "../../services/Service";
import { useUpdateRfpDocs } from "../../store/RfpStore";

function Form({ setModalOpen, opportunity = null, handleRefresh, controlPlusIcon }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
    reset,
  } = useForm({
    resolver: zodResolver(UserSchema),
  });


  const [projectTypes, setProjectTypes] = useState([]);
  const [evaluationType, setEvaluationType] = useState([]);
  const [billingType, setBillingType] = useState([]);
  const [businessUnitType, setBusinessUnitType] = useState([]);
  const [leadPracticeUnit, setLeadPracticeUnit] = useState([]);
  const [customerType, setCustomerType] = useState([]);
  const [rfpProcess, setRfpProcess] = useState([]);

  useEffect(() => {
    if (
      opportunity &&
      projectTypes.length &&
      evaluationType.length &&
      billingType.length &&
      businessUnitType.length &&
      leadPracticeUnit.length &&
      customerType.length &&
      rfpProcess.length
    ) {
      reset({
        oppDate: opportunity.oppDate,
        oppShortDesc: opportunity.oppShortDesc,
        oppDesc: opportunity.oppDesc,
        oppOverview: opportunity.oppOverView,
        projectType: String(opportunity.projectTypeId).trim(),
        // estimationType: String(opportunity.estimationTypeId).trim(),
        estimationType: String(opportunity?.rfpEvalType?.evalId).trim(),
        billingType: String(opportunity.billingTypeId).trim(),
        businessUnit: String(opportunity.businessUnitId).trim(),
        // leadPractice: String(opportunity.leadPracticeId).trim(),
        leadPractice: String(opportunity?.rfpLeadPracticeUnit?.leadPracticeUnitId).trim(),
        customerName: opportunity.customerName,
        customerType: String(opportunity.customerTypeId).trim(),
        customerState: opportunity.customerState,
        customerCity: opportunity.customerCity,
        // customerBudget: opportunity.customerProjBudget,
        customerBudget: opportunity.customerProjBudget?.toString() || "",

        rfpStatus: opportunity.rfpStatus,
        rfpProcess: String(opportunity.rfpProcessId).trim(),
      });
    }
  }, [
    opportunity,
    projectTypes,
    evaluationType,
    billingType,
    businessUnitType,
    leadPracticeUnit,
    customerType,
    rfpProcess,
    reset,
  ]);

  useEffect(() => {
    Service.getProjectTypes()
      .then((response) => {
        setProjectTypes(response.data.data);
      })
      .catch((error) => console.error(error));

    Service.getEvalTypes()
      .then((response) => {
        setEvaluationType(response.data.data);
      })
      .catch((error) => console.error(error));

    Service.getBillingTypes()
      .then((response) => {
        setBillingType(response.data.data);
      })
      .catch((error) => console.error(error));

    Service.getBusinessUnits()
      .then((response) => {
        setBusinessUnitType(response.data.data);
      })
      .catch((error) => console.error(error));

    Service.getLeadPracticeUnits()
      .then((response) => {
        setLeadPracticeUnit(response.data.data);
      })
      .catch((error) => console.error(error));

    Service.getCustTypes()
      .then((response) => {
        setCustomerType(response.data.data);
      })
      .catch((error) => console.error(error));

    Service.getRfpProcess()
      .then((response) => {
        setRfpProcess(response.data.data);
      })
      .catch((error) => console.error(error));
  }, []);


  const { opportunity: updatedOpportunity } = useUpdateRfpDocs();
  const empId = localStorage.getItem("empId");


  const onSubmit = (data) => {



    if (controlPlusIcon === false) {
      data.oppId = updatedOpportunity.oppId;
    }
    data.projectTypeId = data.projectType;
    data.billingTypeId = data.billingType;
    data.businessUnitId = data.businessUnit;
    data.leadPracticeId = data.leadPractice;
    data.estimationTypeId = data.estimationType;
    data.customerTypeId = data.customerType;
    data.customerBudget = Number(data.customerBudget);
    data.rfpProcessId = data.rfpProcess;

    data.oppOverView = data.oppOverview;
    data.customerProjBudget = data.customerBudget;
    data.createdBy = empId;

    delete data.projectType;
    delete data.billingType;
    delete data.businessUnit;
    delete data.leadPractice;
    delete data.estimationType;
    delete data.customerType;
    delete data.rfpProcess;

    Service.addOpportunity(data)
      .then((response) => {
        const { errors: responseErrors = {} } = response.data;

        console.warn("now you can call//");
        // handleRefresh();

        handleRefresh?.(true);


        const fieldErrorMapping = {
          oppDate: "oppDate",
          oppDesc: "oppDesc",
          oppShortDesc: "oppShortDesc",
          oppOverview: "oppOverview",
          projectTypeId: "projectType",
          estimationTypeId: "estimationType",
          billingTypeId: "billingType",
          businessUnitId: "businessUnit",
          leadPracticeId: "leadPractice",
          customerTypeId: "customerType",
          customerState: "customerState",
          customerName: "customerName",
          customerBudget: "customerBudget",
          customerCity: "customerCity",
          rfpStatus: "rfpStatus",
          rfpProcessId: "rfpProcess",
        };

        const fieldWithError = Object.keys(fieldErrorMapping).find(
          (field) => responseErrors[field]
        );

        if (fieldWithError) {
          setError(fieldErrorMapping[fieldWithError], {
            type: "server",
            message: responseErrors[fieldWithError],
          });
          return;
        }

        setModalOpen(false);
      })
      .catch((error) => {
        alert("Submitting form failed!");
      });
  };


  const rfpStatus = ["Open", "Closed", "Hold"];

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Delhi",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full h-fit border border-gray-300 text-xs">
        {/* Header */}
        <div className="bg-sky-100 flex justify-between rounded-t-md items-center border-b-2 px-2 py-1">
          <span className="text-base font-semibold">New Opportunity</span>
          <button
            className="text-lg text-red-600"
            onClick={() => setModalOpen(false)}
          >
            <FaRegCircleXmark />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[450px] px-3 py-2 space-y-3 text-sm overflow-y-auto">

          <input type="hidden" {...register("oppId")} />

          {/* First Row: Opportunity Date & Short Desc */}
          <div className="flex flex-wrap gap-3 items-start">
            <div className="flex flex-col">
              <label htmlFor="oppDate">Date</label>
              <input
                type="date"
                id="oppDate"
                {...register("oppDate")}
                className="bg-gray-100 text-gray-500 border border-gray-400 w-36 h-8 px-2 rounded-md"
                 min={new Date().toISOString().split("T")[0]}
              />
              {errors.oppDate && (
                <p className="text-red-500 text-xs">{errors.oppDate.message}</p>
                
              )}
            </div>

            {/* Opportunity field */}
            <div className="flex flex-col flex-1">
              <label htmlFor="oppShortDesc">Opportunity</label>
              <input
                type="text"
                {...register("oppShortDesc")}
                className="bg-gray-100 border border-gray-400 h-8 px-2 rounded-md w-full"
              />
              {errors.oppShortDesc && (
                <p className="text-red-500 text-xs">{errors.oppShortDesc.message}</p>
              )}
            </div>
          </div>


          {/* Opp_desc */}
          <div className="flex flex-col">
            <label htmlFor="oppDesc">Description</label>
            <input
              type="text"
              {...register("oppDesc")}
              className="bg-gray-100 border border-gray-400 w-full h-10 px-2 rounded-md"
            />
            {errors.oppDesc && (
              <p className="text-red-500 text-xs">{errors.oppDesc.message}</p>
            )}
          </div>

          {/* Dropdowns Row (Project Type, Eval, Billing, BU, Lead Practice) */}
          <div className="flex flex-wrap gap-2 mt-1">
            {[

              {
                label: "Project type", field: "projectType", options: projectTypes, valueKey: "projectTypeId", labelKey: "projectType"
              }, {
                label: "Eval type", field: "estimationType", options: evaluationType, valueKey: "evalId", labelKey: "evalType"
              }, {
                label: "Billing type", field: "billingType", options: billingType, valueKey: "billingTypeId", labelKey: "billingType"
              }, {
                label: "Business unit", field: "businessUnit", options: businessUnitType, valueKey: "businessUnitId", labelKey: "businessUnit"
              }, {
                label: "Lead practice", field: "leadPractice", options: leadPracticeUnit, valueKey: "leadPracticeUnitId", labelKey: "leadPracticeUnit"
              }
            ].map((dropdown, idx) => (
                <div key={idx} className="flex flex-col">
                  <label>{dropdown.label}</label>
                  <select
                    {...register(dropdown.field)}
                    className="border border-gray-400 bg-gray-100 text-gray-500 w-25 h-7 px-1 rounded-md hover:shadow-sm"
                  >
                    <option value="">Select {dropdown.label.split(" ")[0]}</option>
                    {dropdown.options.map((opt) => (
                      <option key={opt[dropdown.valueKey]} value={opt[dropdown.valueKey]}>
                        {opt[dropdown.labelKey]}
                      </option>
                    ))}
                  </select>
                  {errors[dropdown.field] && (
                    <p className="text-red-500 text-xs">{errors[dropdown.field].message}</p>
                  )}
                </div>
              ))}
          </div>

          {/* Opportunity Overview */}
          <div className="flex flex-col">
            <label>Overview</label>
            <textarea
              {...register("oppOverview")}
              rows="3"
              className="border border-gray-400 rounded-md bg-gray-100 w-full px-2 py-1"
            />
            {errors.oppOverview && (
              <p className="text-red-500 text-xs">{errors.oppOverview.message}</p>
            )}
          </div>

          {/* Customer Details */}
          <div className="bg-sky-200 p-3 rounded-md">
            <span className="font-medium text-sm">Customer Details</span>
            <div className="flex flex-wrap gap-4 mt-2 justify-between">
              <div className="flex flex-col">
                <label>Name</label>
                <input
                  type="text"
                  {...register("customerName")}
                  className="border border-gray-400 w-[400px] h-9 px-2 rounded-md bg-sky-70"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-xs">{errors.customerName.message}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label>Type</label>
                <select
                  {...register("customerType")}
                  className="border border-gray-400 bg-sky-70 text-gray-500 w-36 h-9 px-2 bg-white rounded-md"
                >
                  <option value="">Select CT</option>
                  {customerType.map((type) => (
                    <option key={type.custTypeId} value={type.custTypeId}>
                      {type.custType}
                    </option>
                  ))}
                </select>
                {errors.customerType && (
                  <p className="text-red-500 text-xs">{errors.customerType.message}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label>State</label>
                <select
                  {...register("customerState")}
                  className="border border-gray-400 text-gray-500 w-36 h-9 px-2 bg-sky-70 rounded-md"
                >
                  <option value="">Select State</option>
                  {states.map((state, i) => (
                    <option key={i} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.customerState && (
                  <p className="text-red-500 text-xs">{errors.customerState.message}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label>City</label>
                <input
                  type="text"
                  {...register("customerCity")}
                  className="border border-gray-400 w-36 h-9 px-2 rounded-md bg-sky-70"
                />
                {errors.customerCity && (
                  <p className="text-red-500 text-xs">{errors.customerCity.message}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label>Budget</label>
                {/* <input
                  type="text"
                  {...register("customerBudget")}
                  defaultValue={
                    opportunity?.budget
                      ? opportunity.budget.toString()
                      : ""
                  }
                  className="border border-gray-400 w-36 h-9 px-2 rounded-md bg-sky-70"
                /> */}
                <input
                  type="text"
                  {...register("customerBudget")}
                  className="border border-gray-400 w-36 h-9 px-2 rounded-md bg-sky-70"
                />

                {errors.customerBudget && (
                  <p className="text-red-500 text-xs">{errors.customerBudget.message}</p>
                )}
              </div>

            </div>

          </div>

          {/* RFP Status & Process */}
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex flex-col">
              <label>RFP Status</label>
              <select
                {...register("rfpStatus")}
                className="border border-gray-400 text-gray-500 w-36 h-9 px-2 bg-gray-100 rounded-md"
              >
                <option value="">Select Status</option>
                {rfpStatus.map((status, i) => (
                  <option key={i} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.rfpStatus && (
                <p className="text-red-500 text-xs">{errors.rfpStatus.message}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label>RFP Process</label>
              <select
                {...register("rfpProcess")}
                className="border border-gray-400 text-gray-500 w-40 h-9 px-2 bg-gray-100 rounded-md"
              >
                <option value="">Select RFP Process</option>
                {rfpProcess.map((proc) => (
                  <option key={proc.processId} value={proc.processId}>
                    {proc.rfpProcess}
                  </option>
                ))}
              </select>
              {errors.rfpProcess && (
                <p className="text-red-500 text-xs">{errors.rfpProcess.message}</p>
              )}
            </div>
          </div>

          {/* Submit + Cancel */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="submit"
              className="bg-sky-400 hover:bg-sky-600 text-sky-50 px-4 py-2 rounded-md"
            // onClick={handleRefresh}
            >
              Submit
            </button>
            <button
              type="button"
              className="bg-gray-200 hover:bg-cyan-400 text-black px-4 py-2 rounded-md"
              onClick={() => { setModalOpen(false) }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Form;
