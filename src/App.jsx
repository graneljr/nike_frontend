import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
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
import { toast } from "sonner";
import {
  blockEmojiDrop,
  blockEmojiInput,
  blockEmojiPaste,
} from "./lib/inputGuard";
function App() {
  const [cart, setCart] = useState([]);
  const [userData, setUserData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [cartOwnerId, setCartOwnerId] = useState(null);
  useEffect(() => {
    applyDisplaySettings(getDisplaySettings());
    const getCurrentUser = async () => {
      try {
        const response = await api.get("/auth/me");

        setUserData(response.data.userData);
      } catch (error) {
        setUserData(null);
      } finally {
        setAuthChecked(true);
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    if (!userData?._id) {
      setCartOwnerId(null);
      return;
    }

    let active = true;
    const loadCart = async () => {
      try {
        const response = await api.get("/cart");
        if (active) setCart(response.data.items || []);
      } catch (error) {
        // Keep the in-memory cart available if the cart service cannot be reached.
      } finally {
        if (active) setCartOwnerId(userData._id);
      }
    };

    setCartOwnerId(null);
    loadCart();
    return () => {
      active = false;
    };
  }, [authChecked, userData]);

  useEffect(() => {
    if (!userData?._id || cartOwnerId !== userData._id) return;

    api.put("/cart", {
      items: cart.map((item) => ({
        productId: item._id || item.id,
        size: item.size,
        quantity: item.quantity,
        selected: item.selected !== false,
      })),
    }).catch(() => {
      // Cart changes remain usable in memory if the API is temporarily unavailable.
    });
  }, [cart, cartOwnerId, userData]);

  function getAvailableQuantity(product, size) {
    const variants = product.sizes || product.size || [];
    const variant = variants.find((entry) =>
      String(entry.label ?? entry.size) === String(size),
    );
    return variant?.quantity == null ? null : Number(variant.quantity);
  }

  function addToCart(product, size, quantity) {
    if (!userData?._id) return "login-required";

    const available = getAvailableQuantity(product, size);
    const existingItem = cart.find(
      (item) => item.id === product.id && item.size === size,
    );
    const nextQuantity = (existingItem?.quantity || 0) + quantity;

    if (available !== null && nextQuantity > available) return false;

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity, selected: true }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, size, quantity, selected: true }]);
    }
    return true;
  }

  function updateQuantity(id, size, change) {
    setCart(
      cart.map((item) =>
        item.id === id && item.size === size
          ? {
              ...item,
              quantity: Math.min(
                getAvailableQuantity(item, size) ?? Number.POSITIVE_INFINITY,
                Math.max(1, item.quantity + change),
              ),
            }
          : item,
      ),
    );
  }

  function removeFromCart(id, size) {
    const itemToRemove = cart.find((item) => item.id === id && item.size === size);
    setCart(cart.filter((item) => !(item.id === id && item.size === size)));
    if (itemToRemove) toast.success(`${itemToRemove.name} removed from cart.`);
  }

  function setItemSelected(id, size, selected) {
    setCart((items) => items.map((item) =>
      item.id === id && item.size === size ? { ...item, selected } : item,
    ));
  }

  function setAllItemsSelected(selected) {
    setCart((items) => items.map((item) => ({ ...item, selected })));
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
  <div
    className="contents"
    onBeforeInputCapture={blockEmojiInput}
    onPasteCapture={blockEmojiPaste}
    onDropCapture={blockEmojiDrop}
  >
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
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />

        <Route
          path="/product/:id"
          element={
            <ProductDetails
              addToCart={addToCart}
              isAuthenticated={Boolean(userData?._id)}
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
              setItemSelected={setItemSelected}
              setAllItemsSelected={setAllItemsSelected}
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
          path="/admin/dashboard"
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
  </div>
  );
}

export default App;
