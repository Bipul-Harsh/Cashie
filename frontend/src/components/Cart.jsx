import React, {useContext, Fragment} from "react";
import {CartContext, SettingsContext} from "../App";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import CancelIcon from "@material-ui/icons/Cancel";

function Cart(){
    const storeSettings = useContext(SettingsContext);
    const cartDetails = useContext(CartContext);
    
    const subTotal = cartDetails.cartItems.length?cartDetails.cartItems.reduce((sum, item)=>sum + item.price * item.qty, 0):0;
    const discount = storeSettings ? (+storeSettings.discount / 100) * subTotal : 0;
    const tax = storeSettings ? (+storeSettings.tax / 100) * subTotal : 0;
    const grandTotal = storeSettings ? subTotal + tax - discount : 0;

    return(
        <Fragment>
            <h4 className="mt-4 text-center fs-2">Cart</h4>
            {cartDetails.cartItems.length>0?(
                <table className="table table-dark table-striped table-hover mt-4 rounded overflow-hidden">
                    <tbody>
                        {cartDetails.cartItems.map((item)=>(
                            <tr key={item._id} className="align-middle">
                                <td className="text-center"><DeleteIcon className="cursor-pointer text-danger" onClick={()=>cartDetails.handleCartDelete(item._id)} /></td>
                                <td className="text-center"><img src={item.image} width="64" height="64" alt="" /></td>
                                <td>
                                    <div className="d-inline-flex flex-column align-items-start">
                                        <div className="fs-6">{item.name}</div>
                                        <div className="text-theme fs-5">${item.price}</div>
                                    </div>
                                </td>
                                <td>
                                    <RemoveCircleOutlineIcon className="text-theme cursor-pointer" onClick={()=>cartDetails.handleQtyChange(item._id, "decrement")} />
                                    <span className="px-3 fs-5">{item.qty}</span>
                                    <AddCircleOutline className="text-theme cursor-pointer" onClick={()=>cartDetails.handleQtyChange(item._id, "increment")} />
                                </td>
                                <td className="text-end">
                                    <strong>${(item.price * item.qty).toFixed(2)}</strong>
                                </td>
                            </tr>
                        ))

                        }
                    </tbody>
                </table>
            ):(
                <div className="bg-dark rounded p-2 py-5 mt-4 text-center fs-3">
                    Cart is Empty!
                </div>
            )}
            
            <table className="table table-dark table-striped table-hover rounded-3 overflow-hidden mt-2">
                <tbody>
                    <tr>
                        <td>Subtotal</td>
                        <td>:</td>
                        <td className="text-end">$ {subTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Discount</td>
                        <td>:</td>
                        <td className="text-end">$ {discount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Tax</td>
                        <td>:</td>
                        <td className="text-end">$ {tax.toFixed(2)}</td>
                    </tr>
                    <tr className="fs-5">
                        <th>Grand Total</th>
                        <th>:</th>
                        <th className="text-end">$ {grandTotal.toFixed(2)}</th>
                    </tr>
                </tbody>
            </table>
            <div className="row p-2 justify-content-around">
                <button className={`btn btn-secondary col-5 ${cartDetails.cartItems.length === 0?"disabled":""}`} onClick={cartDetails.handleReset}><CancelIcon /> Cancel</button>
                <button className={`btn btn-theme col-5 text-light ${cartDetails.cartItems.length === 0?"disabled":""}`} onClick={()=>cartDetails.handleSubmit(grandTotal.toFixed(2))}>Pay</button>
            </div>
        </Fragment>
    )
}

export default Cart;