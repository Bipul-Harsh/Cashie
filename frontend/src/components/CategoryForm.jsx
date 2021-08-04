import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import Joi from "joi-browser";
import axios from "axios";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Swal from "sweetalert2";

function CategoryForm(props){
    let params = useParams();
    let [warnings, setWarnings] = useState("");
    const [formData, setFormData] = useState({
        name: ""
    });
    const formSchema = {
        name: Joi.string().required().max(30).min(3)
    }
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
            url: `${process.env.REACT_APP_BACKEND_API}/category/${
                service === "PUT"?params.id:""
            }`,
            data: formData,
        }).then((result)=>{
            if(result.data.status === "success"){
                Swal.fire({
                    icon:"success",
                    title:`Category has been ${service==="POST"?"Created":"Updated"}!`,
                    html:`
                    <h2>User Info</h2>
                    <hr />
                    <table class="table table-dark table-striped table-hover mt-2 rounded-custom overflow-hidden align-middle">
                        <tr>
                            <th>Category Name</th>
                            <td>:</td>
                            <td>${formData.name}</td>
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
        }).catch((error)=>{
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
        async function getCategoryData(id){
            let result = await fetch(`${process.env.REACT_APP_BACKEND_API}/category/${id}`);
            let response = await result.json();
            let data = response.data
            if(data){
                setFormData({
                    name: data.name
                });
            }
        }
        if(params.id){
            setService("PUT");
            getCategoryData(params.id);
        }
    }, [params.id]);

    return(
        <div className="row gx-0 p-3">
            <div className="d-flex justify-content-start align-items-center mt-4">
                <ArrowBackIcon onClick={()=>props.history.goBack()} className="cursor-pointer" />
                <h4 className="m-0 ms-2 fs-1">&nbsp;Form Category</h4>
            </div>
            <div className="mt-4 rounded-custom form-bg p-4">
                <form className="row gx-0" onChange={handleOnChange} onSubmit={handleOnSubmit}>
                    <div className="col-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="name">Category Name <span className="text-danger">*</span></label>
                        <input type="text" name="name" id="name" className="bg-dark text-light p-2 rounded-pill border-0 mt-1" value={formData.name} />
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

export default CategoryForm;