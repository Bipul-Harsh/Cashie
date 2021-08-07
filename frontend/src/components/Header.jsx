import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Cookies from "js-cookie";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {adminDropdownList, cashierDropdownList} from "../Data/dopdownList";


function Header(props){
    let [user, setUser] = useState({});

    useEffect(()=>{
        if(Cookies.get('user')){
            setUser(JSON.parse(Cookies.get("user")));
        }else if(localStorage.getItem("user")){
            setUser(JSON.parse(localStorage.getItem("user")));
        }
    }, [])

    function handleExit(){
        if(Cookies.get('token')){
            Cookies.remove("token");
            Cookies.remove("user");
        }
        if(localStorage.getItem("token")){
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        props.history.push("/login");
    }

    return (
        <div className="col d-flex justify-content-between align-items-center">
            <div className="navbar-brand ms-3">
                <h2 className="fs-3">Welcome, <span className="logo-font fs-3 ms-2 username">{user.fullname}</span></h2>
            </div>
            <div className="dropdown me-3">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdown-button" data-bs-toggle="dropdown" aria-expanded="false">
                    <AccountCircleIcon />
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-list rounded-3 shadow" aria-labelledby="dropdown-button">
                    {
                        user.role === 'Admin'?adminDropdownList.map((item)=>(
                            <li key={item.id}>
                                <Link to={`${props.match.path}/${item.path}`} className="dropdown-item py-2" onClick={()=>props.setSection('0')}>
                                    {item.icon} {item.name}
                                </Link>
                            </li>
                        )):cashierDropdownList.map((item)=>(
                            <li key={item.id}>
                                <Link to={`${props.match.path}/${item.path}`} className="dropdown-item py-2" onClick={()=>props.setSection("0")}>
                                    {item.icon} {item.name}
                                </Link>
                            </li>
                        ))
                    }
                    <hr className="my-1" />
                    <li>
                        <button className="dropdown-item py-2" onClick={handleExit}>
                            <ExitToAppIcon /> Exit
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Header;