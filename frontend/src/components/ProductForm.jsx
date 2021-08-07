import React, {useState, useEffect} from "react";
import Joi from "joi-browser";
import Swal from "sweetalert2";
import axios from "axios";
import { useParams } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

function ProductForm(props){
    const params = useParams();
    const [formData, setFormData] = useState({});
    const [categories, setCategories] = useState(null);
    const [warnings, setWarnings] = useState([]);
    const [image, setImage] = useState(null);
    const formSchema = {
        name: Joi.string().required().min(3).max(50),
        price: Joi.number().required().max(1000000).min(0),
        description: Joi.string().required().min(7).max(500),
        category: Joi.string().required().min(3).max(30),
        hidden: Joi.string(),
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

        let multiFormData = new FormData();
        for(let i in formData){
            if(i === "price"){
                multiFormData.append(i, +formData[i]);
            }else{
                multiFormData.append(i, formData[i]);
            }
        }

        image && multiFormData.append("image", image);

        axios({
            method: service,
            url: `${process.env.REACT_APP_BACKEND_API}/product/${service==="PUT"?props.match.params.id:""}`,
            data: multiFormData,
            headers: {
                "Content-type": "multipart/formdata",
            },
        }).then((result)=>{
            if(result.data.status === "success"){
                Swal.fire({
                    icon:"success",
                    title:`Product has been ${service==="POST"?"Created":"Updated"}!`,
                    html:`
                    <h2>Product Info</h2>
                    <hr />
                    <div class="d-flex justify-content-center">
                        <img src=${image} class="border border-info" width="128" height="128" />
                    </div>
                    <table class="table table-dark table-striped table-hover mt-2 rounded-custom overflow-hidden align-middle">
                        <tr>
                            <th>Product Name</th>
                            <td>:</td>
                            <td>${formData.name}</td>
                        </tr>
                        <tr>
                            <th>Price</th>
                            <td>:</td>
                            <td>$${formData.price}</td>
                        </tr>
                        <tr>
                            <th>Category</th>
                            <td>:</td>
                            <td>
                                <span class="rounded-pill p-1 bg-theme">
                                    ${
                                        categories.map((category)=>category._id === formData.category?category.name:null)
                                    }
                                </span>
                            </td>
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
    function handleUpload(event){
        var fileReader = new FileReader();
        fileReader.readAsDataURL(event.target.files[0]);
        fileReader.onload = function(fileEvent){
            setImage(fileEvent.target.result);
        };
    };

    function triggerInput(){
        let imageInput = document.getElementById("image");
        imageInput.click();
    }

    useEffect(()=>{
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_BACKEND_API}/category`,
        }).then((result)=>{
            if(result.data.status === "success")
                setCategories(result.data.data.categories);
        });
    }, []);

    useEffect(()=>{
        let productID = props.match.params.id;
        productID && 
            axios({
                method: "GET",
                url: `${process.env.REACT_APP_BACKEND_API}/product/${productID}`
            }).then((result)=>{
                if(result.data.status === "success"){
                    let {name, price, description, image: hidden, category} = result.data.data;
                    setFormData({name, price, description, hidden, category});
                    setService("PUT");
                }
            });
    }, [props.match.params.id]);

    return(
        <div className="row p-3 gx-0">
            <div className="d-flex justify-content-start align-items-center mt-4">
                <ArrowBackIcon onClick={()=>props.history.goBack()} className="cursor-pointer" />
                <h4 className="m-0 ms-2 fs-1">&nbsp;Form Product</h4>
            </div>
            <div className="mt-4 p-4 form-bg rounded-custom">
                <form className="row gx-0" onChange={handleOnChange} onSubmit={handleOnSubmit}>
                    <div className="col-6 col-xs-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="name">Name <span className="text-danger">*</span></label>
                        <input type="text" name="name" id="name" className="bg-dark text-light p-2 rounded-pill border-0 mt-1" value={formData.name} />
                    </div>
                    <div className="col-6 col-xs-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="price">Price ($)<span className="text-danger">*</span></label>
                        <input type="number" name="price" id="price" className="bg-dark text-light p-2 rounded-pill border-0 mt-1" value={formData.price} />
                    </div>
                    <div className="col-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="description">Description<span className="text-danger">*</span></label>
                        <textarea name="description" id="description" rows="5" autoComplete="on" className="bg-dark text-light p-2 px-3 rounded-custom border-0 mt-1" value={formData.description}></textarea>
                    </div>
                    <div className="col-12 d-flex flex-column my-3 px-2">
                        <label htmlFor="category">Category<span className="text-danger">*</span></label>
                        <select name="category" id="category" className="bg-dark text-light p-2 rounded-pill border-0 mt-1">
                            <option aria-label="None" value="" />
                            {
                                categories && categories.map((category)=>(
                                    <option selected={formData.category === category._id} key={category._id} value={category._id}>{category.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="col-12 my-3 px-2">
                        <p>Product Image</p>
                        <label htmlFor="image">
                            <button type="button" className="btn btn-theme-linear text-light rounded-pill" onClick={triggerInput} >
                                <AddCircleOutlineIcon />&nbsp; Browse
                            </button>
                        </label>
                        <input onChange={handleUpload} type="file" name="hidden" accept="image/*" id="image" className="bg-dark text-light p-2 rounded-pill border-0 mt-1 d-none" />
                        <br />
                        {
                            (image || formData.hidden) && (
                                <img width="256" src={image?image:formData.hidden} alt={formData.name} className="mt-3 border border-theme" />
                            )
                        }
                    </div>
                    <div className="col-12 row gx-0 justify-content-center mt-4">
                        <button type="submit" className="btn btn-theme-linear text-light">{params.id?"Update":"Create"}</button>
                    </div>
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
                </form>
            </div>
        </div>
    )
}

export default ProductForm;