import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import api from "./middleware/apiMiddleware";
import Dashboard from "./pages/Dashboard";
import { applyDisplaySettings, getDisplaySettings } from "./lib/displaySettings";
import DashboardLayout from "./layout/DashboardLayOut";
import PublicLayout from "./layout/PublicLayOut";
import PayOrder from "./pages/PayOrder";
function App() {
  const [cart, setCart] = useState([]);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    applyDisplaySettings(getDisplaySettings());
    const getCurrentUser = async () => {
      try {
        const response = await api.get("/auth/me");

        setUserData(response.data.userData);
      } catch (error) {
        console.log("Not logged in");
        setUserData(null);
      }
    };

    getCurrentUser();
  }, []);

  function addToCart(product, size, quantity) {
    const existingItem = cart.find(
      (item) => item.id === product.id && item.size === size,
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, size, quantity }]);
    }
  }

  function updateQuantity(id, size, change) {
    setCart(
      cart.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      ),
    );
  }

  function removeFromCart(id, size) {
    setCart(cart.filter((item) => !(item.id === id && item.size === size)));
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
  <Routes>
    
      <Route
        element={
          <PublicLayout
            cartCount={cartCount}
            userData={userData}
          />
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />

        <Route
          path="/product/:id"
          element={
            <ProductDetails
              addToCart={addToCart}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          }
        />

        <Route path="/register" element={<Register />} />

        <Route
          path="/login"
          element={
            <Login
              setUserData={setUserData}
            />
          }
        />
      </Route>

   
      <Route element={<DashboardLayout userData={userData}/>}>
        <Route
          path="/dashboard"
          element={<Dashboard userData={userData} />}
        />
         <Route
          path="/profile"
          element={<Dashboard userData={userData} setUserData={setUserData} />}
        />
          <Route
          path="/settings"
          element={<Dashboard userData={userData} />}
        />
        <Route path="/orders" element={<Dashboard userData={userData} />} />
        <Route path="/view_orders" element={<Dashboard userData={userData} />} />
        <Route path="/stocks" element={<Dashboard userData={userData} />} />
        <Route path="/users" element={<Dashboard userData={userData} />} />
      </Route>
         <Route path="/pay/:orderId" element={<PayOrder />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
