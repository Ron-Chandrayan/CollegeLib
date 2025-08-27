// import React, { useState, useEffect, useRef } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import Searching from '../Seaching/Searching'
// // import StudentGrid from '../StudentGrid/StudentGrid';
// import Student from '../Student/Student';
// import { toast } from 'react-toastify'; // ✅ Import toast
// import 'react-toastify/dist/ReactToastify.css'; // ✅ Ensure CSS is loaded
// import { getApiUrl, getApiHeaders, getLibraryApiUrl, getLibraryApiHeaders, debugApiConfig } from '../../utils/apiConfig';

// function Library() {
//  const { name,setname,totalfootfall,todayfootfall } = useOutletContext();
//   const[student, setStudent]=useState([])
//   const[flag,setflag]=useState();
//   const[search,setsearch]=useState("");
//       const[filter,setFilter]= useState("");
//   const[disable,setdisable]=useState(true);
//   const[loading,setloading]=useState(false);
//   const [formData, setformData] = useState({
//     PRN: '',
//     purpose: 'Study'
//   });

//   // Add ref for PRN input auto-focus
//   const prnInputRef = useRef(null);

//   // Auto-focus PRN input when component mounts
//   useEffect(() => {
//     if (prnInputRef.current) {
//       prnInputRef.current.focus();
//     }
//   }, []);

//   //console.log(name);
//   useEffect(() => {
//           const checkTime = () => {
//             const now = new Date();
//             const currentHours = now.getHours();
//             const currentMinutes = now.getMinutes();
  
//             // 17:35 in 24-hour format = 5:35 PM
//             if (((currentHours > 17 || (currentHours === 17 && currentMinutes >= 30)) )||(currentHours<8 || (currentHours === 8 && currentMinutes <= 15))) {
//               setdisable(false);
//             } else {
//               setdisable(true);
//             }
//           };
  
//           checkTime(); // Check immediately
//           const interval = setInterval(checkTime, 60 * 1000); // Recheck every minute
  
//           return () => clearInterval(interval); // Clean up on unmount
//       }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setformData((prev) => ({
//       ...prev,
//       [name]: name === 'PRN' ? value.toUpperCase() : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {

//       const payload={
//         PRN:formData.PRN,
//         purpose:formData.purpose
//       }
      
//       setformData({
//           PRN: '',
//           purpose: 'Study'
//         })

//       const res = await fetch('/submit', {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });

//       const data = await res.json();

//       if (data.success===true) {
//         toast.success(data.message || "Student inserted!");
//       } else {
//         toast.error(data.message || "Something went wrong");
//       }

//       setflag(prev => !prev);

      


//     //       const resp = await fetch("https://libman.ethiccode.in.net/api/in_out", {
//     //   method: "POST",
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //     "XApiKey": "4rnWNLFd3I5sh4jMiP3BKnhOnxtPJ2sPcQRT4tplQK0",  
//     //   },
//     //   body: JSON.stringify(payload),
//     // });

//     try {
//       const resp = await fetch(getLibraryApiUrl('in_out'), {
//         method: 'POST',
//         headers: getLibraryApiHeaders(),
//         body: JSON.stringify(payload),
//       });

//     const data2=await resp.json();
//     console.log(data2);
//     // toast.success("koha pe jarha");
      
//     } catch (error) {
//       console.error(error.message);
//       toast.error("Student not recorded");
//     }
    

    
//     } catch (error) {
//       toast.error("Network error"); 
//     }
//   };

//   const handleSubmit2=async (e)=>{
//     e.preventDefault();
//     setloading(true);

//     try {
//       console.log("so you are the entity huh");
//     const res = await fetch('/remove', {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(name)
//       });

//     const data = await res.json()
//     console.log(data);
//     if(data.message==="success"){
//       toast.success("All Students deleted");
//     }else{
//       toast.error("student can't be deleted");
//     }
      
//     } catch (error) {
//       toast.error("Something went wrong")
//     }finally{
//       setloading(false)
//     }
    
    
    
//   }

