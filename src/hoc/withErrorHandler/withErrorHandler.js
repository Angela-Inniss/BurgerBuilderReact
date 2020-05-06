import React, { useState, useEffect } from "react";
import Modal from "../../components/UI/Modal/Modal";
import Aux from "../Aux";

const withErrorHandler = (WrappedComponent, axios) => {
  return props => {
    const [error, setError] = useState(null);

    const requestInterceptor = axios.interceptors.request.use(req => {
      setError(null);
      return req;
    });

    const responseInterceptor = axios.interceptors.response.use(
      res => res,
      err => {
        setError(err);
      }
    );
    // clean up function like componenet will unmount
    useEffect(() => {
      return () => {
        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.request.eject(responseInterceptor);
      };
    }, [requestInterceptor, responseInterceptor]);

    const errorConfirmedHandler = () => {
      setError(null);
    };

    return (
      <Aux>
        <Modal
          modalClosed={errorConfirmedHandler}
          show={error}
          showBackdrop={error}
        >
          {error ? error.message : null}
        </Modal>

        <WrappedComponent {...props} />
      </Aux>
    );
  };
};
export default withErrorHandler;
// this is a higher order component
// this wraps another component
//
