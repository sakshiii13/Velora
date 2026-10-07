import React from "react";
import "./App.css";
import { RouterPage } from "./component/RouterPage";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext"; 
import Navigations from "./navigations/Navigations";
import { useAuth } from "./context/AuthContext";
import PageLoader from "./component/ui/PageLoader";

function App() {
  const { loading, isAuthReady } = useAuth();
  return (
    <>
    {loading && <PageLoader />}
    {isAuthReady && <Navigations />}
    </>
  );
}

export default App;