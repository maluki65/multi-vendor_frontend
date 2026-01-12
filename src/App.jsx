import { useState } from 'react'
import './App.css'
import{ Navigate, useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollToHashElement from './components/scrollToHashElemet';
import { Home, Contact, SignIn, SignUp, Dashboard } from './pages';
import { NotFound, WLoader } from './components';
import ProtectedRoute from './Hooks/ProtectedRoute';
import { useAuth, AuthProvider } from './Context/AuthContext';


function AnimatedRoutes () {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  /*if (loading) {
    return <WLoader />; //null
  }*/

  return (
    <AnimatePresence mode='wait'>
      <Routes 
       location={location} 
       key={location.pathname}
      >
        <Route path='/' element={<Home/>} />
        <Route path='/register' element={!isAuthenticated ? <SignUp/> : <Navigate to='/dashboard'/>}/>
        <Route path='/signin' element={!isAuthenticated ?<SignIn/>  : <Navigate to='/dashboard'/>}/>
        <Route path='/dashboard' element={isAuthenticated ? <Dashboard/> : <Navigate to='/signin'/>}/>
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
