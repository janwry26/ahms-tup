
// export default Dashboard

import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "../scenes/global/Topbar";
import Sidebar from "../scenes/global/Sidebar";
import Panel from "../scenes/panel";
import Team from "../scenes/team";
import Contacts from "../scenes/contacts";
import Bar from "../scenes/bar";
import Form from "../scenes/form";
import AdminForm from "../scenes/adminForm";
import Line from "../scenes/line";
import Pie from "../scenes/pie";
import Geography from "../scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import Calendar from "../scenes/calendar/calendar";
import Task from "../scenes/task";
import Inventory from "../scenes/inventory"
import Observation from "../scenes/observationReport"
import Mortality from "../scenes/mortalityReport"
import AnimalRecords from "../scenes/animalRecords";
import MedicalHistory from "../scenes/medicalHistory"
function DashboardMain() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
            <Route path="/" element={<Panel />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/form" element={<Form />} />
            <Route path="/adminForm" element={<AdminForm />} />
            <Route path="/team" element={<Team />} />
            <Route path="/line" element={<Line />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/bar" element={<Bar />} />
            <Route path="/pie" element={<Pie />} />
            <Route path="/geography" element={<Geography />} />
            <Route path="/task" element={<Task />} />
            <Route path="/inventory1" element={<Inventory />} />
            <Route path="/observation" element={<Observation />} />
            <Route path="/mortality" element={<Mortality />} />
            <Route path="/animal" element={<AnimalRecords />} />
            <Route path="/medical" element={<MedicalHistory />} />

            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default DashboardMain;