import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import Searching from '../Seaching/Searching'
// import StudentGrid from '../StudentGrid/StudentGrid';
import Student from '../Student/Student';
import { toast } from 'react-toastify'; // ✅ Import toast
import 'react-toastify/dist/ReactToastify.css'; // ✅ Ensure CSS is loaded
import { getApiUrl, getApiHeaders, getLibraryApiUrl, getLibraryApiHeaders, debugApiConfig } from '../../utils/apiConfig';

// Glorified Entry/Exit Notification Component
const EntryExitNotification = ({ notifications }) => {
  return (
    <div className="flex-1 ml-4">
      <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-md backdrop-blur-sm h-16 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2 shadow-inner">
                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-gray-600 font-medium">Waiting for activity...</p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {notifications.slice(0, 1).map((notification, index) => (
                <div 
                  key={index}
                  className={`w-full h-full relative overflow-hidden rounded-md px-3 py-2 transition-all duration-300 transform hover:scale-105 shadow-sm flex items-center justify-center gap-2 ${
                    notification.type === 'entry' 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                      : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200'
                  }`}
                >
                  {/* Status indicator */}
                  <div className={`w-2 h-2 rounded-full shadow-sm ${
                    notification.type === 'entry' ? 'bg-green-500 animate-ping' : 'bg-red-500 animate-ping'
                  }`}></div>
                  
                  {/* Icon */}
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${
                    notification.type === 'entry' 
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                      : 'bg-gradient-to-br from-red-400 to-pink-500'
                  }`}>
                    <svg className={`w-2.5 h-2.5 text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {notification.type === 'entry' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                      )}
                    </svg>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 text-center">
                    <p className={`text-xs font-bold truncate ${
                      notification.type === 'entry' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {notification.studentName}
                    </p>
                    <p className="text-xs text-gray-600 font-medium">
                      {notification.type === 'entry' ? '🌟 Welcome!' : '👋 Thank you!'}
                    </p>
                  </div>
                  
                  {/* Time badge */}
                  <div className={`px-1 py-0.5 rounded-full text-xs font-bold ${
                    notification.type === 'entry' 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-red-200 text-red-800'
                  }`}>
                    {notification.time}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function Library() {
 const { name,setname,totalfootfall,todayfootfall } = useOutletContext();
  const[student, setStudent]=useState([])
  const[flag,setflag]=useState();
  const[search,setsearch]=useState("");
      const[filter,setFilter]= useState("");
  const[disable,setdisable]=useState(true);
  const[loading,setloading]=useState(false);
  const[clock,setclock]=useState();
  const [notifications, setNotifications] = useState([]);
  const [formData, setformData] = useState({
    PRN: '',
    purpose: 'Study'
  });

  // Add ref for PRN input auto-focus
  const prnInputRef = useRef(null);

  // Auto-focus PRN input when component mounts
  useEffect(() => {
    if (prnInputRef.current) {
      prnInputRef.current.focus();
    }
  }, []);

  // Timeout effect for notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1)); // Remove the oldest notification
      }, 3500);
      
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  useEffect(()=>{
    const fetchtime=()=>{
      const time = (new Date()).toLocaleTimeString()
      setclock(time);

    }
    const interval= setInterval( fetchtime , 1000);
   
         return () => clearInterval(interval);
  },[])

  //console.log(name);
  useEffect(() => {
          const checkTime = () => {
            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();
  
            // 17:35 in 24-hour format = 5:35 PM
            if (((currentHours > 17 || (currentHours === 17 && currentMinutes >= 30)) )||(currentHours<8 || (currentHours === 8 && currentMinutes <= 15))) {
              setdisable(false);
            } else {
              setdisable(true);
            }
          };
  
          checkTime(); // Check immediately
          const interval = setInterval(checkTime, 60 * 1000); // Recheck every minute
  
          return () => clearInterval(interval); // Clean up on unmount
      }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData((prev) => ({
      ...prev,
      [name]: name === 'PRN' ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const payload={
        PRN:formData.PRN,
        purpose:formData.purpose
      }
      
      setformData({
          PRN: '',
          purpose: 'Study'
        })

      const res = await fetch('/submit', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success===true) {
        toast.success(data.message || "Student inserted!");
        
        // Notification now handled by name-diff effect
      } else {
        toast.error(data.message || "Something went wrong");
      }

      setflag(prev => !prev);

      


    //       const resp = await fetch("https://libman.ethiccode.in.net/api/in_out", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "XApiKey": "4rnWNLFd3I5sh4jMiP3BKnhOnxtPJ2sPcQRT4tplQK0",  
    //   },
    //   body: JSON.stringify(payload),
    // });

    try {
      const resp = await fetch(getLibraryApiUrl('in_out'), {
        method: 'POST',
        headers: getLibraryApiHeaders(),
        body: JSON.stringify(payload),
      });

    const data2=await resp.json();
    console.log(data2);
    // toast.success("koha pe jarha");
      
    } catch (error) {
      console.error(error.message);
      toast.error("Student not recorded");
    }
    

    
    } catch (error) {
      toast.error("Network error"); 
    }
  };

  const handleSubmit2=async (e)=>{
    e.preventDefault();
    setloading(true);

    try {
      console.log("so you are the entity huh");
    const res = await fetch('/remove', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(name)
      });

    const data = await res.json()
    console.log(data);
    if(data.message==="success"){
      toast.success("All Students deleted");
    }else{
      toast.error("student can't be deleted");
    }
      
    } catch (error) {
      toast.error("Something went wrong")
    }finally{
      setloading(false)
    }
    
    
    
  }

  // const fetchData = async () => {
  //   try {
  //     const response = await fetch('/fetch');
  //     const data = await response.json();
  //     setStudent(data);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  //   const interval = setInterval(fetchData, 1000);
  //       return () => clearInterval(interval);
  // }, []);

  return (
    <> <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-500">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-8 mb-8">
        <form className="space-y-6" >
          <div className="flex flex-col md:flex-row gap-4">
            <input
              ref={prnInputRef}
              type="text"
              name="PRN"
              placeholder="Enter PRN"
              value={formData.PRN}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-500 bg-white"
            />
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="" hidden>Select purpose</option>
              <option value="Study">Study</option>
              <option value="Circulation">Circulation</option>
              <option value="Internet Search">Internet Search</option>
              <option value="No due Clearance">No due Clearance</option>
              <option value="Photo Copy/Printing">Photo Copy/Printing</option>
              <option value="Project Work">Project Work</option>
              <option value="Question Paper">Question Paper</option>
              <option value="Project Work">Reading Newspaper</option>
              <option value="Reference Book/Periodical">Reference Book/Periodical</option>
              


    
            </select>
          </div>

          <div className='flex flex-row justify-between items-center'>
             <button
            // type="submit"
            onClick={handleSubmit}
            className="px-6 py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
           >
            Enter/Out
           </button>

           <div className="text-center">
             <h1 className="text-xl font-bold text-white mb-1">List of Users in</h1>
             <h2 className="text-lg font-semibold text-blue-500">SIES Graduate School of Technology</h2>
           </div>

           <button
                    disabled={disable || loading===true}
                    onClick={handleSubmit2}
                    className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 shadow-lg ${
                      (disable || loading===true)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 cursor-pointer"
                    }`}
                  >
                    {loading?"Loading":"Remove all"}
                  </button>

          </div>
          
        </form>
      </div>

      {/* Flash Messages Area */}
      <div className="mb-4">
        <div id="toast-container" className="fixed top-4 right-4 z-50"></div>
      </div>

      {/* Main Content Grid */}
      <div className="bg-gradient-to-br from-slate-900 to-gray-500 grid grid-cols-12 gap-6">
        
        {/* Current Students Card - Smaller */}
        <div className="col-span-2 space-y-4">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-4 rounded-xl shadow-lg border border-slate-200/50 h-fit">
            <div className="bg-white rounded-lg shadow-md p-3 border border-slate-200/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="bg-blue-100 p-1.5 rounded-lg">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-xs text-gray-600 font-medium mb-1">Current Members</p>
              <p className="text-center text-xl font-bold text-blue-600">{name.length}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-4 rounded-xl shadow-lg border border-slate-200/50 h-fit">
            <div className="bg-white rounded-lg shadow-md p-3 border border-slate-200/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="bg-blue-100 p-1.5 rounded-lg">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-xs text-gray-600 font-medium mb-1">Time</p>
              <p className="text-center text-xl font-bold text-blue-600">{clock}</p>
            </div>
          </div>
        </div>

        {/* Main Students Section - Wider */}
        <div className="col-span-8">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl shadow-lg border border-slate-200/50">
            {/* Search and Notification Bar */}
            <div className="flex items-start justify-between gap-4 mb-4">
              {/* Entry/Exit Notification Component */}
              <EntryExitNotification notifications={notifications} />
              
              {/* Small Search Component */}
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200/50 h-16">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    onChange={(e) => setsearch(e.target.value)} 
                    value={search}
                    className="w-32 pl-6 pr-2 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-700 bg-transparent"
                  />
                </div>
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)} 
                  className="px-2 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-transparent cursor-pointer"
                >
                  <option value="name">Name</option>
                  <option value="PRN">PRN</option>
                </select>
              </div>
            </div>
            <Searching search={search} filter={filter} name={name} />
          </div>
        </div>

        {/* Footfall Statistics - Smaller and Stacked */}
        <div className="col-span-2 space-y-4">
          {/* Total Footfall Card - Smaller */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-4 rounded-xl shadow-lg border border-slate-200/50">
            <div className="bg-white rounded-lg shadow-md p-3 border border-slate-200/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="bg-emerald-100 p-1.5 rounded-lg">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-xs text-gray-600 font-medium mb-1">Total Footfall</p>
              <p className="text-center text-lg font-bold text-emerald-600">{totalfootfall}</p>
            </div>
          </div>

          {/* Today's Footfall Card - Smaller */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-4 rounded-xl shadow-lg border border-slate-200/50">
            <div className="bg-white rounded-lg shadow-md p-3 border border-slate-200/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="bg-orange-100 p-1.5 rounded-lg">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-xs text-gray-600 font-medium mb-1">Today's Footfall</p>
              <p className="text-center text-lg font-bold text-orange-600">{todayfootfall}</p>
            </div>
          </div>
        </div>
      </div></div>
      
    </>
  );
}

export default Library;