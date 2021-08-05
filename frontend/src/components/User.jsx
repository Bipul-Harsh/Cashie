import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import queryString from "query-string";
import Swal from "sweetalert2";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import moment from "moment";

function User(props){
    let [users, setUsers] = useState(null);
    let [query, setQuery] = useState({
        limit: 100,
    })
    let [refresh, setRefresh] = useState(false)

    useEffect(()=>{
        axios(
            `${process.env.REACT_APP_BACKEND_API}/user?${queryString.stringify(query)}`,
        ).then((result)=>setUsers(result.data.data.users));
    }, [refresh, query]);

    function handleQueryChange(event){
        setUsers(null);
        setQuery({ ...query, [event.target.name]:event.target.value });
    }
    function handleDelete(user){
        Swal.fire({
            title: "Are you sure?",
            text: "User will be deleted!",
            icon: "warning",
            html:`
            <h2>User Info</h2>
            <hr />
            <table class="table table-dark table-striped table-hover mt-2 rounded-custom overflow-hidden align-middle">
                <tr>
                    <th>Full Name</th>
                    <td>:</td>
                    <td>${user.fullname}</td>
                </tr>
                <tr>
                    <th>Username</th>
                    <td>:</td>
                    <td>${user.username}</td>
                </tr>
                <tr>
                    <th>Role</th>
                    <td>:</td>
                    <td>
                        <span class=${`rounded-pill p-1 border ${user.role==="Admin"?"border-danger text-theme":"border-info text-info"}`}>
                            ${user.role==="Admin"?"Admin":"Cashier"}
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>Email</th>
                    <td>:</td>
                    <td>${user.email}</td>
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
                    .delete(`${process.env.REACT_APP_BACKEND_API}/user/${user._id}`)
                    .then((res)=>{
                        if(res.data.status === "success"){
                            Swal.fire({
                                title: "<strong>Deleted!</strong>",
                                text: "User has been deleted",
                                icon: "success"
                            });
                            setRefresh(!refresh)
                        }else{
                            Swal.fire({
                                title: "<strong>Oops!</strong>",
                                text: "Something went wrong",
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
                <h4 className="fs-1">User List</h4>
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
                        <p className="mb-1">Role</p>
                        <select name="role" id="role" className="p-2 bg-dark text-light rounded-pill">
                            <option value="all">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Cashier">Cashier</option>
                        </select>
                    </div>
                    <div className="d-flex flex-column px-2">
                        <p className="mb-1">Sort By</p>
                        <select name="sort" id="sort" className="p-2 bg-dark text-light rounded-pill">
                            <option value="Newest">Newest</option>
                            <option value="Oldest">Oldest</option>
                            <option value="Name">Name</option>
                            <option value="Last Active">Last Active</option>
                        </select>
                    </div>
                </div>
            </form>
            <table className="table table-dark table-striped table-hover mt-4 rounded-custom-15 overflow-hidden align-middle">
                <thead>
                    <tr className="p-1 align-middle">
                        <th className="py-3">Full Name</th>
                        <th>Username</th>
                        <th className="text-center">Role</th>
                        <th className="text-end">Last Active</th>
                        <th className="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users && users.map((user)=>(
                            <tr key={user._id}>
                                <td className="py-3">{user.fullname}</td>
                                <td>{user.username}</td>
                                <td className="text-center">
                                    <span className={`rounded-pill p-1 border ${user.role==="Admin"?"border-danger text-theme":"border-info text-info"}`}>
                                        {user.role==="Admin"?"Admin":"Cashier"}
                                    </span>
                                </td>
                                <td className="text-end">
                                    {moment(user.lastActive).format("llll")}
                                </td>
                                <td className="text-end">
                                    <Link to={`${props.match.path}/update/${user._id}`}>
                                        <EditIcon />
                                    </Link>
                                    <span className="cursor-pointer"><DeleteIcon onClick={() => handleDelete(user)} /></span>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default User;