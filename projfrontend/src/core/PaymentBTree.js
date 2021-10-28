import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { emptyCart, loadCart } from "./helper/cartHelper";
import { createOrder } from "./helper/orderHelper";
import { getmeToken, processPayment } from "./helper/paymentbhelper";

import DropIn from "braintree-web-drop-in-react";

const PaymentBTree = ({
  products,
  setReload = (f) => f,
  reload = undefined
}) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    erro: "",
    instance: {}
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getmeToken(userId, token).then((info) => {
      console.log("INFO :", info);
      if (info.error) {
        setInfo({ ...info, error: info.error });
      } else {
        const clientToken = info.clientToken;
        setInfo({ clientToken });
      }
    });
  };

  const showbtdropIn = () => {
    return (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(i) => {
                // console.log(i);
                setInfo({ ...info, instance: i });
              }}
            />
            {/* {alert(info.instance)} */}
            <button className="btn w-100 btn-success" onClick={onPurchase}>
              Buy
            </button>
          </div>
        ) : (
          <h3>Please login or add something to cart</h3>
        )}
      </div>
    );
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const onPurchase = () => {
    setInfo({ loading: true });
    let nonce;
    // alert(info.instance);
    let getNonce = info.instance.requestPaymentMethod().then((data) => {
      nonce = data.nonce;
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getFinalAmount()
      };
      processPayment(userId, token, paymentData)
        .then((response) => {
          setInfo({ ...info, success: response.success, loading: false });
          console.log("PAYMENT SUCCESS");
          products.map((prod, i) => {
            console.log("PRODUCT", prod);
          });
          const orderData = {
            products: products,
            transaction_id: response.transaction.id,
            amount: response.transaction.amount
          };
          createOrder(userId, token, orderData);
          emptyCart(() => {
            console.log("HEHE");
          });

          setReload(!reload);
        })
        .catch((err) => {
          console.log("PAYMENT FAILED");
          setInfo({ loading: false, success: false });
        });
    });
  };

  const getFinalAmount = () => {
    let amount = 0;
    products.map((product) => {
      amount = amount + product.price;
    });
    return amount;
  };

  return (
    <div className="my-4 ">
      <h3>Your bill is {getFinalAmount()}</h3>
      {showbtdropIn()}
    </div>
  );
};

export default PaymentBTree;
