import React,{useState,useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getUserCart ,emptyUserCart,saveUserAddress,applyCoupon,createCashOrderForUser} from "../functions/user";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const Checkout = ({history}) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [totalAfterDiscount, setTotalAfterDiscount] = useState("");
  const [discountError, setDiscountError] = useState("");
  const dispatch = useDispatch();
  const { user,COD} = useSelector((state) => ({ ...state }));
  const couponTrueOrFalse = useSelector((state) => state.coupon);
  useEffect(() => {
    getUserCart(user.token).then((res) => {
      console.log("user cart res", JSON.stringify(res.data, null, 4));
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, []);
  const emptyCart = () => {
    
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    
    emptyUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      setTotalAfterDiscount(0);
      setCoupon("");
      toast.success("Cart is empty. Contniue shopping.");
    });
  };

  const saveAddressToDb = () => {
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success("Address saved");
      }
    });
  };
  const applyDiscountCoupon = () => {
    console.log("send coupon to backend", coupon);
    
    applyCoupon(user.token, coupon).then((res) => {
      console.log("RES ON COUPON APPLIED", res.data);
      if (res.data) {
        setTotalAfterDiscount(res.data);
        dispatch({
          type: "COUPON_APPLIED",
          payload: true,
        });
      }
      if (res.data.err) {
        setDiscountError(res.data.err);
        dispatch({
          type: "COUPON_APPLIED",
          payload: false,
        });
      }
    });
  };

  const showAddress = () => (
    <>
      <ReactQuill theme="snow" value={address} onChange={setAddress} />
      <button className="btn btn-primary ml-3 mt-2" onClick={saveAddressToDb}>
        Save
      </button>
    </>
  );

  const showProductSummary = () =>
    products.map((p, i) => (
      <div key={i}>
        <p>
          {p.product.title} ({p.color}) x {p.count} ={" "}
          {p.product.price * p.count}
        </p>
      </div>
    ));

  const showApplyCoupon = () => (
    <>
      <input
        onChange={(e) => {setCoupon(e.target.value);
        setDiscountError("");}}
        value={coupon}
        type="text"
        className="form-control"
      />
      <button onClick={applyDiscountCoupon} className="btn btn-primary ml-3 mt-2">
        Apply
      </button>
    </>
  );
  const createCashOrder = () => {
    createCashOrderForUser(user.token, COD, couponTrueOrFalse).then((res) => {
      console.log("USER CASH ORDER CREATED RES ", res);
      
      if (res.data.ok) {
        
        if (typeof window !== "undefined") localStorage.removeItem("cart");
        
        dispatch({
          type: "ADD_TO_CART",
          payload: [],
        });
        
        dispatch({
          type: "COUPON_APPLIED",
          payload: false,
        });
        
        dispatch({
          type: "COD",
          payload: false,
        });
       
        emptyUserCart(user.token);
        
        setTimeout(() => {
          history.push("/user/history");
        }, 1000);
      }
    });
  };
  return (
    <div className="row">
      <div className="col-md-6">
      <br/>
        <h4>Delivery Address</h4>
        <br />
        <br />
        {showAddress()}
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        {showApplyCoupon()}
        <br />
        {discountError && <p className="bg-danger p-2">{discountError}</p>}
      </div>

      <div className="col-md-6">
      <br/>
        <h4>Order Summary</h4>
        <hr />
        <h6>Products-{products.length}</h6>
        <hr />
        {showProductSummary()}
        <hr />
        <h6>Cart Total: {total}</h6>
        {totalAfterDiscount > 0 && (
          <h6 className="bg-success p-2">
            Discount Applied: Total Payable: ${totalAfterDiscount}
          </h6>
        )}

        <div className="row mt-4">
          <div className="col-md-6">
            {COD ? (
              <button
                className="btn btn-primary"
                disabled={!addressSaved || !products.length}
                onClick={createCashOrder}
              >
                Place Order
              </button>
            ) : (
              <button
                className="btn btn-primary"
                disabled={!addressSaved || !products.length}
                onClick={() => history.push("/payment")}
              >
                Place Order
              </button>
            )}
          </div>

          <div className="col-md-6">
            <button className="btn btn-primary" disabled={!products.length}
              onClick={emptyCart}>Empty Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
