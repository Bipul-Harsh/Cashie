import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import queryString from "query-string";
import Swal from "sweetalert2";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

function Product(props){
    let [products, setProducts] = useState([]);
    let [query, setQuery] = useState({
        limit: 100,
        sort: "Newest",
    })
    let [refresh, setRefresh] = useState(false)

    useEffect(()=>{
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_BACKEND_API}/product?${queryString.stringify(query)}`,
        }).then((result)=>{
            if(result.data.status === "success"){
                setProducts(result.data.data.products);
            }
        });
    }, [refresh, query]);

    function handleQueryChange(event){
        setProducts(null);
        setQuery({ ...query, [event.target.name]:event.target.value });
    }
    function handleDelete(product){
        Swal.fire({
            title: "Are you sure?",
            text: "Product will be deleted!",
            icon: "warning",
            html:`
            <h2>Product Info</h2>
            <hr />
            <div class="d-flex justify-content-center">
                <img src=${product.image} class="border border-info" width="128" height="128" />
            </div>
            <table class="table table-dark table-striped table-hover mt-2 rounded-custom overflow-hidden align-middle">
                <tr>
                    <th>Product Name</th>
                    <td>:</td>
                    <td>${product.name}</td>
                </tr>
                <tr>
                    <th>Price</th>
                    <td>:</td>
                    <td>$${product.price}</td>
                </tr>
                <tr>
                    <th>Category</th>
                    <td>:</td>
                    <td>
                        <span class="rounded-pill p-1 px-2 bg-theme">
                            ${product.category[0].name}
                        </span>
                    </td>
                </tr>
            </table>
            `,
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#bb2d3b",
            customClass: {
                footer: "bg-dark",
                header: "bg-dark",
                cancelButton: "btn btn-secondary py-3 px-4",
                confirmButton: "btn btn-danger py-3 px-4",
            }
        }).then((result)=>{
            if(result.isConfirmed){
                axios
                    .delete(`${process.env.REACT_APP_BACKEND_API}/product/${product._id}`)
                    .then((res)=>{
                        if(res.data.status === "success"){
                            Swal.fire({
                                title: "<strong>Deleted!</strong>",
                                text: "Product has been deleted!",
                                icon: "success"
                            });
                            setRefresh(!refresh)
                        }else{
                            Swal.fire({
                                title: "<strong>Oops!</strong>",
                                text: "Something Went Wrong",
                                icon: "error"
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
                    });
            }
        });
    };

    return(
        <div className="row p-3 gx-0">
            <div className="d-flex justify-content-between align-items-center mt-4">
                <h4 className="fs-1">Product List</h4>
                <Link to={`${props.match.path}/create`}>
                    <button className="btn btn-theme text-light rounded-pill">+ New Data</button>
                </Link>
            </div>
            <form onChange={handleQueryChange}>
                <div className="d-flex justify-content-end mt-4">
                    <div className="d-flex flex-column px-2">
                        <p className="mb-1">Search</p>
                        <input type="search" name="keyword" id="keyword" className="p-2 bg-dark text-light rounded-pill border-0" placeholder="Keyword" />
                    </div>
                    <div className="d-flex flex-column px-2">
                        <p className="mb-1">Sort By</p>
                        <select name="sort" id="sort" className="p-2 bg-dark text-light rounded-pill">
                            <option value="Newest">Newest</option>
                            <option value="Oldest">Oldest</option>
                            <option value="Name">Name</option>
                            <option value="Lowest to Highest">Highest to Lowest</option>
                            <option value="Highest to Lowest">Lowest to Highest</option>
                        </select>
                    </div>
                </div>
            </form>
            <table className="table table-dark table-striped table-hover mt-4 rounded-custom-15 overflow-hidden align-middle">
                <thead>
                    <tr className="p-1 align-middle">
                        <th className="py-3">Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th className="text-center">Category</th>
                        <th className="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products && products.map((product)=>(
                            <tr key={product._id}>
                                <td className="py-3">
                                    {
                                        product.image?(
                                            <img src={product.image} width="64" height="64" alt="" className="border border-secondary" />
                                        ):(
                                            <span className="d-flex justify-content-center align-items-center no-image-holder bg-dark text-center border border-secondary">No Image</span>
                                        )
                                    }                                    
                                </td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td className="text-center">
                                    <span className="rounded-pill p-1 bg-theme px-2" >
                                        {product.category[0].name}
                                    </span>
                                </td>
                                <td className="text-end">
                                    <Link to={`${props.match.path}/update/${product._id}`}>
                                        <EditIcon />
                                    </Link>
                                    <span className="cursor-pointer"><DeleteIcon onClick={() => handleDelete(product)} /></span>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Product;