import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import Cart from './Cart';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { CartContext } from "../App";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div className="row mt-3" role="tabpanel" hidden={value !== index} id={`scrollable-auto-tabpanel-${index}`} aria-labelledby={`scrollable-auto-tab-${index}`} {...other}>
            { value === index && (
                <div className="d-flex flex-wrap">
                    {children}
                </div>

            )}
        </div>
    );
}

function Transaction(){
    const cartInfo = useContext(CartContext);
    const [categories, setCategories] = useState(null);
    const [value, setValue] = useState(0);
    const [allProducts, setAllProducts] = useState(null);
    const [query, setQuery] = useState({
        limit: 100,
        page: 0
    })
    let queryStringify = queryString.stringify(query);

    function handleChange(event, newValue){
        setValue(newValue);
    }

    useEffect(()=>{
        async function getAllCategoriesProducts(){
            let result = await axios({
                method: "GET",
                url: `${process.env.REACT_APP_BACKEND_API}/product/transaction?${queryStringify}`
            })

            setCategories(result.data.data.categories);
            setAllProducts(result.data.data.all);
        }
        getAllCategoriesProducts();
    }, [queryStringify]);

    return(
        <div className="row p-3 gx-0 mt-2 justify-content-evenly align-items-start">
            <div className="col-12 col-md-5 col-lg-7 p-4 mt-3 form-bg rounded-custom">
                <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto" aria-label="scrollable auto tabs example">
                    <Tab label="All" className="text-light" />
                    {categories && categories.map((category, index) => (
                            <Tab className="text-light" label={category.name} key={category._id} />
                        ))}
                </Tabs>
                <TabPanel value={value} index={0}>
                    {allProducts && allProducts.map((product) => (
                        <div className="card cursor-pointer bg-dark p-2 px-3 d-inline m-2 d-flex justify-content-center" onClick={() => cartInfo.handleSelection(product._id)} key={product._id}>
                            <img src={product.image} height="128px" width="128px" alt={product.description} />
                            <div className="card-body d-flex align-items-center flex-column">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text text-theme">${product.price}</p>
                            </div>
                        </div>
                    ))}
                </TabPanel>
                {categories && categories.map((category, index) => (
                    <TabPanel value={value} index={index + 1} key={category._id}>
                        {category.items.map((product) => (
                            <div className="card cursor-pointer bg-dark p-2 px-3 d-inline m-2 d-flex justify-content-center" onClick={() => cartInfo.handleSelection(product._id)} key={product._id}>
                                <img src={product.image} height="128px" width="128px" alt={product.description} />
                                <div className="card-body d-flex align-items-center flex-column">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text text-theme">${product.price}</p>
                                </div>
                            </div>
                        ))}
                    </TabPanel>
                ))}
            </div>
            <div className="col-12 col-md-6 col-lg-4 p-3 mt-3 form-bg rounded-custom cart-min-width">
                <Cart />
            </div>
        </div>
    )
}

export default Transaction;