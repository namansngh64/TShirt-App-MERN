import React, { useEffect, useState } from "react";
import { API } from "../backend";
import "../styles.css";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/cartHelper";
import PaymentBTree from "./PaymentBTree";
import Razorpay from "./Razorpay";
import StripeCheckout from "./StripeCheckout";

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadAllProducts = () => {
    return (
      <div>
        <h2>This section is to load all products</h2>
        {products.map((product, index) => {
          return (
            // <>
            <Card
              key={index}
              product={product}
              removeFromCart={true}
              addToCart={false}
              setReload={setReload}
              reload={reload}
            />
            // {/* <br /> */}
            // {/* </> */}
          );
        })}
      </div>
    );
  };
  const loadCheckout = () => {
    return (
      <div>
        <h2>This section is for checkout</h2>
      </div>
    );
  };

  return (
    <Base title="Cart Page" description="Ready to Checkout!">
      <div className="row text-center">
        <h1 className="text-white mb-4">Your Cart Items</h1>
        <div className="row">
          <div className="col-6 ">
            {products.length > 0 ? (
              loadAllProducts()
            ) : (
              <h3>No products in cart! Add some</h3>
            )}
          </div>
          <div className="col-6">
            <StripeCheckout
              products={products}
              setReload={setReload}
              reload={reload}
            />
            <PaymentBTree
              products={products}
              setReload={setReload}
              reload={reload}
            />

            <Razorpay
              products={products}
              setReload={setReload}
              reload={reload}
            />
          </div>
        </div>
      </div>
    </Base>
  );
}
