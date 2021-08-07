import React from "react";
import moment from "moment";
import PrintIcon from "@material-ui/icons/Print";
import logo from "../assets/cashie_logo.png";

function ReceiptModal({isOpen, onOpen, onClose, transactionData}){
    const printReceipt = () => {
        window.print();
    }

    return(
        <div className={`receipt-modal overflow-auto py-2 ${isOpen?"d-flex":"d-none"}`}>
            <div className="p-4 mt-5 bg-dark rounded-custom receipt" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                        <img src={logo} alt="" width="32" height="32" />
                        <h2 className="logo-font fs-3 ms-2 my-0">Cashie</h2>
                    </div>
                    <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose}></button>
                </div>
                <div className="text-center mt-2">
                    <h4 className="fs-1">Receipt</h4>
                    <p className="my-2">{moment(transactionData && transactionData.createdAt).format("llll")}</p>
                    <p className="my-2">{transactionData && transactionData._id}</p>
                </div>
                <table className="table table-dark table-hover align-middle mt-3">
                    <thead>
                        <tr className="align-middle">
                            <th className="py-3">Product</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            transactionData && transactionData.products.map((product)=>(
                                <tr>
                                    <td className="d-flex flex-column align-items-start justify-content-center">
                                        <h4 className="my-0">{product.name}</h4>
                                        <p className="my-1">{product.category[0].name}</p>
                                    </td>
                                    <td>{product.qty}</td>
                                    <td>{product.price}</td>
                                    <td>
                                        ${(product.qty * product.price).toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className="d-flex justify-content-end mt-4">
                    <table className="table text-light">
                        <tbody className="align-middle text-end">
                            <tr>
                                <th>Sub Total</th>
                                <td>${transactionData && transactionData.subtotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th>Discount</th>
                                <td>${transactionData && transactionData.discount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th className="text-theme fs-4 p-3">Grand Total</th>
                                <td className="text-theme fs-4">${transactionData && transactionData.grandtotal.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="row justify-content-center px-3">
                    <button className="btn btn-theme text-light my-3 mt-4 rounded-pill" onClick={printReceipt}><PrintIcon /> Print Receipt</button>
                </div>
            </div>
        </div>
    )
}

export default ReceiptModal;