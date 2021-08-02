import React, {useState, useEffect} from "react";
import Joi from "joi-browser";
import Swal from "sweetalert2";
import axios from "axios";
import { useParams } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";


function UserForm(props){

    function handleOnChange(event){

    }

    return(
        <div className="row p-3 gx-0">
            <div className="d-flex justify-content-start align-items-center mt-4">
                <ArrowBackIcon onClick={()=>props.history.goBack()} className="cursor-pointer" />
                <h4 className="m-0 ms-2 fs-1">&nbsp;Form User</h4>
            </div>
            <div className="mt-4 rounded-custom form-bg p-4">
                <form className="row gx-0" onChange={handleOnChange}>
                    <div className="col-6 col-xs-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="fullname">Full Name</label>
                        <input type="text" name="fullname" id="fullname" className="bg-dark text-light p-2 rounded-pill border-0 mt-1" />
                    </div>
                    <div className="col-6 col-xs-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" id="username" className="bg-dark text-light p-2 rounded-pill border-0 mt-1" />
                    </div>
                    <div className="col-6 col-xs-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" className="bg-dark text-light p-2 rounded-pill border-0 mt-1" />
                    </div>
                    <div className="col-6 col-xs-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" className="bg-dark text-light p-2 rounded-pill border-0 mt-1" />
                    </div>
                    <div className="col-6 col-xs-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="role">Role</label>
                        <select name="role" id="role" className="bg-dark text-light p-2 rounded-pill border-0 mt-1" >
                            <option value="Cashier">Cashier</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="col-12 row gx-0 justify-content-center mt-4">
                        <button type="submit" className="btn btn-theme-linear text-light">Submit</button>
                    </div>
                </form>
                
            </div>
        </div>
    )
}

export default UserForm;