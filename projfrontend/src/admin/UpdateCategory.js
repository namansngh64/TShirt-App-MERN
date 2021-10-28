import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { getCategory, updateCategory } from "./helper/adminapicall";

const UpdateCategory = ({ match }) => {
  const { user, token } = isAuthenticated();

  const [name, setName] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);

  const preload = (categoryId) => {
    getCategory(categoryId).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setName(data.name);
        setError("");
      }
    });
  };

  useEffect(() => {
    preload(match.params.categoryId);
  }, []);

  const handleChange = (event) => {
    setError("");
    setName(event.target.value);
  };
  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    updateCategory(match.params.categoryId, user._id, token, { name }).then(
      (data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setError("");
          setName(data.name);
          setSuccess(true);
        }
      }
    );
  };

  const successMessage = () => {
    return (
      <div
        className="alert alert-success mt-3"
        style={{ display: success ? "" : "none" }}
      >
        <h4>{name} Updated Successfully</h4>
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

  const goBack = () => {
    return (
      <div className="mt-5">
        <Link className="btn btn-success btn-md mb-3" to="/admin/dashboard">
          Admin Home
        </Link>
      </div>
    );
  };

  return (
    <Base
      title="Update category here!"
      description="Welcome to category updation section"
      className="container bg-info p-4"
    >
      {errorMessage()}
      {successMessage()}
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          <form>
            <div className="form-group">
              <p className="lead">Enter the Updated category</p>
              <input
                type="text"
                className="form-control my-3"
                onChange={handleChange}
                value={name}
                autoFocus
                required
                placeholder="For Ex. Summer"
              />
              <button onClick={onSubmit} className="btn btn-outline-info ">
                Update Category
              </button>
            </div>
          </form>
          {goBack()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateCategory;
