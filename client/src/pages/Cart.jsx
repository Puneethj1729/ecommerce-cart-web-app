import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import ProductCardInCheckout from "../components/cards/ProductCardInCheckout";
import { userCart } from "../functions/user";
const Cart = ({history}) => {
  const { cart, user } = useSelector((state) => ({ ...state }))
  const dispatch = useDispatch()

  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price
    }, 0)
  }
  const saveOrderToDb = () => {
    userCart(cart, user.token)
      .then((res) => {
        console.log("CART POST RESPONSE", res);
        if (res.data.ok) history.push("/checkout");
      })
      .catch((err) => console.log("cart save err", err));
  }
  const saveCashOrderToDb = () => {
    
    dispatch({
      type: "COD",
      payload: true,
    });
    userCart(cart, user.token)
      .then((res) => {
        console.log("CART POST RES", res);
        if (res.data.ok) history.push("/checkout");
      })
      .catch((err) => console.log("cart save err", err));
  };
  const showCartItems = () => (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th className="h6" scope="col">Image</th>
          <th className="h6" scope="col">Title</th>
          <th className="h6" scope="col">Price</th>
          <th className="h6" scope="col">Brand</th>
          <th className="h6" scope="col">Color</th>
          <th className="h6" scope="col">Count</th>
          <th className="h6" scope="col">Shipping</th>
          <th className="h6" scope="col">Remove</th>
        </tr>
      </thead>

      {cart.map((p) => (
        <ProductCardInCheckout key={p._id} p={p} />
      ))}
    </table>
  );
  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-md-8">
          <h4>Cart / {cart.length} Products</h4>

          {!cart.length ? (
            <p>
              No products in cart. <Link to="/shop">Continue Shopping.</Link>
            </p>
          ) : (
            showCartItems()
          )}
        </div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          <p className="h6">Products</p>
          {cart.map((c, i) => (
            <div key={i}>
              <p className="h6">
                {c.title} x {c.count} = ${c.price * c.count}
              </p>
            </div>
          ))}
          <hr />
          <span className="h6">
            Total: <b>${getTotal()}</b>
          </span>
          <hr />
          {user ? (
            <>
              <button
                onClick={saveOrderToDb}
                className="btn btn-sm btn-primary mt-3"
                disabled={!cart.length}
              >
                Proceed to Checkout
              </button>
              <br />
              <button
                onClick={saveCashOrderToDb}
                className="btn btn-sm btn-success mt-3"
                disabled={!cart.length}
              >
                Pay Cash on Delivery
              </button>
            </>
          ) : (
            
              <Link
                to={{
                  pathname: '/login',
                  state: { from: 'cart' },
                }}
                className="btn btn-sm btn-primary mt-2"
              >
                Login to Checkout
              </Link>
            
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart
