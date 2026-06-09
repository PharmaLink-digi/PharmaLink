import React, { useState } from "react";
import MedicineDetails from "./MedicineDetails/MedicineDetails";
import Cart from "./Cart/Cart";
import ConfirmOrder from "./ConfirmOrder/ConfirmOrder";

function App() {
  const [view, setView] = useState("details"); // 'details' | 'cart' | 'confirm'
  const [cartItems, setCartItems] = useState([]);
  
  // Custom states to pass down selected info to checkout
  const [orderDetails, setOrderDetails] = useState({
    address: "",
    phone: "",
    notes: "",
    paymentMethod: "cash", // 'cash' | 'visa'
    visaDetails: {
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: ""
    }
  });

  const addToCart = (medication, pharmacy, record) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.inventory_id === record.inventory_id
      );

      if (existingItemIndex > -1) {
        // Increment quantity if already in cart
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += 1;
        return newItems;
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            inventory_id: record.inventory_id,
            medication_name: medication,
            pharmacy_name: pharmacy.pharm_name || `Pharmacy #${record.pharm_id}`,
            pharmacy_area: pharmacy.area || "Heliopolis",
            price_sell: record.price_sell,
            quantity: 1,
            pharm_id: record.pharm_id,
            delivery_fee: 50 + (record.pharm_id * 5) // realistic delivery fee
          }
        ];
      }
    });
  };

  const updateCartQuantity = (inventoryId, change) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.inventory_id === inventoryId) {
            const newQty = item.quantity + change;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (inventoryId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.inventory_id !== inventoryId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <div className="app-container">
      {view === "details" && (
        <MedicineDetails
          cartItems={cartItems}
          cartCount={getCartCount()}
          addToCart={addToCart}
          onNavigateToCart={() => setView("cart")}
        />
      )}

      {view === "cart" && (
        <Cart
          cartItems={cartItems}
          updateCartQuantity={updateCartQuantity}
          removeFromCart={removeFromCart}
          onNavigateBack={() => setView("details")}
          onCheckout={() => setView("confirm")}
        />
      )}

      {view === "confirm" && (
        <ConfirmOrder
          cartItems={cartItems}
          orderDetails={orderDetails}
          setOrderDetails={setOrderDetails}
          onNavigateBack={() => setView("cart")}
          onOrderPlaced={() => {
            clearCart();
            setView("details");
          }}
        />
      )}
    </div>
  );
}

export default App;
