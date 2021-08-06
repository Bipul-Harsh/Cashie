import React, {useState, useEffect} from "react";
import Cookies from "js-cookie";
import { Switch, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import User from "../components/User";
import UserForm from "../components/UserForm";
import Setting from "../components/Setting";
import Account from "../components/Account";
import Category from "../components/Category";
import CategoryForm from "../components/CategoryForm";
import Product from "../components/Product";
import ProductForm from "../components/ProductForm";
import Transaction from "../components/Transaction";
import Report from "../components/Report";
import Home from "../components/Home";

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
                        <Route exact path={`${props.match.path}/`} component={Home} />
                        <Route exact path={`${props.match.path}/user`} component={User} />
                        <Route exact path={`${props.match.path}/user/create`} component={UserForm} />
                        <Route exact path={`${props.match.path}/user/update/:id`} component={UserForm} />
                        <Route exact path={`${props.match.path}/setting`} component={Setting} />
                        <Route exact path={`${props.match.path}/account`} component={Account} />
                        <Route exact path={`${props.match.path}/category`} component={Category} />
                        <Route exact path={`${props.match.path}/category/create`} component={CategoryForm} />
                        <Route exact path={`${props.match.path}/category/update/:id`} component={CategoryForm} />
                        <Route exact path={`${props.match.path}/product`} component={Product} />
                        <Route exact path={`${props.match.path}/product/create`} component={ProductForm} />
                        <Route exact path={`${props.match.path}/product/update/:id`} component={ProductForm} />
                        <Route exact path={`${props.match.path}/transaction`} component={Transaction} />
                        <Route exact path={`${props.match.path}/report`} component={Report} />
                    </Switch>
                </div>
            </div>            
        </div>
    )
}

export default Dashboard;