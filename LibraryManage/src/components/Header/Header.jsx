import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
//import { useOutletContext } from 'react-router-dom'; // only needed if you use context

function Header({ signup, setSignup , login,setLogin,library}) {
  // Option 1: If you want dynamic signup context
  const [isMobileMenuOpen, setIsMobileMenuOpen,time,settime] = useState(false);

const handleChange=(e)=>{
  e.preventDefault();
  localStorage.removeItem("token");
  setSignup(false);
  setLogin(false);
  settime(null);
}

const toggleMobileMenu = () => {
  setIsMobileMenuOpen(!isMobileMenuOpen);
}
  

  return (
    <div>
      <nav className='bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl border-b border-slate-700'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex justify-between items-center'>
            <div className='text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>
              LiBManage
            </div>

            {/* Mobile menu button */}
            <div className='md:hidden'>
              <button
                onClick={toggleMobileMenu}
                className='text-slate-300 hover:text-white focus:outline-none focus:text-white transition-colors duration-200'
              >
                <svg className='h-6 w-6 fill-current' viewBox='0 0 24 24'>
                  {isMobileMenuOpen ? (
                    <path fillRule='evenodd' d='M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z'/>
                  ) : (
                    <path fillRule='evenodd' d='M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z'/>
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop menu */}
            <div className='hidden md:flex items-center space-x-1'>
              <div>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `${isActive
                      ? "text-cyan-400 bg-slate-800 border-b-2 border-cyan-400"
                      : "text-slate-300 hover:text-white hover:bg-slate-700"
                    } px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105`
                  }
                >
                  About Us
                </NavLink>
              </div>

              {signup ? (
                <>
                  <div>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        `${isActive
                          ? "text-cyan-400 bg-slate-800 border-b-2 border-cyan-400"
                          : "text-slate-300 hover:text-white hover:bg-slate-700"
                        } px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105`
                      }
                    >
                      Home
                    </NavLink>
                  </div>
                  <div>
                    <NavLink
                      to="/stats"
                      className={({ isActive }) =>
                        `${isActive
                          ? "text-cyan-400 bg-slate-800 border-b-2 border-cyan-400"
                          : "text-slate-300 hover:text-white hover:bg-slate-700"
                        } px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105`
                      }
                    >
                      Stats
                    </NavLink>
                  </div>

                  {library?<div>
                    <NavLink
                      to="/library"
                      className={({ isActive }) =>
                        `${isActive
                          ? "text-cyan-400 bg-slate-800 border-b-2 border-cyan-400"
                          : "text-slate-300 hover:text-white hover:bg-slate-700"
                        } px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105`
                      }
                    >
                      Library
                    </NavLink>
                  </div>:null}
                  
                  
                   <div>
                    <NavLink
                      to="/books"
                      className={({ isActive }) =>
                        `${isActive
                          ? "text-cyan-400 bg-slate-800 border-b-2 border-cyan-400"
                          : "text-slate-300 hover:text-white hover:bg-slate-700"
                        } px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105`
                      }
                    >
                      Books
                    </NavLink>
                  </div>
                   <div>
                    <NavLink
                      to="/questionpaper"
                      className={({ isActive }) =>
                        `${isActive
                          ? "text-cyan-400 bg-slate-800 border-b-2 border-cyan-400"
                          : "text-slate-300 hover:text-white hover:bg-slate-700"
                        } px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105`
                      }
                    >
                      PYQS
                    </NavLink>
                  </div>
                  <div>
                    <NavLink
                      to="/others"
                      className={({ isActive }) =>
                        `${isActive
                          ? "text-cyan-400 bg-slate-800 border-b-2 border-cyan-400"
                          : "text-slate-300 hover:text-white hover:bg-slate-700"
                        } px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105`
                      }
                    >
                      Others
                    </NavLink>
                  </div>
                  <div>
                    <button 
                      onClick={handleChange} 
                      className="text-slate-300 hover:text-white hover:bg-slate-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                    >
                      Log Out
                    </button>
                  </div>
                </>
              ) : (
                <div>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        `${isActive
                          ? "text-cyan-400 bg-slate-800 border-b-2 border-cyan-400"
                          : "text-slate-300 hover:text-white hover:bg-slate-700"
                        } px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105`
                      }
                    >
                      Signup
                    </NavLink>
                  </div>
              )}
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden mt-4 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className='flex flex-col space-y-2'>
              <div>
                <NavLink
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `${isActive
                      ? "text-cyan-400 bg-slate-800 border-l-4 border-cyan-400"
                      : "text-slate-300 hover:text-white hover:bg-slate-700"
                    } block px-4 py-3 rounded-lg font-medium transition-all duration-200`
                  }
                >
                  About Us
                </NavLink>
              </div>

              {signup ? (
                <>
                  <div>
                    <NavLink
                      to="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `${isActive
                          ? "text-cyan-400 bg-slate-800 border-l-4 border-cyan-400"
                          : "text-slate-300 hover:text-white hover:bg-slate-700"
                        } block px-4 py-3 rounded-lg font-medium transition-all duration-200`
                      }
                    >
                      Home
                    </NavLink>
                  </div>
                  <div>
                    <NavLink
                      to="/stats"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `${isActive
                          ? "text-cyan-400 bg-slate-800 border-l-4 border-cyan-400"
                          : "text-slate-300 hover:text-white hover:bg-slate-700"
                        } block px-4 py-3 rounded-lg font-medium transition-all duration-200`
                      }
                    >
                      Stats
                    </NavLink>
                  </div>
                  <div>
                    {library?<div>
                    <NavLink
                      to="/library"
                      className={({ isActive }) =>
                        `${isActive
                          ? "text-cyan-400 bg-slate-800 border-b-2 border-cyan-400"
                          : "text-slate-300 hover:text-white hover:bg-slate-700"
                        } px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105`
                      }
                    >
                      Library
                    </NavLink>
                  </div>:null}
                  </div>
                   <div>
                    <NavLink
                      to="/books"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `${isActive
                          ? "text-cyan-400 bg-slate-800 border-l-4 border-cyan-400"
                          : "text-slate-300 hover:text-white hover:bg-slate-700"
                        } block px-4 py-3 rounded-lg font-medium transition-all duration-200`
                      }
                    >
                      Books
                    </NavLink>
                  </div>
                   <div>
                    <NavLink
                      to="/questionpaper"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `${isActive
                          ? "text-cyan-400 bg-slate-800 border-l-4 border-cyan-400"
                          : "text-slate-300 hover:text-white hover:bg-slate-700"
                        } block px-4 py-3 rounded-lg font-medium transition-all duration-200`
                      }
                    >
                      PYQS
                    </NavLink>
                  </div>
                   <div>
                    <NavLink
                      to="/others"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `${isActive
                          ? "text-cyan-400 bg-slate-800 border-l-4 border-cyan-400"
                          : "text-slate-300 hover:text-white hover:bg-slate-700"
                        } block px-4 py-3 rounded-lg font-medium transition-all duration-200`
                      }
                    >
                      Others
                    </NavLink>
                  </div>
                  <div>
                    <button 
                      onClick={(e) => {
                        handleChange(e);
                        setIsMobileMenuOpen(false);
                      }} 
                      className="text-slate-300 hover:text-white hover:bg-slate-700 block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200"
                    >
                      Log Out
                    </button>
                  </div>
                </>
              ) : (
                <div>
                    <NavLink
                      to="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `${isActive
                          ? "text-cyan-400 bg-slate-800 border-l-4 border-cyan-400"
                          : "text-slate-300 hover:text-white hover:bg-slate-700"
                        } block px-4 py-3 rounded-lg font-medium transition-all duration-200`
                      }
                    >
                      Signup
                    </NavLink>
                  </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;