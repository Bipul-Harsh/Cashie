import React, {useState, useEffect} from "react";
import Cookies from "js-cookie";
import { Switch, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import User from "../components/User";
import UserForm from "../components/UserForm";

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
            <div className="row h-100 overflow-auto">
                <div className="sidebar col-2 gx-0"></div>
                <div className="sidebar col-2 gx-0 d-flex align-items-center flex-column py-3 h-100 position-fixed">
                    <Sidebar id={section} setSection={setSection} {...props} />
                </div>
                <div className="col main-display container-fluid gx-0 overflow-auto">
                    <nav className="navbar fixed-navbar navbar-dark bg-dark row gx-0">
                        <div className="dummy-space col-2 gx-0"></div>
                        <Header setSection={setSection} {...props} />
                    </nav>
                    <div className="dummy-height"></div>
                    <Switch>
                        <Route exact path={`${props.match.path}/user`} component={User} />
                        <Route exact path={`${props.match.path}/user/create`} component={UserForm} />
                        <Route exact path={`${props.match.path}/user/update/:id`} component={UserForm} />
                    </Switch>
                </div>
            </div>            
        </div>
    )
}

export default Dashboard;