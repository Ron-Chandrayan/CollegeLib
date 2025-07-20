import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
//import { useOutletContext } from 'react-router-dom'; // only needed if you use context

function Header({ signup, setSignup }) {
  // Option 1: If you want dynamic signup context


  

  return (
    <div>
      <nav className='bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl border-b border-slate-700'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex flex-wrap justify-between items-center'>
            <div className='text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>
              LiBManage
            </div>

            <div className='flex items-center space-x-1'>
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
                  About Us
                </NavLink>
              </div>

              {signup ? (
                <>
                  <div>
                    <NavLink
                      to="/home"
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
                </>
              ) : (
                <div>
                    <NavLink
                      to="/home"
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
        </div>
      </nav>
    </div>
  );
}

export default Header;
