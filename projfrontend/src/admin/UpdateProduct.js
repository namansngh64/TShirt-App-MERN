import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import {
  getCategories,
  getProduct,
  updateProduct
} from "./helper/adminapicall";

const UpdateProduct = ({ match }) => {
  const { user, token } = isAuthenticated();

  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    error: "",
    createdProduct: "",
    getaRedirect: false,
    formData: new FormData()
  });
  const [name1, setName1] = useState();

  const {
    name,
    description,
    price,
    stock,
    photo,
    categories,
    category,
    loading,
    error,
    createdProduct,
    getaRedirect,
    formData
  } = values;

  const preload = (productId) => {
    getProduct(productId).then((data) => {
      if (data.error) {
        setValues((prevState) => {
          return { ...prevState, error: data.error };
        });
      } else {
        // preloadCategories();
        setValues((prevState) => {
          return {
            ...prevState,
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category._id,
            stock: data.stock,
            error: "",
            formData: new FormData()
          };
        });

        preloadCategories();

        // console.log(values);
      }
      // preloadCategories();
    });
  };

  const preloadCategories = () => {
    getCategories()
      .then((data) => {
        if (!data) {
          setValues((prevState) => {
            return { ...prevState, error: "Error in cate" };
          });
        } else {
          console.log(data);
          setValues((prevState) => {
            return {
              ...prevState,
              categories: data,
              // error: "",
              formData: new FormData()
            };
          });
          console.log(formData.get(name));
          // preload(match.params.productId);
        }
      })
      .catch((err) => console.log("ERROR: ", err));
    console.log(categories);
  };

  useEffect(() => {
    preload(match.params.productId);
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    // console.log(name);

    setValues((prevState) => {
      return { ...prevState, [name]: value };
    });
  };
  // const handleChange1 = (name, value) => {
  // formData.set(name, value);
  //   setValues({ ...values, name: value });
  // };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues((prevState) => {
      return { ...prevState, error: "", loading: true };
    });

    formData.set("name", name);

    formData.set("description", description);

    formData.set("price", price);

    formData.set("stock", stock);

    {
      formData.set("category", category);
    }
    updateProduct(match.params.productId, user._id, token, formData).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, loading: false });
        } else {
          console.log(values);
          console.log(formData);
          setValues({
            ...values,
            name: "",
            description: "",
            price: "",
            stock: "",
            photo: "",
            error: "",
            loading: false,
            createdProduct: data.name,
            getaRedirect: true
          });
        }
      }
    );
  };

  const successMessage = () => {
    return (
      <div
        className="alert alert-success mt-3"
        style={{ display: createdProduct ? "" : "none" }}
      >
        <h4>{createdProduct} Updated Successfully</h4>
      </div>
    );
  };

  //   const performRedirect = () => {
  //     if (getaRedirect) {
  //       return <Redirect to="/admin/dashboard" />;
  //     }
  //   };

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (getaRedirect) {
  //       console.log("HELLO");
  //       return <Redirect to="/admin/dashboard" />;
  //     }
  //   }, 2000);
  // }, []);

  const loadingMessage = () => {
    return (
      <div
        className="alert alert-info mt-3"
        style={{ display: loading ? "" : "none" }}
      >
        <h5>Loading...</h5>
      </div>
    );
  };
  const errorMessage = () => {
    return (
      <div
        className="alert alert-danger mt-3"
        style={{ display: error === "" ? "none" : "" }}
      >
        <h5>{error}</h5>
        {console.log(error)}
      </div>
    );
  };

  // const performRedirect = () => {
  //   if (getaRedirect) {
  //     return <Redirect to="/admin/dashboard" />;
  //   }
  // };

  const createProductForm = () => (
    <form>
      <span>Post photo</span>
      <div className="mb-3">
        <label className="btn btn-block btn-success w-100">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="choose a file"
          />
        </label>
      </div>
      <div className="mb-3">
        <input
          onChange={handleChange("name")}
          name="photo"
          id="name1"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="mb-3">
        <textarea
          onChange={handleChange("description")}
          name="photo"
          className="form-control"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="mb-3">
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          placeholder="Price"
          value={price}
        />
      </div>
      <div className="mb-3">
        <select
          // onClick={preloadCategories}
          onChange={handleChange("category")}
          className="form-control"
          placeholder="Category"
          value={category}
        >
          <option>Select</option>
          {categories &&
            categories.map((cate, index) => (
              <option key={index} value={cate._id}>
                {cate.name}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-3">
        <input
          onChange={handleChange("stock")}
          type="number"
          className="form-control"
          placeholder="Quantity"
          value={stock}
        />
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-warning mb-3"
      >
        Update Product
      </button>
    </form>
  );

  return (
    <Base
      title="Update product here!"
      description="Welcome to product updation section"
      className="container bg-info p-4"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
          {errorMessage()}
          {loadingMessage()}
          {successMessage()}
          {createProductForm()}
          <div style={{ display: "none" }}>
            {setTimeout(() => {
              if (getaRedirect) {
                // console.log("HELLO");
                window.location = "/admin/dashboard";
              }
            }, 2000)}
          </div>
        </div>
      </div>
      <p className="text-white text-center">
        {JSON.stringify(values)}
        {" " + name1}
        {/* {formData.set("name", name)}
        {formData.set("description", description)}
        {formData.set("price", price)}
        {formData.set("stock", stock)}
        {formData.set("category", category)} */}
      </p>
    </Base>
  );
};

export default UpdateProduct;
