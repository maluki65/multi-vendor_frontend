import { useState } from 'react'
import './App.css'
import{ Navigate, useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollToHashElement from './components/scrollToHashElemet';
import { Home, Contact, SignIn, SignUp } from './pages';
import { NotFound } from './components';
import ProtectedRoute from './Hooks/ProtectedRoute';
import { useAuth, AuthProvider } from './Context/AuthContext';


function AnimatedRoutes () {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes 
       location={location} 
       key={location.pathname}
      >
        <Route path='/' element={<Home/>} />
        <Route path='/signin' element={<SignIn/>} />
        <Route path='/register' element={<SignUp/>} />
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