//   // const fetchData = async () => {
//   //   try {
//   //     const response = await fetch('/fetch');
//   //     const data = await response.json();
//   //     setStudent(data);
//   //   } catch (error) {
//   //     console.log(error.message);
//   //   }
//   // };

//   // useEffect(() => {
//   //   fetchData();
//   //   const interval = setInterval(fetchData, 1000);
//   //       return () => clearInterval(interval);
//   // }, []);

//   return (
//     <>
//       <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-8 mb-8 border border-blue-200/50 backdrop-blur-sm">
//         <form className="space-y-6" >
//           <div className="flex flex-col md:flex-row gap-4">
//             <input
//               ref={prnInputRef}
//               type="text"
//               name="PRN"
//               placeholder="Enter PRN"
//               value={formData.PRN}
//               onChange={handleChange}
//               required
//               className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//             <select
//               name="purpose"
//               value={formData.purpose}
//               onChange={handleChange}
//               required
//               className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="" hidden>Select purpose</option>
//               <option value="Study">Study</option>
//               <option value="Circulation">Circulation</option>
//               <option value="Internet Search">Internet Search</option>
//               <option value="No due Clearance">No due Clearance</option>
//               <option value="Photo Copy/Printing">Photo Copy/Printing</option>
//               <option value="Project Work">Project Work</option>
//               <option value="Question Paper">Question Paper</option>
//               <option value="Project Work">Reading Newspaper</option>
//               <option value="Reference Book/Periodical">Reference Book/Periodical</option>
              


    
//             </select>
//           </div>

//           <div className='flex flex-row justify-between'>
//              <button
//             // type="submit"
//             onClick={handleSubmit}
//             className="px-6 py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700"
//            >
//             Enter/Out
//            </button>

//            <div><div><p className='text-lg text-center '>List of Users in </p>
//                <p className='text-lg text-center'>SIES Graduate School of Technology</p></div>
//            </div>

//            <button
//                     disabled={disable || loading===true}
//                     onClick={handleSubmit2}
//                     className={`px-6 py-3 rounded-lg font-semibold text-white ${
//                       (disable || loading===true)
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-red-600 hover:bg-red-700 cursor-pointer"
//                     }`}
//                   >
//                     {loading?"Loading":"Remove all"}
//                   </button>

//           </div>
          
//         </form>
//       </div>

//     <div className='mb-8'>
//                         <div className="bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/40">
//                             <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
//                                 <div className="relative flex-1">
//                                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                                         <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                         </svg>
//                                     </div>
//                                     <input 
//                                         type="text" 
//                                         placeholder="Search students..." 
//                                         onChange={(e) => setsearch(e.target.value)} 
//                                         value={search}
//                                         className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 text-slate-900 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white"
//                                     />
//                                 </div>
//                                 <select 
//                                     value={filter} 
//                                     onChange={(e) => setFilter(e.target.value)} 
//                                     className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 bg-white/80 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:bg-white min-w-32"
//                                 >
//                                     <option value="name">Search by Name</option>
//                                     <option value="PRN">Search by PRN</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </div>  
    

//       <div className="mt-12 flex flex-row items-center justify-center">
//          <div><p>Current Student: {name.length}</p></div>
//         <div> <Searching search={search} filter={filter} name={name} /></div>
//         <div><div><p>Total Footfall: {totalfootfall}</p></div>
//              <div><p>Todays Footfall: {todayfootfall}</p></div>
             
//         </div>
//       </div>
//     </>
//   );
// }

// export default Library;  



import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import Searching from '../Seaching/Searching'
// import StudentGrid from '../StudentGrid/StudentGrid';
import Student from '../Student/Student';
import { toast } from 'react-toastify'; // ✅ Import toast
import 'react-toastify/dist/ReactToastify.css'; // ✅ Ensure CSS is loaded
import { getApiUrl, getApiHeaders, getLibraryApiUrl, getLibraryApiHeaders, debugApiConfig } from '../../utils/apiConfig';

