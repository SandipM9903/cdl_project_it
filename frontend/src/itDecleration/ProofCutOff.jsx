// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import * as React from "react";

// function ProofCutOff() {
//   const handleDateChange = (newValue) => {
//     console.log("Selected date:", newValue); // Log the selected date
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DemoContainer components={["DatePicker"]}>
//         <DatePicker
//           //   label="Basic date picker"
//           onChange={handleDateChange} // Attach the onChange handler
//           //   InputLabelProps={{
//           //     shrink: false, // Disable the shrink behavior
//           //   }}
//           sx={{
//             fontSize: "0.8rem", // Smaller font size
//             "& .MuiInputBase-root": {
//               height: "36px", // Reduced height of the input
//               overflow: "hidden",
//               width: "300px",
//             },
//             "& .MuiInputLabel-root": {
//               fontSize: "0.75rem", // Smaller label font
//               marginTop: "-5px",
//               position: "absolute", // Ensure the label stays in place
//             },
//           }}
//         />
//       </DemoContainer>
//     </LocalizationProvider>
//   );
// }

// export default ProofCutOff;

import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import { useStoreProofOfInvestmentCutOffDate } from "./useFileStore";

function ProofCutOff() {
  // const [itDate, setITDate] = useState();

  const { proofDateCutOffStorage, setProofDateCutOffStorage } =
    useStoreProofOfInvestmentCutOffDate();

  const handleDate = (date) => {
    console.log(date, "Selected Date");
    //   setITDate(date);
    setProofDateCutOffStorage(date);
  };

  return (
    <div>
      <DatePicker
        onChange={handleDate}
        value={proofDateCutOffStorage}
        className="w-[300px] h-[40px] outline-none rounded-md"
      />
    </div>
  );
}

export default ProofCutOff;
