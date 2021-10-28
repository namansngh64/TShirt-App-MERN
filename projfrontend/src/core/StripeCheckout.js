import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { emptyCart, loadCart } from "./helper/cartHelper";
import StripeCheckoutButton from "react-stripe-checkout";
import { API } from "../backend";
import { createOrder } from "./helper/orderHelper";

const StripeCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: ""
  });

  //   const { userId, token } = isAuthenticated();
  const token = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;

  const getFinalAmount = () => {
    let amount = 0;
    products.map((product) => {
      amount = amount + product.price;
    });
    return amount;
  };

  const makePayment = (token) => {
    const body = {
      products,
      token
    };
    const headers = {
      "Content-Type": "application/json"
    };
    return fetch(`${API}/stripepayment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    })
      .then((response) => {
        console.log(response);
        // TODO:come here later createOrder()
      })
      .catch((err) => console.log(err));
  };

  const showStripeButton = () => {
    return isAuthenticated() ? (
      <StripeCheckoutButton
        stripeKey="pk_test_51JeEiFSGcLNz8NVfByJ6m3LGHizX7DwWpLnwQuBhjOb11AemgxqOMGib7ENV608M6SXZkfEe1ZlDeesW7N16EM9L00yvTFEldz"
        token={makePayment}
        shippingAddress
        billingAddress
        name="Buy Tshirts"
        amount={getFinalAmount() * 100}
      >
        <button className="btn btn-success btn-md">Pay With Stripe</button>
      </StripeCheckoutButton>
    ) : (
      <Link to="/signin">
        <button className="btn btn-outline-warning">Signin To Checkout</button>
      </Link>
    );
  };

  return (
    <div>
      <h3 className="text-white">Stripe Checkout Loaded {getFinalAmount()}</h3>
      {showStripeButton()}
    </div>
  );
};

export default StripeCheckout;
