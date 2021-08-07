import React, {useState, useEffect} from 'react';
import ReceiptIcon from "@material-ui/icons/Receipt";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import moment from "moment";
import queryString from "query-string";
import { Line } from "react-chartjs-2";

const chartOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                stepSize: 500
            }
        }]
    }
};

function Home(props){
    const [dashboardData, setDashboardData] = useState(null);
    const [weeklyTransactions, setWeeklyTransactions] = useState([]);
    const query = {
        start: moment().startOf("week").format("llll"),
        end: moment().endOf("week").format("llll"),
        limit: 5,
    };
    let queryStringify = queryString.stringify(query);
    let weeklyIncome = [];

    useEffect(()=>{
        async function getDashboardData(){
            let result = await fetch(`${process.env.REACT_APP_BACKEND_API}/transaction/dashboard?${queryStringify}`);
            let data = await result.json();
            setDashboardData(data);
        }
        getDashboardData();
    }, [queryStringify]);

    useEffect(()=>{
        async function getWeeklyTransaction(){
            let result = await fetch(`${process.env.REACT_APP_BACKEND_API}/transaction?${queryStringify}`);
            let data = await result.json();
            setWeeklyTransactions(data.data.transactions)
        }
        getWeeklyTransaction();
    }, [queryStringify]);
    

    if(dashboardData){
        let dataGot = false;
        for(let ind=1; ind<=7; ind++){
            let index = dashboardData.data.items.findIndex((item)=>parseInt(item._id)===ind);
            if(index===-1 && dataGot){
                break;
            }else if(index === -1){
                weeklyIncome.push(0);
            }else{
                dataGot = true;
                weeklyIncome.push(dashboardData.data.items[index]["grandtotal"]);
            }
        }
    }

    const chartData = {
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        datasets: [{
            label: "Income",
            data: weeklyIncome,
            fill: true,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgb(255, 99, 132)",
            lineTension: 0.2
        }]
    }

    return(
        <div className="row gx-0 p-3">
            <h4 className="fs-1 mt-4">Dashboard</h4>
            <div className="row">
                <div className="col-12 col-sm-6 col-lg-4 my-2">
                    <div className="dashboard-transaction-bg rounded-custom p-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex flex-column">
                            <h1 >{dashboardData && dashboardData.data.count}</h1>
                            <h6 className="m-0">Transaction</h6>
                        </div>
                        <ReceiptIcon className="dashboard-panel-icon" />
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-4 my-2">
                    <div className="dashboard-income-bg rounded-custom p-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex flex-column">
                            <h1 >{dashboardData && "$" + dashboardData.data.total.toFixed(2)}</h1>
                            <h6 className="m-0">Income</h6>
                        </div>
                        <AccountBalanceWalletIcon className="dashboard-panel-icon" />
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-4 my-2">
                    <div className="dashboard-product-bg rounded-custom p-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex flex-column">
                            <h1 >{dashboardData && dashboardData.data.qty}</h1>
                            <h6 className="m-0">Products</h6>
                        </div>
                        <LocalMallIcon className="dashboard-panel-icon" />
                    </div>
                </div>
            </div>
            <div className="row gx-0 mt-4">
                <div className="col-12 col-lg-6 px-3 mt-3 row">
                    <div className="form-bg rounded-custom p-4 d-flex flex-column align-items-center justify">
                        <h4>Weekly Chart</h4>
                        <Line className="mt-5" data={chartData} options={chartOptions} />
                    </div>
                </div>
                <div className="col-12 col-lg-6 px-3 mt-3 row ms-lg-2">
                    <div className="form-bg rounded-custom p-4 d-flex flex-column align-items-center justify">
                        <h4>Recent Transactions</h4>
                        <table className="table table-dark table-striped table-hover mt-4 overflow-hidden rounded align-middle">
                            <thead>
                                <tr className="align-middle">
                                    <th className="py-3">Receipt Number</th>
                                    <th>Date</th>
                                    <th className="text-center">Qty</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    weeklyTransactions && weeklyTransactions.map((transaction)=>(
                                        <tr key={transaction._id}>
                                            <td className="text-break py-3">{transaction._id}</td>
                                            <td>{moment(transaction._createdAt).format("LLL")}</td>
                                            <td className="text-center">{transaction.items.length}</td>
                                            <td>${transaction.grandtotal.toFixed(2)}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;