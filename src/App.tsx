import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Setup from "./pages/trainer/Setup";
import Attendance from "./pages/trainer/Attendance";
import Report from "./pages/trainer/Report";
import TrainerStudentReport from "./pages/trainer/StudentReport";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentReport from "./pages/student/StudentReport";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trainer/setup" element={<Setup />} />
        <Route path="/trainer/attendance" element={<Attendance />} />
        <Route path="/trainer/report" element={<Report />} />
        <Route path="/trainer/report/student" element={<TrainerStudentReport />} />
        <Route path="/student" element={<StudentAttendance />} />
        <Route path="/student/report" element={<StudentReport />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
