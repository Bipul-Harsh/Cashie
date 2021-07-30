import React, {useState, useEffect} from "react";
import Joi from "joi-browser";
import Cookies from 'js-cookie';

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

    useEffect(()=>{
        const timer = setInterval(()=>{
            setCount(counter+1);
        }, 5000);

        return ()=>clearInterval(timer);
    })

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [errors, setErrors] = useState([]);
    const formSchema = {
        username: Joi.string().required().max(30).min(4),
        password: Joi.string().required().max(30).min(3),
    };
    const [remember, setRemember] = useState(false);

    const handleFormChange = (e)=>{
        let updatedFormData = {...formData}
        if(e.target.name==="username" || e.target.name==="password")
            updatedFormData[e.target.name] = e.target.value;
        else if(e.target.name==="remember")
            setRemember(e.target.checked);
        
        setFormData(updatedFormData);
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        let validationReport = Joi.validate(formData, formSchema);
        if(validationReport.error){
            setErrors(validationReport.error.details);
            return;
        }
        async function attemptLogin(){
            let animation = document.getElementById("loading-window")
            animation.style.display= "block";
            
            let result = await fetch(
                `${process.env.REACT_APP_BACKEND_API}/auth/login`,
                {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: {
                        "Content-type": "application/json",
                    },
                }
            );
            let data = await result.json();
            if(data.status === "success"){
                if(remember){
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("id", data.user._id);
                }else{
                    Cookies.set("token", data.token, {expires: 1});
                    Cookies.set("id", data.user._id, {expires: 1});
                }
                props.history.push("/admin");
            }else{
                setErrors("Authentication failed");
            }
            animation.style.display = "none";
        }
        attemptLogin();
        console.log('error:',errors)
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
                        <input className="form-check-input" type="checkbox" name="remeber" id="remeber" />
                        <label className="form-check-label" htmlFor="remeber">Remember me</label>
                    </div>
                    <input className="btn btn-primary w-100" type="submit" value="Submit" />
                </form>
                <div class="alert alert-danger" role="alert">
                    {errors}
                </div>
            </div>
        </div>
    )
}

export default Login;