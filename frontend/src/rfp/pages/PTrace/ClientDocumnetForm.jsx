import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImAttachment } from "react-icons/im";
import { FaRegCircleXmark } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import Service from "../../services/Service";

const schema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  title: z.string().min(1, "Title is required"),
  remarks: z.string().min(1, "Remarks are required"),
  file: z
  .instanceof(File)
  .refine(
    (file) =>
      [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
      ].includes(file.type),
    {
      message: "Only PDF, image, CSV, XLSX, and PPT files are allowed",
    }
  ),

});

export default function ClientDocumentForm({
  setModalOpen,
  opportunity,
  onDivClick,
}) {
  const [fileName, setFileName] = useState("");
  const [rfpDocs, setRfpDocs] = useState([]);
  const [isVersionChecked, setIsVersionChecked] = useState(false);
  const [isVersionDisabled, setIsVersionDisabled] = useState(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    Service.getDocsClientTrue()
      .then((response) => {
        setRfpDocs(response.data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleDocumentTypeChange = (event) => {
    const selectedDocId = event.target.value;
    const selectedDoc = rfpDocs.find(
      (doc) => String(doc.rfpDocId) === selectedDocId
    );
    console.log("version",selectedDoc.version);

    if (selectedDoc && selectedDoc.version) {
      setIsVersionChecked(true);
      setIsVersionDisabled(true);
    } else {
      setIsVersionChecked(false);
      setIsVersionDisabled(false);
    }
  };

  const uploadFile = (e) => {
    const selectedFile = e.target.files[0];
    setFileName(selectedFile ? selectedFile.name : "");
    setValue("file", selectedFile);
  };

  const oppId = opportunity.oppId;

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("oppId", oppId);
    formData.append("rfpDocId", data.documentType);
    formData.append("title", data.title);
    formData.append("remarks", data.remarks);
    formData.append("file", data.file);
    formData.append("isVersion", isVersionChecked ? "true": "false");

    Service.addFormData(formData)
      .then((response) => {
        toast.success("Added doc successfully!");
        setModalOpen(false);
        return Service.getRfpByOppId(oppId);
      })
      .then((getResponse) => {
        setSelectedOpportunityId(getResponse.data.oppId);
        onDivClick(getResponse.data);
      })
      .catch(() => toast.error("Submitting form failed!"));
  };

  return (
    <>
      <div className="p-4 w-full max-w-md mx-auto bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-base font-semibold">Client Documents</h2>
          <button
            className="text-xl text-red-500"
            onClick={() => setModalOpen(false)}
          >
            <FaRegCircleXmark />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm">
          {/* Document Type */}
          <div>
            <label className="block mb-1 font-medium">Document Type</label>
            <select
              {...register("documentType")}
              onChange={handleDocumentTypeChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Doc</option>
              {rfpDocs.map((doc) => (
                <option key={doc.rfpDocId} value={doc.rfpDocId}>
                  {doc.rfpDoc}
                </option>
              ))}
            </select>
            {errors.documentType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.documentType.message}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              {...register("title")}
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Remarks */}
          <div>
            <label className="block mb-1 font-medium">Remarks</label>
            <input
              type="text"
              {...register("remarks")}
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.remarks && (
              <p className="text-red-500 text-xs mt-1">
                {errors.remarks.message}
              </p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block font-medium mb-1">Upload File</label>
            <div className="flex items-center gap-2">
              <label
                htmlFor="fileInput"
                className="cursor-pointer flex items-center gap-2 px-1 py-2 bg-gray-50 border border-gray-300 rounded-lg text-blue-600 hover:text-blue-800"
              >
                <span>Select file</span>
                <ImAttachment />
              </label>
              <input
                type="file"
                id="fileInput"
                accept=".pdf,.jpg,.jpeg,.png,.gif"
                onChange={uploadFile}
                className="hidden"
              />
            </div>
            {fileName && (
              <p className="text-sm mt-1 text-gray-600">{fileName}</p>
            )}
            {errors.file && (
              <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
            )}
          </div>

          {/* Archive Checkbox */}
          

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-2">
            <button
              type="submit"
              className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
