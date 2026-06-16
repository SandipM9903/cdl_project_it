import { FiPlusCircle } from "react-icons/fi";
import { Box, Modal } from "@mui/material";
import { useState, useEffect } from "react";
import ClientDocumentForm from "./ClientDocumnetForm";
import RfpDocumentCard from "./RfpDocumentCard";
import Service from "../../services/Service";

export default function ClientDocument({ opportunity, onDivClick }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 6;

  const style = {
    width: "30%",
    bgcolor: "white",
    position: "relative",
    left: "40%",
    top: "5%",
    maxHeight: "80vh",
    overflowY: "auto",
  };

  useEffect(() => {
    if (opportunity?.rfpDocs) {
      
      const clientDocs = opportunity.rfpDocs.filter(doc => doc.rfpDocs?.fromClient==true);
      setDocuments(clientDocs);
      
      setLoading(false);
    }
    
  }, [opportunity]);
  
  
  const handleDownload = async (id, fileName) => {
    try {
      const res = await Service.downloadFile(id);
      const contentType = res.headers["content-type"];

      if (!res.data || res.data.byteLength === 0) {
        alert("Empty response or invalid file content");
        return;
      }

      const blob = new Blob([res.data], { type: contentType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert(`Error downloading file: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await Service.deleteFile(id);
      setDocuments(prev => prev.filter(doc => doc.opportunityRfpDocId !== id));
    } catch (error) {
      alert("Failed to delete file. Please try again.");
    }
  };

  const indexOfLastDoc = currentPage * documentsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - documentsPerPage;
  const currentDocs = documents.slice(indexOfFirstDoc, indexOfLastDoc);
  const totalPages = Math.ceil(documents.length / documentsPerPage);

  return (
    <>
      <div className="w-full bg-white rounded-md border border-gray-200 text-xs h-[220px]">
        <div className="bg-sky-100 flex justify-between rounded-t-md items-center border-b pb-1 px-2 py-1">
          <strong className="text-sky-400 font-semibold flex items-center gap-1">
            Client Docs
            <FiPlusCircle className="text-[#0ea5e9] cursor-pointer hover:text-gray-700" onClick={() => setModalOpen(true)} />
          </strong>
        </div>

        <div className="p-2">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: documentsPerPage }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-sm" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-xs text-gray-400 text-center py-6">No documents uploaded.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {currentDocs.map(doc => (
                  <RfpDocumentCard
                    key={doc.opportunityRfpDocId}
                    doc={doc}
                    onDownload={() => handleDownload(doc.opportunityRfpDocId, doc.fileName)}
                    onDelete={() => handleDelete(doc.opportunityRfpDocId)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2 text-xs">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      className={`px-2 py-1 border rounded-sm ${
                        currentPage === i + 1
                          ? "bg-sky-200 text-sky-700"
                          : "bg-white text-gray-500"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={style}>
          <ClientDocumentForm
            setModalOpen={setModalOpen}
            opportunity={opportunity}
            onDivClick={onDivClick}
          />
        </Box>
      </Modal>
    </>
  );
}
