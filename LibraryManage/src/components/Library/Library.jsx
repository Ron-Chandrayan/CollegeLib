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
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Form Section - Fixed Height */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-6 mb-4 border-2 border-blue-900">
        <form className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              ref={prnInputRef}
              type="text"
              name="PRN"
              placeholder="Enter PRN"
              value={formData.PRN}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-3 focus:ring-blue-300 focus:border-blue-600 font-semibold text-gray-900 bg-white shadow-md"
            />
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-3 focus:ring-blue-300 focus:border-blue-600 font-semibold text-gray-900 bg-white shadow-md"
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
            onClick={handleSubmit}
            className="px-8 py-3 rounded-lg font-bold text-white bg-green-700 hover:bg-green-800 transition-all duration-200 transform hover:scale-105 shadow-lg border-2 border-green-800"
           >
            Enter/Out
           </button>

           <div className="text-center">
             <h1 className="text-xl font-bold text-white mb-1 drop-shadow-md">List of Users in</h1>
             <h2 className="text-lg font-semibold text-blue-100 drop-shadow-md">SIES Graduate School of Technology</h2>
           </div>

           <button
                    disabled={disable || loading===true}
                    onClick={handleSubmit2}
                    className={`px-8 py-3 rounded-lg font-bold text-white transition-all duration-200 transform hover:scale-105 shadow-lg border-2 ${
                      (disable || loading===true)
                        ? "bg-gray-500 border-gray-600 cursor-not-allowed"
                        : "bg-red-700 hover:bg-red-800 cursor-pointer border-red-800"
                    }`}
                  >
                    {loading?"Loading":"Remove all"}
                  </button>
          </div>
        </form>
      </div>

      {/* Flash Messages Area */}
      <div className="mb-2">
        <div id="toast-container" className="fixed top-4 right-4 z-50"></div>
      </div>

      {/* Compact Search Bar */}
      <div className='mb-4'>
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-sm rounded-xl shadow-xl p-4 border-2 border-gray-700">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search students..." 
                onChange={(e) => setsearch(e.target.value)} 
                value={search}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 focus:border-blue-600 placeholder-gray-500 text-gray-900 bg-white font-semibold shadow-md transition-all duration-200"
              />
            </div>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)} 
              className="px-4 py-3 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 focus:border-blue-600 text-gray-900 bg-white font-semibold cursor-pointer shadow-md transition-all duration-200 min-w-36"
            >
              <option value="name">Search by Name</option>
              <option value="PRN">Search by PRN</option>
            </select>
          </div>
        </div>
      </div>  

      {/* Main Content Grid - Flexible Height */}
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        
        {/* Current Students Card - Smaller */}
        <div className="col-span-2">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-xl shadow-xl border-2 border-blue-900 h-fit">
            <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-300">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="bg-blue-600 p-2 rounded-lg shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-sm text-gray-800 font-bold mb-2">Current Students</p>
              <p className="text-center text-2xl font-black text-blue-700">{name.length}</p>
            </div>
          </div>
        </div>

        {/* Main Students Section - Wider with Fixed Height */}
        <div className="col-span-8 flex flex-col min-h-0">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl shadow-xl border-2 border-gray-700 flex-1 min-h-0 flex flex-col">
            <div className="flex-1 min-h-0 overflow-hidden">
              <Searching search={search} filter={filter} name={name} />
            </div>
          </div>
        </div>

        {/* Footfall Statistics - Smaller and Stacked */}
        <div className="col-span-2 space-y-4">
          {/* Total Footfall Card */}
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-4 rounded-xl shadow-xl border-2 border-green-900">
            <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-300">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="bg-green-600 p-2 rounded-lg shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-sm text-gray-800 font-bold mb-2">Total Footfall</p>
              <p className="text-center text-xl font-black text-green-700">{totalfootfall}</p>
            </div>
          </div>

          {/* Today's Footfall Card */}
          <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-4 rounded-xl shadow-xl border-2 border-orange-900">
            <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-300">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="bg-orange-600 p-2 rounded-lg shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-sm text-gray-800 font-bold mb-2">Today's Footfall</p>
              <p className="text-center text-xl font-black text-orange-700">{todayfootfall}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Library;