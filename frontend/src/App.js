import './App.css';
import {Switch, Route, Redirect} from "react-router-dom";
import Login from './Screens/Login';
import Dashboard from "./Screens/Dashboard";
import ReceiptModal from './components/ReceiptModal';
import { useState, createContext, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';


export const CartContext = createContext();
export const SettingsContext = createContext();

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [allProducts, setAllProducts] = useState(null);
  const [storeSettings, setStoreSettings] = useState(null);
  const [receiptModel, setReceiptModal] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  const subTotal = cartItems.length && cartItems.reduce((sum, item)=> sum + item.price * item.qty, 0);
  const discount = storeSettings ? (+storeSettings.discount / 100) * subTotal : 0;
  const tax = storeSettings? (+storeSettings.tax/100) * subTotal : 0;
  const grandTotal = subTotal + tax - discount;

  const handleQtyChange = (id, type)=>{
    let index = cartItems.findIndex((item) => item._id === id);
    if(index !== -1){
      let newCartItems = [...cartItems];
      if(newCartItems[index]["qty"] === 1 && type === "decrement")
        return;
      type === "increment" ? newCartItems[index]["qty"]++: newCartItems[index]["qty"]--;
      setCartItems(newCartItems);
    }
  }

  const handleCartDelete = (id) => {
    let index = cartItems.findIndex((item)=>item._id===id);
    let newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  }
  const handleSelection = (id)=>{
    let index = cartItems.findIndex((item)=>item._id === id);
    if(index === -1){
      let product = allProducts.find((product) => product._id === id);
      product.qty = 1;
      product.price = +product.price;
      setCartItems([...cartItems, product]);
    }else{
      let newCartItems = [...cartItems];
      newCartItems.splice(index, 1);
      setCartItems(newCartItems);
    }
  };
  const handleSubmit = () => {
    let data = {
      items: cartItems,
      subtotal: subTotal,
      grandtotal: grandTotal,
      discount
    };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_API}/transaction`,
      data: data,
    }).then((result)=>{
      if(result.data.status === "success"){
        setCartItems([]);
        setReceiptModal(true);
        setTransactionData(result.data.data);
        Swal.fire({
          title: "Purchased!",
          text: "Item has been purchased",
          icon: "success"
        })
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
    }).catch((error)=>{
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
  };

  const handleReset = ()=>{
    setCartItems([]);
  };
  const handleOpen = (transaction)=>{
    setTransactionData(transaction);
    setReceiptModal(true);
  }
  const handleClose = ()=>{
    setReceiptModal(false);
  }

  useEffect(()=>{
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND_API}/product?limit=100000`
    }).then((result)=>{
      setAllProducts(result.data.data.products)
    });
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_BACKEND_API}/setting`
    }).then((result)=>{
      setStoreSettings(result.data.data)
    });
  }, [])

  return (
    <div className="App">
      <CartContext.Provider value={{cartItems, handleCartDelete, handleQtyChange, handleSelection, handleSubmit, handleReset, handleOpen}}>
        <SettingsContext.Provider value = {storeSettings}>
          <Switch>
            <Route path="/login" component={Login}></Route>
            <Route path="/dashboard" component={Dashboard}></Route>
            <Redirect from="/" to="/login"></Redirect>
          </Switch>
        </SettingsContext.Provider>
      </CartContext.Provider>
      <ReceiptModal isOpen={receiptModel} onClose={handleClose} onOpen={handleOpen} transactionData={transactionData} />
    </div>
  );
}

export default App;
