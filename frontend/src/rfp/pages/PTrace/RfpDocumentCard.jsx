  import { FaRegEye } from "react-icons/fa";
  import { LiaDownloadSolid } from "react-icons/lia";
  import { MdDelete } from "react-icons/md";
  import Tooltip from "@mui/material/Tooltip";

  export default function RfpDocumentCard({ doc, onOpen, onDownload, onDelete }) {
    const fileExt = doc.fileType?.toLowerCase();
    const truncatedName = doc.fileName.length > 10 ? `${doc.fileName.slice(0, 10)}..` : doc.fileName;

    const fileColorMap = {
      pdf: "bg-red-100 text-red-500",
      png: "bg-sky-100 text-sky-500",
      jpeg: "bg-sky-100 text-sky-500",
      jpg: "bg-sky-100 text-sky-500",
      doc: "bg-green-100 text-green-500",
      docx: "bg-green-100 text-green-500",
    };

    const badgeStyle = fileColorMap[fileExt] || "bg-gray-200 text-gray-600";

    return (
      <Tooltip title={`Uploaded by ${doc.createdBy || "Unknown"}`}>
        <div className="bg-white border border-gray-200 rounded-sm p-2 flex flex-col justify-between shadow-sm hover:shadow-md transition group min-h-[75px] relative z-40">
          {/* Top bar with file badge and overlapping container */}
          <div className="flex items-center justify-between text-xs relative h-4">
            {/* File Type */}
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${badgeStyle}`}>
              {fileExt}
            </span>

            {/* Date & Actions container one over another */}
            <div className="relative w-[60px] h-4 overflow-hidden">
              {/* Date before hover */}
              <span className="absolute inset-0 flex items-center justify-end text-[10px] text-gray-400 opacity-100 group-hover:opacity-0 transition-opacity duration-100 ease-in-out">
                {doc.createdAt?.slice(0, 10)}
              </span>

              {/* Action container: (on hover) */}
              <div className="absolute inset-0 flex items-center justify-between 
            gap-2 px-1 opacity-0 group-hover:opacity-100 
      transition-all duration-300 ease-in-out 
      group-hover:translate-y-0 translate-y-1 
      group-hover:scale-100 scale-[0.95] 
      backdrop-blur-sm bg-white/80 rounded-md">
                {onOpen && (
                  <FaRegEye onClick={onOpen} className="cursor-pointer hover:text-sky-500" />
                )}
                <LiaDownloadSolid onClick={onDownload} className="cursor-pointer hover:text-green-500" />
                {onDelete && (
                  <MdDelete onClick={onDelete} className="cursor-pointer hover:text-red-500" />
                )}
              </div>
            </div>
          </div>

          {/* File Name */}
          <div className="mt-2 text-[11px] font-medium text-gray-800 truncate" title={doc.fileName}>
            {doc.title}
          </div>
        </div>
      </Tooltip>
    );
  }
