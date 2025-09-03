import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { NotificationProvider } from "@/services/NotificationProvider";
import "@/index.css";
import Layout from "@/components/organisms/Layout";
import Finances from "@/components/pages/Finances";
import Dashboard from "@/components/pages/Dashboard";
import Farms from "@/components/pages/Farms";
import Weather from "@/components/pages/Weather";
import Crops from "@/components/pages/Crops";
import Tasks from "@/components/pages/Tasks";

function App() {
  return (
    <NotificationProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="farms" element={<Farms />} />
          <Route path="crops" element={<Crops />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="finances" element={<Finances />} />
          <Route path="weather" element={<Weather />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
className="z-[9999]"
      />
    </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;