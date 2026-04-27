import { useState } from 'react';
import './App.css';
import{ Navigate, useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollToHashElement from './components/scrollToHashElemet';
import { Home, Contact, SignIn, SignUp, Dashboard } from './pages';
import { NotFound, BuyerLayout, BuyerDashboard, Cart, Profile, Wishlist, Products, ProductDetails, Checkout, CheckoutDetails, Account, Blogs, Contacts } from './components';
import ProtectedRoute from './Hooks/ProtectedRoute';
import { AuthProvider } from './Context/AuthContext';

function AnimatedRoutes () {
  const location = useLocation();

  /*if (loading) {
    return <WLoader />; //null
  }*/

  return (
    <AnimatePresence mode='wait'>
      <Routes 
       location={location} 
       key={location.pathname}
      >
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />

        <Route element={<ProtectedRoute allowedRoles={['Admin', 'Vendor']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Buyer']} />}>
          <Route path='/buyer' element={<BuyerLayout />}>
            <Route index element={<BuyerDashboard />} />
            <Route path='dashboard' element={<BuyerDashboard />} />
            <Route path='profile' element={<Profile />} />
            <Route path='wishlist' element={<Wishlist />} />
            <Route path='cart' element={<Cart />} />
            <Route path='Products' element={<Products/>} />
            <Route path='products/:slugId' element={<ProductDetails />} />
            <Route path='checkout' element={<Checkout />} />
            <Route path='checkout/:sessionId' element={<CheckoutDetails />} />
            <Route path='account' element={<Account/>} />
            <Route path='blogs' element={<Blogs/>} />
            <Route path='contacts' element={<Contacts/>} />
          </Route>
        </Route>

        {/*<Route element={<ProtectedRoute allowedRoles={['Buyer']} />}>
          <Route
            path="/buyer"
            element={
              <BuyerLayout>
                <BuyerDashboard />
              </BuyerLayout>
            }
          />
        </Route>*/}
        {/*<Route element={<ProtectedRoute/>}>
          <Route path='/dashbord' element{<Dahboard/>}/>
          <Route path='/profile' element{<Profile/>}/>
        </Route>*/}
        <Route path='/contact' element={<Contact/>} />
        <Route path='*' element={<NotFound/>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <motion.div
          initial = {{ opacity: 0, y: 40 }}
          animate = {{ opacity: 1, y: 0 }}
          transition = {{ duration: 0.9 }}
        >
          <ScrollToHashElement/>
          <AnimatedRoutes/>
        </motion.div>
      </Router>
    </AuthProvider>
  );
}

export default App
