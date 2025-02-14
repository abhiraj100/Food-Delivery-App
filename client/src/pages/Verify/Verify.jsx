import React, { useContext, useEffect } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext.jsx";
import axios from "axios";

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();
  console.log(url);

  const verifyPayment = async () => {
    const response = await axios.post(
      `${url}/api/order/verify`,
      {
        success,
        orderId,
      },
      {
        headers: {
          token,
        },
      }
    );
    if (response.data.success) {
      navigate("/myorders");
    } else {
      navigate("/");
    }
  };

  // const verifyPayment = async () => {
  //   try {
  //     const response = await axios.post(`${url}/api/order/verify`, {
  //       success,
  //       orderId,
  //     });

  //     if (response.data.success) {
  //       navigate("/myorders");
  //     } else {
  //       navigate("/");
  //     }
  //   } catch (error) {
  //     console.error("Payment verification error:", error);
  //     navigate("/"); // Ensure navigation even on failure
  //   }
  // };

  useEffect(() => {
    if (success !== null && orderId !== null) {
      verifyPayment();
    }
  }, [success, orderId]);

  // console.log(success, orderId);  // for verification purpose
  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
