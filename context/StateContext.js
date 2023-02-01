import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setshowCart] = useState(false);
  const [cartItems, setcartItems] = useState([]);
  const [totalPrice, settotalPrice] = useState(0);
  const [totalQuantities, settotalQuantities] = useState(0);
  const [quantity, setquantity] = useState(1);

  let foundProduct;
  let index;

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );

    settotalPrice(
      (prevsTotalPrice) => prevsTotalPrice + product.price * quantity
    );
    settotalQuantities(
      (prevsTotalQuantities) => prevsTotalQuantities + quantity
    );

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
      });

      setcartItems(updatedCartItems);
    } else {
      product.quantity = quantity;

      setcartItems([...cartItems, { ...product }]);
    }
    toast.success(`${quantity} ${product.name} added to the cart.`);
  };

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);

    settotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    );

    settotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );

    setcartItems(newCartItems);
  };

  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    index = cartItems.findIndex((product) => product._id === id);
    // const newCartItems = cartItems.filter((item) => item._id !== id);
    const newCartItems = [...cartItems];

    if (value === "inc") {
      // setcartItems([
      //   ...newCartItems,
      //   { ...foundProduct, quantity: foundProduct.quantity + 1 },
      // ]);

      newCartItems[index].quantity += 1;
      setcartItems([...newCartItems]);
      settotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      settotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === "dec") {
      if (foundProduct.quantity > 1) {
        newCartItems[index].quantity -= 1;
        // setcartItems([
        //   ...newCartItems,
        //   { ...foundProduct, quantity: foundProduct.quantity - 1 },
        // ]);
        setcartItems([...newCartItems]);
        settotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        settotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };

  const incQty = () => {
    setquantity((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setquantity((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setshowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        quantity,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
        setcartItems,
        settotalPrice,
        settotalQuantities,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
