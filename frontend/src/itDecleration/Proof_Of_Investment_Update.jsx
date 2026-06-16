import { Box, Checkbox, Modal } from "@mui/material";
import { useState } from "react";
import { ImCancelCircle } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import Proof_Attach_Display from "./Proof_Attach_Display";
import Service from "./Service";
import {
  useFileStore,
  useStoreFinancialYear,
  useStoreSubmitStatusRedirect,
} from "./useFileStore";

function Proof_Of_Investment_Update() {
  const empCode = localStorage.getItem("empId");
  const { submitFinancialYear } = useStoreFinancialYear();
  const [open, setOpen] = useState(false);
  const { regime } = useFileStore();
  const { setSaveStatus } = useStoreSubmitStatusRedirect();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const handleChanges = (event) => {
    setChecked(event.target.checked);
  };

  const setSaveStatus80Function = () => {
    Service.setStatusForProofOfInvestment(
      empCode,
      submitFinancialYear,
      false
    ).then((res) => {
      setSubmitStatusForProofOfInvestment();
    });
  };

  const setSubmitStatusForProofOfInvestment = () => {
    Service.setSubmitStatusForProofOfInvestment(
      empCode,
      submitFinancialYear,
      false
    ).then((res) => {
      setSaveStatus("true");
      navigate("/display-proof-of-investment", { state: { data: "revise" } });
    });
  };

  const handlePOIUpdate = () => {
    setSaveStatus80Function();
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", md: 800 },
    bgcolor: "white",
    border: "2px solid #000",
    boxShadow: 25,
    p: 2,
    height: { xs: 420, md: 320 },
    maxHeight: "90vh",
    overflow: "auto",
  };

  return (
    <div className="px-2">
      <Proof_Attach_Display />
    </div>
  );
}

export default Proof_Of_Investment_Update;
