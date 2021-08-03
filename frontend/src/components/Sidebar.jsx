import React, {useState, useEffect, Fragment} from "react";
import {Link} from "react-router-dom";
import { adminList, cashierList } from "../Data/sectionList";
import Cookies from "js-cookie";
import logo from "../assets/cashie_logo.png";

function Sidebar(props){
    const [userRole, setUserRole] = useState("")

    useEffect(()=>{
        if(Cookies.get('user'))
            setUserRole(JSON.parse(Cookies.get("user")).role)
        else if(localStorage.getItem("user"))
            setUserRole(JSON.parse(localStorage.getItem("user")).role)
    }, []);

    return(
        <Fragment>
            <img src={logo} alt="Logo" width="80%" className="mt-5 mb-4" />
            { userRole === "Admin" ? adminList.map(section => (
                <Link to={`${props.match.path}/${section.page}`} onClick={()=>props.setSection(section.id)} className={"text-decoration-none my-2 text-light sidebar-button w-80 rounded-custom-15 overflow-hidden"} key={section.id}>
                    <div className={`d-flex flex-column align-items-center p-1 ${props.id === section.id ? "btn-theme" : ""}`}>
                        <h4 className="mb-1">{section.icon}</h4>
                        <h6 className="sidebar-text">{section.label}</h6>
                    </div>
                </Link>
            )) : cashierList.map(section => (
                <Link to={`${props.match.path}/${section.page}`} onClick={()=>{props.setSection(section.id)}} className={"text-decoration-none my-2 text-light sidebar-section w-80 rounded-custom-15 overflow-hidden"} key={section.id}>
                    <div className={`d-flex flex-column align-items-center p-1 ${props.id === section.id ? "btn-theme" : ""}`}>
                        <h4 className="mb-1">{section.icon}</h4>
                        <h6 className="sidebar-text">{section.label}</h6>
                    </div>
                </Link>
            ))
            }
        </Fragment>
    );
}

export default Sidebar;