import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { API } from "../backend";
import { emptyCart, loadCart } from "./helper/cartHelper";
import { createOrder } from "./helper/orderHelper";

export const Razorpay = ({
  products,
  setReload = (f) => f,
  reload = undefined
}) => {
  //   const [orderId, setOrderId] = useState(undefined);
  var orderId;

  const token = isAuthenticated() && isAuthenticated().token;
  const user = isAuthenticated() && isAuthenticated().user;

  //   function loadScript(src) {
  //     return new Promise((resolve) => {
  //       const script = document.createElement("script");
  //       script.src = src;
  //       script.onload = () => {
  //         resolve(true);
  //       };
  //       script.onerror = () => {
  //         resolve(false);
  //       };
  //       document.body.appendChild(script);
  //     });
  //   }

  const getFinalAmount = () => {
    let amount = 0;
    products.map((product) => {
      amount = amount + product.price;
      //   console.log(product);
    });
    return amount;
  };

  const loadOrderId = (user, token) => {
    // const body = { products };
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    };

    return axios({
      method: "post",
      url: `${API}/payment/razorpay/${user._id}`,
      headers,
      data: {
        products
      }
    })
      .then((order) => {
        // const { id } = response;
        // console.log(response);
        // return false;
        // orderId = response.data.id;
        // console.log(orderId);

        var options = {
          key: "rzp_test_UD3JsV70BFXM3F", // Enter the Key ID generated from the Dashboard
          amount: getFinalAmount() * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "Acme Corp",
          description: "Test Transaction",
          //   image: "https://example.com/your_logo",
          order_id: order.data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          handler: function (response) {
            console.log(JSON.stringify(response));
            const data = {
              orderCreationId: order.data.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            };
            axios({
              method: "post",
              url: `${API}/payment/razorpay/success/${user._id}`,
              headers,
              data: {
                data
              }
            }).then((result) => {
              alert(result.data.msg);
            });
            // alert(result.data.msg);
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: "9999999999"
          },
          notes: {
            address: "Razorpay Corporate Office"
          },
          theme: {
            color: "#3399cc"
          }
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
        // e.preventDefault();
        rzp1.on("payment.failed", function (response) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });

        // TODO:come here later createOrder()
      })
      .catch((err) => console.log(err));

    // return fetch(`${API}/payment/razorpay/${user._id}`, {
    //   method: "POST",
    //   headers,
    //   body: JSON.stringify(body)
    // })
    //   .then((response) => {
    //     // const { id } = response;
    //     console.log(response);
    //     return false;
    //     setOrderId(JSON.stringify(response));
    //     console.log(orderId);
    //     // TODO:come here later createOrder()
    //   })
    //   .catch((err) => console.log(err));
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    // console.log(orderId);
    // loadOrderId(userId, token);
    // getFinalAmount();
  }, []);

  const handleClick = (e) => {
    // event.preventDefault();
    // const res = loadScript("https://checkout.razorpay.com/v1/checkout.js");

    // if (!res) {
    //   alert("Razorpay SDK failed to load. Are you online?");
    //   return;
    // }

    // console.log(token);
    loadOrderId(user, token);
    console.log(orderId);
    // var options = {
    //   key: "rzp_test_UD3JsV70BFXM3F", // Enter the Key ID generated from the Dashboard
    //   amount: getFinalAmount() * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    //   currency: "INR",
    //   name: "Acme Corp",
    //   description: "Test Transaction",
    //   //   image: "https://example.com/your_logo",
    //   order_id: orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    //   handler: function (response) {
    //     console.log(JSON.stringify(response));
    //     const data = {
    //       //   orderCreationId: order_id,
    //       razorpayPaymentId: response.razorpay_payment_id,
    //       razorpayOrderId: response.razorpay_order_id,
    //       razorpaySignature: response.razorpay_signature
    //     };
    //     console.log(data);
    //   },
    //   prefill: {
    //     name: user.name,
    //     email: user.email,
    //     contact: "9999999999"
    //   },
    //   notes: {
    //     address: "Razorpay Corporate Office"
    //   },
    //   theme: {
    //     color: "#3399cc"
    //   }
    // };
    // var rzp1 = new window.Razorpay(options);
    // rzp1.open();
    // e.preventDefault();
    // rzp1.on("payment.failed", function (response) {
    //   alert(response.error.code);
    //   alert(response.error.description);
    //   alert(response.error.source);
    //   alert(response.error.step);
    //   alert(response.error.reason);
    //   alert(response.error.metadata.order_id);
    //   alert(response.error.metadata.payment_id);
    // });
  };

  return (
    <div>
      <hr />
      <button className="btn btn-success mt-4" onClick={handleClick}>
        Pay With Razorpay
      </button>
    </div>
  );
};

export default Razorpay;
