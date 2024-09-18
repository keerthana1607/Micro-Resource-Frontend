import React from 'react'

import HeroHome from './HeroHome';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import Card from './Card';
import Login from './Login';
import AdminHome from './Admin/AdminHome';
import Projects from './ProjectManager/Projects';
import EmployeeTable from './Admin/EmployeeList';
import EmployeeHome from './Employee/EmployeeHome';
import Ad from './Admin/Ad';
import ProjectManagerDashboard from './ProjectManager/ProjectDashboard';
import ProjectmanagerHome from './ProjectManager/ProjectmanagerHome';
import ProjectTable from './ProjectManager/ProjectCard';
import ViewProjects from './Admin/ViewProjects';
import HomeEmp from './HomeEmp';
import EmpProjects from './Employee/EmpProjects'
import EmpTaskView from './Employee/EmpTaskView';
import EmpWorkload from './Employee/EmpWorkload';
import ProjectManagerList from './Admin/ProjectManagerList';
import TrackProjects from './ProjectManager/TrackProjects';
import ProjectsTracking from './Admin/ProjectsTracking';
import EditProfilePage from './ProjectManager/EditManager';
import EmployeeProfile from './Employee/EmployeeProfile';
import Mail from './Admin/Mail';

const AppPath = () => {
  return (
    <Router>
             
    <Routes>
    <Route exact path="/" element={<HeroHome />}></Route>
    <Route exact path="/card" element={<Card />}></Route>
    <Route exact path="/login" element={<Login />}></Route>
    {/* <Route exact path="/adminhome" element={<Ad />}></Route> */}
    <Route exact path="/admin" element={<AdminHome />}></Route>
    {/* <Route exact path="/projects" element={<Projects />}></Route> */}
    <Route path="/employeeslist" element={<EmployeeTable />} />
    <Route path="/managerlist" element={<ProjectManagerList />} />
    <Route path="/employeehome" element={<HomeEmp />} />
    <Route path="/adminhome" element={<Navigate to="/admin" />} />
    <Route path="/view-projects" element={<ProjectTable />} />
    <Route exact path="/manager" element={<ProjectmanagerHome />}></Route>
    <Route path="/managerhome" element={<Navigate to="/manager" />} />
    <Route path="/projects" element={<ViewProjects />} />
    <Route path="/viewempProjects" element={<EmpProjects />} />
    <Route path="/empviewtask/:projectId" element={<EmpTaskView />} />
    <Route path="/workload" element={<EmpWorkload />} />
    <Route path="/track-project" element={<TrackProjects />} />
    <Route path="/projecttracking" element={<ProjectsTracking />} />
    <Route path="/editmanager" element={<EditProfilePage />} />
    <Route path="/userprofile" element={<EmployeeProfile />} />
    <Route path="/notifications" element={<Mail />} />
    </Routes>
            </Router>
  )
}

export default AppPath
