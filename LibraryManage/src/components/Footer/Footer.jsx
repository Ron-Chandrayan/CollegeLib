import React from 'react'
import { NavLink , Link } from 'react-router-dom'

function Footer({ signup, setSignup , login,setLogin,library,time,settime,timer,settimer,front}) {

  const handleChange=(e)=>{
  e.preventDefault();
  localStorage.removeItem("token");
  setSignup(false);
  setLogin(false);
  settime(null);
  settimer(null);
}
  
  return (
   <div>
      <footer className='bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl border-t border-slate-700'>
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Brand Section */}
            <div>
              <h3 className='text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4'>
                LiBManage
              </h3>
              <p className='text-slate-300 text-sm leading-relaxed'>
                Modern library management system for tracking student presence and managing library operations efficiently.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className='text-white font-semibold mb-4'>Quick Links</h4>
              <ul className='space-y-2'>
                <li>
                  <NavLink to="/" className='text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm'>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/stats" className='text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm'>
                    Statistics
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" className='text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm'>
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/" className='text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm'>
                    Contact
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className='text-white font-semibold mb-4'>Contact</h4>
              <div className='space-y-2 text-sm'>
                <p className='text-slate-300'><a href='https://siesgst.edu.in/library' target='_main' className='text-slate-300'>Official Library</a></p>
                <p className='text-slate-300'>+91 7304726116 | +91 8828401969</p>
                <p className='text-slate-300'>SIES GST</p>
                <p className='text-slate-300'>Nerul, Navi Mumbai</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className='border-t border-slate-700 mt-8 pt-6'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <p className='text-slate-400 text-sm'>
                © 2025 LiBManage. All rights reserved.
              </p>
               <p className='text-slate-400 text-sm'>
                Made with ❤️ for SIES GST
              </p>
              <div className='flex space-x-6 mt-4 md:mt-0'>
                <NavLink to="#" className='text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm'>
                  Privacy Policy
                </NavLink>
                <NavLink to="#" className='text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm'>
                  Terms of Service
                </NavLink>
                <NavLink to="#" className='text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm'>
                  Support
                </NavLink>
                <div>
                    <button 
                      onClick={handleChange} 
                      className='text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm'
                    >
                      Log Out
                    </button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
 
