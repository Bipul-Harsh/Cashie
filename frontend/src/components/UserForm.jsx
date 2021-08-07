import React, {useState, useEffect} from "react";
import Joi from "joi-browser";
import Swal from "sweetalert2";
import axios from "axios";
import { useParams } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

function UserForm(props){
    const params = useParams();
    let [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        password: "",
        role: "Cashier",
    })
    const formSchema = {
        fullname: Joi.string().required().max(30).min(6),
        username: Joi.string().required().max(30).min(3),
        password: Joi.string().required().max(30).min(8),
        email: Joi.string().email().required().max(30).min(7),
        role: Joi.string().required()
    }
    const [warnings, setWarnings] = useState([]);
    const [service, setService] = useState("POST");

    function handleOnChange(event){
        let warningBox = document.getElementById("warning-box")
        let newFormData = {...formData};
        newFormData[event.target.name] = event.target.value;
        setFormData(newFormData);

        let validationReport = Joi.validate(formData, formSchema, { abortEarly:false });
        if(validationReport.error){
            setWarnings(validationReport.error.details);
        }else{
            warningBox.style.display = "none";
            setWarnings([]);
        }
    }

    function handleOnSubmit(event){
        event.preventDefault();
        let warningBox = document.getElementById("warning-box");

        let validationReport = Joi.validate(formData, formSchema, { abortEarly:false });
        if(validationReport.error){
            setWarnings(validationReport.error.details);
            warningBox.style.display = "block";
            return;
        }
        axios({
            method: service,
            url: `${process.env.REACT_APP_BACKEND_API}/user/${service==="PUT"?props.match.params.id:""}`,
            data: formData,
        }).then((result)=>{
            if(result.data.status === "success"){
                Swal.fire({
                    icon:"success",
                    title:`User has been ${service==="POST"?"Created":"Updated"}!`,
                    html:`
                    <h2>User Info</h2>
                    <hr />
                    <table class="table table-dark table-striped table-hover mt-2 rounded-custom overflow-hidden align-middle">
                        <tr>
                            <th>Full Name</th>
                            <td>:</td>
                            <td>${formData.fullname}</td>
                        </tr>
                        <tr>
                            <th>Username</th>
                            <td>:</td>
                            <td>${formData.username}</td>
                        </tr>
                        <tr>
                            <th>Role</th>
                            <td>:</td>
                            <td>
                                <span class=${`rounded-pill p-1 border ${formData.role==="Admin"?"border-danger text-theme":"border-info text-info"}`}>
                                    ${formData.role==="Admin"?"Admin":"Cashier"}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>:</td>
                            <td>${formData.email}</td>
                        </tr>
                    </table>
                    `
                })
                props.history.goBack();
            }else{
                Swal.fire({
                    title: "<strong>Oops! Something Went Wrong</strong>",
                    icon: "error",
                    html:`
                    <div class="alert alert-danger">
                        <strong>Error Message:</strong><br />
                        ${`
                            <ul class="mt-2">
                                ${
                                    result.data.message.errors.map((error)=>(`
                                        <li class="text-start">
                                            ${error.msg}
                                        </li>
                                    `))
                                }
                            </ul>
                        `}
                    </div>
                    `
                })
            }
        })
        .catch((error)=>{
            Swal.fire({
                title: "<strong>Oops! Something Went Wrong</strong>",
                icon: "error",
                html: `
                    <div class="alert alert-danger">
                        <strong>Error Message:</strong><br />
                        ${error.message}
                    </div>
                `
            })
        })
    }

    useEffect(()=>{
        async function getUserData(id){
            let result = await fetch(`${process.env.REACT_APP_BACKEND_API}/user/${id}`);
            let response = await result.json();
            let data = response.data
            if(data){
                setFormData({
                    fullname: data.fullname,
                    username: data.username,
                    email: data.email,
                    role: data.role,
                    password: ''
                });
            }
        }
        if(params.id){
            setService("PUT");
            getUserData(params.id);
        }
    }, [params.id]);

    return(
        <div className="row p-3 gx-0">
            <div className="d-flex justify-content-start align-items-center mt-4">
                <ArrowBackIcon onClick={()=>props.history.goBack()} className="cursor-pointer" />
                <h4 className="m-0 ms-2 fs-1">&nbsp;Form User</h4>
            </div>
            <div className="mt-4 rounded-custom form-bg p-4">
                <form className="row gx-0" onChange={handleOnChange} onSubmit={handleOnSubmit}>
                    <div className="col-6 col-xs-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="fullname">Full Name <span className="text-danger">*</span></label>
                        <input type="text" name="fullname" id="fullname" className="bg-dark text-light p-2 rounded-pill border-0 mt-1" value={formData.fullname} />
                    </div>
                    <div className="col-6 col-xs-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="username">Username <span className="text-danger">*</span></label>
                        <input type="text" name="username" id="username" className="bg-dark text-light p-2 rounded-pill border-0 mt-1" value={formData.username} />
                    </div>
                    <div className="col-6 col-xs-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="email">Email <span className="text-danger">*</span></label>
                        <input type="email" name="email" id="email" className="bg-dark text-light p-2 rounded-pill border-0 mt-1" value={formData.email} />
                    </div>
                    <div className="col-6 col-xs-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="password">Password <span className="text-danger">*</span></label>
                        <input type="password" name="password" id="password" className="bg-dark text-light p-2 rounded-pill border-0 mt-1" value={formData.password} />
                    </div>
                    <div className="col-6 col-xs-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="role">Role</label>
                        <select name="role" id="role" className="bg-dark text-light p-2 rounded-pill border-0 mt-1" value={formData.role} >
                            <option value="Cashier">Cashier</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="col-12 row gx-0 justify-content-center mt-4">
                        <button type="submit" className="btn btn-theme-linear text-light">{params.id?"Update":"Create"}</button>
                    </div>
                </form>
                <div id="warning-box" className="alert alert-warning mt-4" role="alert" style={{display:"none"}}>
                    <strong>{warnings.length===1?"Warning":"Warnings"} </strong><br />
                    <ul>
                        {
                            warnings.length > 0 && warnings.map((warning)=>(
                                <li className="mt-1" key={warning.message}>{warning.message}</li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default UserForm;