import { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import { FiPlusCircle } from "react-icons/fi";
import DocumentTableForm from "./DocumentTableForm";
import RfpDocumentCard from "./RfpDocumentCard";
import { useUpdateRfpDocs } from "../../store/RfpStore";
import Service from "../../services/Service";

const style = {
  width: "30%",
  bgcolor: "white",
  position: "relative",
  left: "40%",
  top: "5%",
  maxHeight: "80vh",
  overflowY: "auto",
};

export default function DocumentTable({ opportunity, onDivClick }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 6;
  const { setDocsUpdateStatus } = useUpdateRfpDocs();

  useEffect(() => {
    if (opportunity?.rfpDocs) {
      console.log("rfpdocs",opportunity.rfpDocs);
      const notclientDocs = opportunity.rfpDocs.filter(doc => doc.rfpDocs?.fromClient==false);
      setDocuments(notclientDocs);
      
    }
    setLoading(false);
    
  }, [opportunity]);

  const handleOpen = async (id) => {
    const res = await Service.downloadFile(id);
    const contentType = res.headers["content-type"];
    const blob = new Blob([res.data], { type: contentType });
    const url = URL.createObjectURL(blob);  

    const win = window.open();
    win.document.write(`
      <html><body style="margin:0;overflow:hidden;">
      ${
        contentType.includes("pdf")
          ? `<embed width="100%" height="100%" src="${url}" type="application/pdf" />`
          : `<img src="${url}" style="width:100%;height:100%;" />`
      }
      </body></html>`);
  };

  const handleDownload = async (id, fileName) => {
    const res = await Service.downloadFile(id);
    const blob = new Blob([res.data], { type: res.headers["content-type"] });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    await Service.deleteFile(id);
    setDocuments(prev => prev.filter(doc => doc.opportunityRfpDocId !== id));
    setDocsUpdateStatus(true);
  };

  const indexOfLastDoc = currentPage * documentsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - documentsPerPage;
  const currentDocs = documents.slice(indexOfFirstDoc, indexOfLastDoc);
  const totalPages = Math.ceil(documents.length / documentsPerPage);

  return (
    
      <>
        <div className="w-full h-[220px] bg-white rounded-md border border-gray-200 text-xs ">
          <div className="bg-sky-100 flex justify-between rounded-t-md items-center border-b pb-1 px-2 py-1">
            <strong className="text-sky-400 font-semibold flex items-center gap-1">
              RFP Documents
              <button onClick={() => setModalOpen(true)}>
                <FiPlusCircle className="text-[#0ea5e9] text-xs hover:text-gray-700" />
              </button>
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
                      onOpen={() => handleOpen(doc.opportunityRfpDocId)}
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
            <DocumentTableForm setModalOpen={setModalOpen} opportunity={opportunity} onDivClick={onDivClick} />
          </Box>
        </Modal>
      </>
  
  );
}
