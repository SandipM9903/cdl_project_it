import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DeclarationSummary from "./DeclarationSummary";
import ITAdmin from "./ITAdmin";
import IT_Declaration from "./IT_Declaration";
import IT_Declaration_Display from "./IT_Declaration_Display";
import IT_Declaration_Preview from "./IT_Declaration_Preview";
import IT_Declaration_Update from "./IT_Declaration_Update";
import NotFound from "./NotFound";
import PrivateRoutes from "./PrivateRoutes";
import Proof_Attach from "./Proof_Attach";
import Proof_Of_Investment_Update from "./Proof_Of_Investment_Update";
import Proof_of_Investment_Display from "./Proof_of_Investment_Display";
import Select_Regime from "./Select_Regime";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/admin" element={<ITAdmin />}></Route>
            <Route path="/" element={<IT_Declaration />}></Route>
            <Route
              path="/declaration-dashboard"
              element={<IT_Declaration_Display />}
            ></Route>
            <Route path="/select-regime" element={<Select_Regime />}></Route>
            <Route
              path="/declaration-summary"
              element={<DeclarationSummary />}
            ></Route>
            <Route
              path="/declaration-update"
              element={<IT_Declaration_Update />}
            ></Route>
            <Route path="/preview" element={<IT_Declaration_Preview />}></Route>
            <Route
              path="/display-proof-of-investment"
              element={<Proof_of_Investment_Display />}
            ></Route>

            <Route
              path="/proof-of-investment-update"
              element={<Proof_Attach />}
            ></Route>

            <Route
              path="/proof-of-investment-edit"
              element={<Proof_Of_Investment_Update />}
            ></Route>
          </Route>
          <Route path="/home" element={<IT_Declaration />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;