import React, {useState, useEffect} from "react";
import Joi from "joi-browser";
import Cookies from 'js-cookie';
import Swal from "sweetalert2";
import axios from "axios";

import bgImage1 from "../assets/background1.jpg";
import bgImage2 from "../assets/background2.jpg";
import bgImage3 from "../assets/background3.jpg";
import bgImage4 from "../assets/background4.jpg";
import logo from "../assets/cashie_logo.png";

function Login(props){
    let [counter, setCount] = useState(0);
    const bgImages = [
        bgImage1,
        bgImage2,
        bgImage3,
        bgImage4
    ];
    let [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const formSchema = {
        username: Joi.string().required().max(30).min(4),
        password: Joi.string().required().max(30).min(3),
    };
    let [remember, setRemember] = useState(false);
    let [warnings, setWarnings] = useState([]);
    let [errors, setErrors] = useState([]);

    useEffect(()=>{
        const timer = setInterval(()=>{
            setCount(counter+1);
        }, 5000);

        return ()=>clearInterval(timer);
    })

    useEffect(()=>{
        async function checkStoredToken(){
            if(Cookies.get('token') || localStorage.getItem('token')){
                props.history.push("/dashboard");
            }
        }
        checkStoredToken();
    },[props.history]);


    const handleFormChange = (e)=>{
        let updatedFormData = {...formData}
        let warningBox = document.getElementById("warning-box")
        
        if(e.target.name==="username" || e.target.name==="password")
            updatedFormData[e.target.name] = e.target.value;
        else if(e.target.name==="remember"){
            setRemember(e.target.checked);
        }
        setFormData(updatedFormData);
        
        let validationReport = Joi.validate(formData, formSchema, { abortEarly:false });
        if(validationReport.error){
            setWarnings(validationReport.error.details);
        }else{
            warningBox.style.display = "none";
            setWarnings([]);
        }
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        let warningBox = document.getElementById("warning-box");

        let validationReport = Joi.validate(formData, formSchema, { abortEarly:false });
        if(validationReport.error){
            setWarnings(validationReport.error.details);
            warningBox.style.display = "block";
            return;
        }
        
        let animation = document.getElementById("loading-window")
        animation.style.display= "block";

        axios({
            method: "POST",
            url: `${process.env.REACT_APP_BACKEND_API}/auth/login`,
            data: formData,
        }).then((result)=>{
            if(result.data.status === "success"){
                if(remember){
                    localStorage.setItem("token", result.data.token);
                    localStorage.setItem("user", JSON.stringify(result.data.user));
                }
                Cookies.set("token", result.data.token, {expires: 1});
                Cookies.set("user", JSON.stringify(result.data.user, {expires: 1}));

                let successBox = document.getElementById("success-box");
                successBox.style.display = "block";
                
                props.history.push("/admin");
            }else{
                let errorBox = document.getElementById("error-box");
                errorBox.style.display = "block";
                setErrors(result.data.message);
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
        animation.style.display = "none";
    }
    
    return(
        <div id="login-window" className="container-fluid d-flex justify-content-center align-items-center" style={{backgroundImage:`url(${bgImages[counter%4]}`}}>
            <div id="loading-window" className="glassy-dark-bg">
                <lottie-player id="loading-animation" src="https://assets5.lottiefiles.com/temp/lf20_CwlzoW.json" background="transparent" speed="1" loop autoplay></lottie-player>
            </div>
            <div id="login-box" className="glassy-dark-bg border border-3 p-3 rounded-custom w-25">
                <div className="d-flex justify-content-center my-3">
                    <img src={logo} alt="logo" height="64" width="64" />
                </div>
                <h2 className="logo-font text-center mb-5">Cashie</h2>
                <form onChange={handleFormChange} onSubmit={handleSubmit} className="my-3">
                    <input className="form-control text-pale-light p-2 full-opacity-bg rounded-custom" name="username" id="username" autoComplete="username" placeholder="Username" /><br />
                    <input className="form-control text-pale-light p-2 full-opacity-bg rounded-custom" type="password" name="password" id="password" autoComplete="current-password" placeholder="Password" /><br />
                    <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" name="remember" id="remeber" />
                        <label className="form-check-label" htmlFor="remeber">Remember me</label>
                    </div>
                    <input className="btn btn-primary w-100" type="submit" value="Submit" />
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
                <div className="alert alert-success" role="alert" id="success-box" style={{display:"none"}}>Logged In!</div>
                <div id="error-box" className="alert alert-danger" style={{display:"none"}}>
                    <strong>Error Message:</strong><br />
                    {errors}
                </div>
            </div>
        </div>
    )
}

export default Login;