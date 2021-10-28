import React, { useEffect, useState } from "react";
import { API } from "../backend";
import "../styles.css";
import Base from "./Base";
import Card from "./Card";
import { getProducts } from "./helper/coreapicalls";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  const loadAllProducts = () => {
    getProducts().then((data) => {
      if (data.error) {
        setError(true);
      } else {
        setProducts(data);
      }
    });
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  const displayContent = () => {
    // let columns = [];
    // products.forEach((product, idx) => {
    //   // push column
    //   columns.push(
    //     <div className="col-lg-4 py-3" key={idx}>
    //       <Card product={product} />
    //     </div>
    //   );
    //   // force wrap to next row every 4 columns
    //   if ((idx + 1) % 3 === 0) {
    //     columns.push(<div className="w-100"></div>);
    //   }
    // });
    // return <div className="row">{columns}</div>;

    const rows = [...Array(Math.ceil(products.length / 3))];
    console.log(rows);
    // chunk the products into the array of rows
    const productRows = rows.map((row, idx) =>
      products.slice(idx * 3, idx * 3 + 3)
    );
    // map the rows as div.row
    const content = productRows.map((row, idx) => (
      <div key={idx} className="row">
        {console.log(idx)}
        {row.map((product) => (
          <>
            <div key={product._id} className="col-md-4">
              <Card product={product} />
            </div>
          </>
        ))}
        {/* <div
          className="row text-white myDiv"
          style={{ display: "block", background: "blue" }}
        >
          HELLo
        </div> */}
      </div>
    ));
    return <div>{content}</div>;
  };

  //   var counter = 1;
  //   for (var i = 0; i <= products.length(); i++) {
  //     <div className="row">

  //     {
  //     products.length()>i?<div className="col-md-4">
  //             <Card product={product} />
  //           </div>
  //         : break   }
  //     {products.length() > i
  //       ? (
  //           <div className="col-md-4">
  //             <Card product={product} />
  //           </div>
  //         ) && counter++
  //       : s}
  //     {products.length() > i
  //       ? (
  //           <div className="col-md-4">
  //             <Card product={product} />
  //           </div>
  //         ) && counter++
  //       : s}
  //   </div>
  //   }
  //     return (
  //      div
  //     );

  // };

  return (
    <Base title="Home Page" description="Welcome to the Tshirt Store!">
      <div className="row text-center">
        <h1 className="text-white mb-4">All of Tshirts</h1>
        {/* <div className="row"> */}
        {/* {products.map((product, index) => {
            // console.log((index + 1) % 3 === 0);
            return (
              <div key={index} className="col-lg-4 mb-4">
                <Card product={product} />
              </div>
            );
          })} */}
        {/* <buton
          className="btn btn-primary btn-lg"
          onClick={() => {
            var divs = document.querySelectorAll(".myDiv");
            console.log(divs);
            for (var i = 0; i < divs.length; i++) {
              console.log(divs[i].classList.contains("text-white"));
              // divs[i].classList.add("text-black");
            }
          }}
        >
          Click
        </buton> */}
        {displayContent()}
        {/* </div> */}
        {/* {console.log(document.getElementsByClassName("myDiv"))} */}
      </div>
    </Base>
  );
}