function Library() {
 const { name,setname,totalfootfall,todayfootfall } = useOutletContext();
  const[student, setStudent]=useState([])
  const[flag,setflag]=useState();
  const[search,setsearch]=useState("");
      const[filter,setFilter]= useState("");
  const[disable,setdisable]=useState(true);
  const[loading,setloading]=useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 h-screen flex flex-col p-6">
        {/* Top Form Section - Modern Glassmorphism */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-6 border border-white/20 relative overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-700/90 rounded-3xl"></div>
          <div className="relative z-10">
            <form className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 group">
                  <input
                    ref={prnInputRef}
                    type="text"
                    name="PRN"
                    placeholder="Enter PRN"
                    value={formData.PRN}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm border-0 rounded-2xl focus:ring-4 focus:ring-white/30 focus:outline-none font-semibold text-gray-900 shadow-lg placeholder-gray-500 transition-all duration-300 group-hover:shadow-xl"
                  />
                </div>
                <div className="flex-1 group">
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm border-0 rounded-2xl focus:ring-4 focus:ring-white/30 focus:outline-none font-semibold text-gray-900 shadow-lg transition-all duration-300 group-hover:shadow-xl cursor-pointer"
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
              </div>

              <div className='flex flex-row justify-between items-center'>
                 <button
                  onClick={handleSubmit}
                  className="group relative px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-emerald-300/50"
                 >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Enter/Out
                  </span>
                 </button>

                 <div className="text-center">
                   <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">List of Users in</h1>
                   <h2 className="text-xl font-semibold text-blue-100 drop-shadow-md">SIES Graduate School of Technology</h2>
                 </div>

                 <button
                          disabled={disable || loading===true}
                          onClick={handleSubmit2}
                          className={`group relative px-10 py-4 font-bold rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 ${
                            (disable || loading===true)
                              ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                              : "bg-gradient-to-r from-red-500 to-red-600 text-white cursor-pointer focus:ring-red-300/50"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            {loading ? (
                              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                            {loading ? "Loading..." : "Remove all"}
                          </span>
                        </button>
              </div>
            </form>
          </div>
        </div>

        {/* Flash Messages Area */}
        <div className="mb-4">
          <div id="toast-container" className="fixed top-4 right-4 z-50"></div>
        </div>

        {/* Modern Search Bar with Glassmorphism */}
        <div className='mb-6'>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  onChange={(e) => setsearch(e.target.value)} 
                  value={search}
                  className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-sm border-0 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300/30 placeholder-gray-500 text-gray-900 font-semibold shadow-lg transition-all duration-300 group-hover:shadow-xl"
                />
              </div>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
                className="px-6 py-4 bg-white/80 backdrop-blur-sm border-0 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300/30 text-gray-900 font-semibold cursor-pointer shadow-lg transition-all duration-300 hover:shadow-xl min-w-40"
              >
                <option value="name">Search by Name</option>
                <option value="PRN">Search by PRN</option>
              </select>
            </div>
          </div>
        </div>  

        {/* Main Content Grid with Modern Cards */}
        <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
          
          {/* Current Students Card - Modern Design */}
          <div className="col-span-2">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 h-fit relative overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-700 font-bold mb-3">Current Students</p>
                <p className="text-center text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{name.length}</p>
              </div>
            </div>
          </div>

          {/* Main Students Section - Enhanced with Glassmorphism */}
          <div className="col-span-8 flex flex-col min-h-0">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 flex-1 min-h-0 flex flex-col">
              <div className="flex-1 min-h-0 overflow-hidden">
                <Searching search={search} filter={filter} name={name} />
              </div>
            </div>
          </div>

          {/* Enhanced Statistics Cards */}
          <div className="col-span-2 space-y-6">
            {/* Total Footfall Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-3 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-700 font-bold mb-3">Total Footfall</p>
                <p className="text-center text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{totalfootfall}</p>
              </div>
            </div>

            {/* Today's Footfall Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-700 font-bold mb-3">Today's Footfall</p>
                <p className="text-center text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{todayfootfall}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Library;