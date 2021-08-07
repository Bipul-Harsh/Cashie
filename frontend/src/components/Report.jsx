import React, {useState, useEffect, useContext} from "react";
import moment from "moment";
import queryString from "query-string";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {CartContext} from "../App";

function Report(){
    const [query, setQuery] = useState({
        start: moment().startOf("week"),
        end: moment().endOf("week"),
        limit: 20,
        sort: "Newest"
    });
    const [weeklyTransactions, setWeeklyTransactions] = useState([]);
    const cartDetails = useContext(CartContext);

    const handleQueryChange = (event) => {
        if(event.target.name === "start" || event.target.name === "end"){
            let date = moment(event.target.value, "YYYY-MM-DD");
            setQuery({...query, [event.target.name]:date});
        }else{
            setQuery({...query, [event.target.name]: event.target.value});
        }
    };

    useEffect(()=>{
        async function getWeeklyTransaction(){
            let result = await fetch(
                `${process.env.REACT_APP_BACKEND_API}/transaction?${queryString.stringify(query)}`,
            );
            let data = await result.json();
            setWeeklyTransactions(data.data.transactions);
        }
        getWeeklyTransaction();
    }, [query]);

    return(
        <div className="row p-3 gx-0">
            <h4 className="fs-1">Report</h4>
            <form onChange={handleQueryChange}>
                <div className="d-flex justify-content-end mt-4">
                    <div className="d-flex flex-column px-2">
                        <p className="mb-1">Start</p>
                        <input type="date" name="start" className="p-2 bg-dark text-light rounded-pill border-0" value={query.start && query.start.format("YYYY-MM-DD")} />
                    </div>
                    <div className="d-flex flex-column px-2">
                        <p className="mb-1">End</p>
                        <input type="date" name="end" className="p-2 bg-dark text-light rounded-pill border-0" value={query.end && query.end.format("YYYY-MM-DD")} />
                    </div>
                    <div className="d-flex flex-column px-2">
                        <p className="mb-1">Sort By</p>
                        <select name="sort" id="sort" className="p-2 bg-dark text-light rounded-pill">
                            <option value="Newest">Newest</option>
                            <option value="Oldest">Oldest</option>
                        </select>
                    </div>
                </div>
            </form>
            <table className="table table-dark table-striped table-hover mt-4 rounded-custom-15 overflow-hidden align-middle">
                <thead>
                    <tr className="align-middle">
                        <th className="py-3">ID</th>
                        <th>Date</th>
                        <th>Qty</th>
                        <th>Grandtotal</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        weeklyTransactions && weeklyTransactions.map((transaction)=>(
                            <tr key={transaction._id}>
                                <td className="py-4">{transaction._id}</td>
                                <td>{moment(transaction._createdAt).format("LLL")}</td>
                                <td>{transaction.items.length}</td>
                                <td>${transaction.grandtotal.toFixed(2)}</td>
                                <td className="text-right">
                                    <VisibilityIcon className="text-primary cursor-pointer" onClick={()=>cartDetails.handleOpen(transaction)} />
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Report;