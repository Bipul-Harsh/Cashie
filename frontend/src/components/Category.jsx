import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";
import Swal from "sweetalert2";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

function Category(props){
    const [categories, setCategories] = useState(null);
    const [query, setQuery] = useState({
        limit: 20,
    })
    const [refresh, setRefresh] = useState(false);

    function handleQueryChange(event){
        setCategories(null);
        setQuery({...query, [event.target.name]:event.target.value});
    }
    function handleDelete(category){
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            text: "Category will be Deleted!",
            html:`
            <h2>Category Info</h2>
            <hr />
            <table class="table table-dark table-striped table-hover mt-2 rounded-custom overflow-hidden align-middle">
                <tr>
                    <th>Category Name</th>
                    <td>:</td>
                    <td>${category.name}</td>
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
                axios({
                    method: "DELETE",
                    url: `${process.env.REACT_APP_BACKEND_API}/category/${category._id}`
                }).then((result)=>{
                    if(result.data.status === "success"){
                        Swal.fire({
                            title: "Deleted!",
                            text: "Category has been deleted",
                            icon: "success"
                        })
                    }
                    setRefresh(!refresh);
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
        })
    }

    useEffect(()=>{
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_BACKEND_API}/category?${queryString.stringify(query)}`
        }).then((result)=>{
            setCategories(result.data.data.categories);
        })
    }, [refresh, query]);

    return(
        <div className="row gx-0 p-3">
            <div className="d-flex justify-content-between align-items-center mt-4">
                <h4 className="fs-1">Category List</h4>
                <Link to={`${props.match.path}/create`}>
                    <button className="btn btn-theme text-light rounded-pill">+ New Data</button>
                </Link>
            </div>
            <form onChange={handleQueryChange}>
                <div className="mt-4 d-flex justify-content-end">
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
                        </select>
                    </div>
                </div>
            </form>
            <table className="table table-dark table-striped table-hover mt-4 rounded-custom-15 overflow-hidden align-middle">
                <thead>
                    <tr className="p-1 align-middle">
                        <th className="py-3">Category Name</th>
                        <th className="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categories && categories.map((category)=>(
                            <tr key={category._id}>
                                <td className="py-3">{category.name}</td>
                                <td className="text-end">
                                    <Link to={`${props.match.path}/update/${category._id}`}>
                                        <EditIcon />
                                    </Link>
                                    <span className="cursor-pointer"><DeleteIcon onClick={() => handleDelete(category)} /></span>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Category;