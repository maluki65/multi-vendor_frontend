import React, { useState, useEffect } from 'react';
import './navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBarsStaggered, FaXmark } from 'react-icons/fa6';
import { CiUser } from "react-icons/ci";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname + location.hash;

  const handleLogIn = () => {
    navigate('/signin');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleHamburgerClick = () => {
    setMenuOpen(prev => !prev);
    setIsOpen(prev => !prev);
  };

  const closeNavBar = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handelScroll = () => {
      setSticky(window.scrollY > 0);
    };
    window.addEventListener('scroll', handelScroll);
    return () => window.removeEventListener('scroll', handelScroll);
  }, []);

  useEffect(() => {
    const links = document.querySelectorAll('.PageLinks');
    links.forEach(link => {
      link.addEventListener('click', closeNavBar);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', closeNavBar);
        //setIsOpen(false);
      });
    }
  }, []);

  useEffect(() => {
    if(location.hash){
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  }, [location]);

  const Navlinks = [
    { name: 'Home', link: '/'},
    { name: 'About', link: '#About' },
    { name: 'Products', link: '#Products' },
    { name: 'Blogs', link: '/Blog' },
    { name: 'Contact', link: '#Contact' }
  ]

  const fullNav = menuOpen ? [
    ...Navlinks,
    { name: 'Sign In', link: '/signin' },
    { name: 'Get started', link: '/register' }
  ]
  : Navlinks;

  return (
    <>
      <div className={`sticky py-2.5 px-[3%] flex items-center  justify-between top-0 z-1000 w-full transition-all duration-300  ${sticky ? 'backdrop-blur-[20px] bg-[#ebe7e7]' : 'bg-white'} navbar`}>
        <div className='logo'>
          <h1 className='text-dark text-[1.2em] font-semibold'>
            Multi-Vendor
          </h1>
        </div>

        <div className={`navlinks ${menuOpen ? 'open' : ''}`}>
          <ul className='list-none flex'>
            {fullNav.map((item, index) => {
              const isActive = currentPath === item.link || location.pathname === item.link;

              return (
                <li key={index}>
                  <Link
                    to={item.link}
                    className={`PageLinks font-sans ${isActive ? 'text-secondary' : ''} ${item.name === 'Sign In'  ? 'font-semibold text-dark border border-dark px-2 py-2 rounded-md w-full' : 'text-dark'} ${ item.name === 'Get started' ? 'bg-primary text-light px-2 py-2 rounded-md ' : 'text-dark'} ml-[1.2rem] duration-300 text-dark ease-in-out text-base`}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className='flex gap-3 items-center Sign'>
          <a 
           className='text-dark cursor-pointer font-semibold flex items-center gap-1 regBtn'
           onClick={handleLogIn}
           > 
           <CiUser strokeWidth={1} />
            Sign In
          </a>
          <button 
           className='px-3 py-2 bg-primary cursor-pointer text-light rounded-md regBtn'
           onClick={handleRegister}
           >
           Get Started
          </button>
        </div>

        <div className={`hamburger ${isOpen ? 'open' : ''}`} id='hambuger' onClick={handleHamburgerClick}>
          {isOpen ? <FaXmark/> : <FaBarsStaggered/> }
        </div>
      </div>
    </>
  )
}

export default Navbar