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
    <>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-8 mb-8 border border-blue-200/50 backdrop-blur-sm">
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
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

          <div className='flex flex-row justify-between'>
             <button
            // type="submit"
            onClick={handleSubmit}
            className="px-6 py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700"
           >
            Enter/Out
           </button>

           <div><div><p className='text-lg text-center '>List of Users in </p>
               <p className='text-lg text-center'>SIES Graduate School of Technology</p></div>
           </div>

           <button
                    disabled={disable || loading===true}
                    onClick={handleSubmit2}
                    className={`px-6 py-3 rounded-lg font-semibold text-white ${
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

    <div className='mb-8'>
                        <div className="bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/40">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Search students..." 
                                        onChange={(e) => setsearch(e.target.value)} 
                                        value={search}
                                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 text-slate-900 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white"
                                    />
                                </div>
                                <select 
                                    value={filter} 
                                    onChange={(e) => setFilter(e.target.value)} 
                                    className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 bg-white/80 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:bg-white min-w-32"
                                >
                                    <option value="name">Search by Name</option>
                                    <option value="PRN">Search by PRN</option>
                                </select>
                            </div>
                        </div>
                    </div>  
    

      <div className="mt-12 flex flex-row items-center justify-center">
         <div><p>Current Student: {name.length}</p></div>
        <div> <Searching search={search} filter={filter} name={name} /></div>
        <div><div><p>Total Footfall: {totalfootfall}</p></div>
             <div><p>Todays Footfall: {todayfootfall}</p></div>
             
        </div>
      </div>
    </>
  );
}

export default Library;  