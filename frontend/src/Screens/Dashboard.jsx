import React, {useState, useEffect} from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Dashboard(props){
    const [section, setSection] = useState('1');

    //Checking on direct call
    useEffect(()=>{
        async function searchToken(){
            if(!Cookies.get('token') && !localStorage.getItem('token')){
                props.history.push("/login");
            }
        }
        searchToken();
    }, [props.history]);

    return(
        <div className="main-window container-fluid">
            <div className="row h-100">
                <div className="sidebar col-2 gx-0 d-flex align-items-center flex-column py-3">
                    <Sidebar id={section} setSection={setSection} {...props} />
                </div>
                <div className="col main-display container-fluid gx-0">
                    <nav className="navbar fixed-navbar navbar-dark bg-dark row gx-0">

                    </nav>
                </div>
            </div>            
        </div>
    )
}

export default Dashboard;