import React, {useState, useEffect} from "react";
import Joi from "joi-browser";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";

function Setting(props){
    let [formData, setFormData] = useState({
        name:"",
        discount:0,
        tax:0
    });
    const formSchema = {
        name: Joi.string().required().max(30).min(3),
        discount: Joi.number().required().max(100).min(0),
        tax: Joi.number().required().max(100).min(0)
    }
    const [warnings, setWarnings] = useState([]);

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

        let id = '';
        let user = null;
        if(Cookies.get("user")){
            user = JSON.parse(Cookies.get('user'));
            id = user._id;
        }else if(localStorage.getItem('user')){
            user = JSON.parse(localStorage.getItem("user"));
            id = user._id;
        }

        axios({
            method: "PUT",
            url: `${process.env.REACT_APP_BACKEND_API}/setting/${id}`,
            data: formData,
        }).then((result)=>{
            if(result.data.status === "success"){
                Swal.fire({
                    icon: "success",
                    title: "Settings Updated Successfully!"
                });
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
        async function getValues(){
            let result = await fetch(`${process.env.REACT_APP_BACKEND_API}/setting`);
            let response = await result.json();
            if(response.data){
                setFormData({
                    name: response.data.name,
                    discount: response.data.discount,
                    tax: response.data.tax
                });
            }
        }
        getValues();
    }, [])

    return(
        <div className="row p-3 gx-0">
            <div className="mt-4 d-flex justify-content-start">
                <h4 className="fs-1">Update Store Setting</h4>
            </div>
            <div className="mt-4 rounded-custom p-4 form-bg">
                <form className="row gx-0" onChange={handleOnChange} onSubmit={handleOnSubmit}>
                    <div className="col-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="name">Store Name <span className="text-danger">*</span></label>
                        <input type="text" name="name" id="name" value={formData.name} className="bg-dark text-light p-2 rounded-pill border-0 mt-1" />
                    </div>
                    <div className="col-6 col-xs-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="discount">Discount (%) <span className="text-danger">*</span></label>
                        <input type="number" name="discount" id="discount" value={formData.discount} className="bg-dark text-light p-2 rounded-pill border-0 mt-1" />
                    </div>
                    <div className="col-6 col-xs-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="tax">Tax (%) <span className="text-danger">*</span></label>
                        <input type="number" name="tax" id="tax" value={formData.tax} className="bg-dark text-light p-2 rounded-pill border-0 mt-1" />
                    </div>
                    <div className="col-12 row gx-0 justify-content-center mt-4">
                        <button type="submit" className="btn btn-theme-linear text-light">Submit</button>
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

export default Setting;