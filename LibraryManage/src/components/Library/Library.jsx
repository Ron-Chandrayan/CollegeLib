import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
// import StudentGrid from '../StudentGrid/StudentGrid';
import Student from '../Student/Student';
import { toast } from 'react-toastify'; // ✅ Import toast
import 'react-toastify/dist/ReactToastify.css'; // ✅ Ensure CSS is loaded
import { getApiUrl, getApiHeaders, getLibraryApiUrl, getLibraryApiHeaders, debugApiConfig } from '../../utils/apiConfig';

function Library() {
//  const { student, setStudent, flag, setflag } = useOutletContext();
  const[student, setStudent]=useState([])
  const[flag,setflag]=useState();
  const [formData, setformData] = useState({
    PRN: '',
    purpose: 'Study'
  });

  const handleChange = (e) => {
    setformData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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

    const resp = await fetch(getLibraryApiUrl('in_out'), {
        method: 'POST',
        headers: getLibraryApiHeaders(),
        body: JSON.stringify(payload),
      });

    // const data2=await resp.json();
    // console.log(data2);

    
    } catch (error) {
      toast.error("Network error"); 
    }
  };

  const handleSubmit2=async (e)=>{
    e.preventDefault();
    console.log("so you are the entity huh");
    const res = await fetch('/remove', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
      });

    const data = await res.json()
    if(data.message==="success"){
      toast.success("All Students deleted");
    }else{
      toast.error("Something Went Wrong");
    }
    
    
  }

  const fetchData = async () => {
    try {
      const response = await fetch('/fetch');
      const data = await response.json();
      setStudent(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-8 mb-8 border border-blue-200/50 backdrop-blur-sm">
        <form className="space-y-6" >
          <div className="flex flex-col md:flex-row gap-4">
            <input
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
              <option value="Research">Research</option>
              <option value="References">References</option>
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

          <button
            // type="submit"
            onClick={handleSubmit2}
            className="px-6 py-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700"
          >
            Remove all
          </button>
          </div>
          
        </form>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">All Students</h2>
        <Student name={student} />
      </div>
    </>
  );
}

export default Library;  