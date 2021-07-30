import React, {useState, useEffect} from "react";
import bgImage1 from "../assets/background1.jpg";
import bgImage2 from "../assets/background2.jpg";
import bgImage3 from "../assets/background3.jpg";
import bgImage4 from "../assets/background4.jpg";

function Login(){
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
            console.log('startTimer', counter);
        }, 5000);

        return ()=>clearInterval(timer);
    })

    
    return(
        <div id="login-window" className="container-fluid d-flex justify-content-center align-items-center" style={{backgroundImage:`url(${bgImages[counter%4]}`}}>
            <div classNameid="login-box" className="glassy-dark-bg border border-3 p-3 rounded-custom w-25">
                <h2 className="logo-font text-center my-5">Cashie</h2>
                <form action="" className="my-3">
                    <input className="form-control text-pale-light p-2 full-opacity-bg rounded-custom" type="text" name="username" id="username" placeholder="Username" /><br />
                    <input className="form-control text-pale-light p-2 full-opacity-bg rounded-custom" type="password" name="password" id="password" placeholder="Password" /><br />
                    <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" name="remeber" id="remeber" />
                        <label className="form-check-label" htmlFor="remeber">Remember me</label>
                    </div>
                    <input className="btn btn-primary w-100" type="submit" value="Submit" />
                </form>
            </div>
        </div>
    )
}

export default Login;