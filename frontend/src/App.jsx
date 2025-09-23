import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Wizard from "./Wizard";
import Dashboard from "./Dashboard";
import DataTable from "./DataTable";
import Admin from "./Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Wizard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/data" element={<DataTable />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
