import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PrivateRouteAdmin from "./PrivateRouteAdmin";
import Dashboard from "../Dashboard";
import Home from "../Home";
import Login from "../Login";
import Logout from "../Logout";
import Admin from "../SuperAdmin"
const Routing = ({user, admin}) => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/zootopia' element={<Admin admin={admin} />} />
            <Route path='/login' element={<Login user={user} />} />
            <Route element={<PrivateRoute user={user} />}>
                <Route path='/dashboard/*' element={<Dashboard />} />
            </Route>
            <Route element={<PrivateRouteAdmin admin={admin} />}>
                <Route path='/dashboard/*' element={<Dashboard />} />
            </Route>

            <Route element={<PrivateRoute user={user} />}>
                <Route path='/logout' element={<Logout />} />
            </Route>
            <Route element={<PrivateRouteAdmin admin={admin} />}>
                <Route path='/logout' element={<Logout />} />
            </Route>
        </Routes>
    );
};

export default Routing;
