import React from "react";
import { API } from "../../backend";

const ImageHelper = (product) => {
  const imageurl = product.product._id
    ? `${API}/product/photo/${product.product._id}`
    : "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260";
  return (
    <div className="rounded border border-success p-2">
      <img
        src={imageurl}
        alt="photo"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
        className="mb-3 rounded"
      />
      {/* {console.log(product)} */}
    </div>
  );
};

export default ImageHelper;
