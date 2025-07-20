import React from 'react'
import { useState, useEffect } from 'react'
import UploadForm from '../UploadForm/UploadForm';

function  Questionpaper() {
  const [qp,setqp] = useState([]);
  const[sem,setsem]=useState('');
  const[subject,setsubject]= useState('');
  const[year,setYear]=useState('');
  const[filteredqp, setfilteredqp]=useState([]);
  const[uploadmanual,setUploadmanual]=useState(false);
  const[firstvisit,setfirstvisit]=useState(true);
  const [showForm, setShowForm] = useState(false);


  useEffect( ()=>{
      async function fetchData() {
    try {
      const response = await fetch('http://localhost:5000/api/qps');
      const data = await response.json();
      console.log(data);
      setqp(data);
    } catch (error) {
      console.error('Error fetching qps:', error);
    }
  }

  fetchData();
  },[]);

  const handleSubmit=(e)=>{
    e.preventDefault();
    console.log(sem);
    console.log(subject);
    console.log(year);

    const filtered = qp.filter((item)=>
      {return((!sem || item.sem === sem) &&
        (!subject || item.subject === subject) &&
        (!year || item.year === year))}
    )
    setfilteredqp(filtered);

    setfirstvisit(false);

    console.log(filteredqp);

  }

  

   return (
<>     
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Previous Year Question Papers</h1>
            <p className="text-indigo-100 mt-2">Access academic resources from our digital library</p>
          </div>
          {/* <div>
                  <button
              onClick={() => setShowForm(true)}
            >
              + Upload PDF
            </button>
          </div> */}
        </div>
      </div>

      {showForm && <UploadForm onClose={() => setShowForm(false)} />}

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Question Papers
        </h2>     
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">       
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Semester
            </label>       
            <select 
              name="sem" 
              id=""  
              defaultValue="" 
              onChange={(e)=>{         
                setsem(e.target.value);       
              }} 
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 bg-white cursor-pointer transition-all duration-200 hover:border-indigo-300"
            >         
              <option value="" disabled hidden>Select the Semester</option>         
              <option value="sem1">Semester 1</option>         
              <option value="sem2">Semester 2</option>         
              <option value="sem3">Semester 3</option>         
              <option value="sem4">Semester 4</option>         
              <option value="sem5">Semester 5</option>         
              <option value="sem6">Semester 6</option>         
              <option value="sem7">Semester 7</option>         
              <option value="sem8">Semester 8</option>       
            </select>        
          </div>

          <div className="flex flex-col">
            <label htmlFor="subject" className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Subject
            </label>       
            <select 
              name="subject" 
              id="" 
              defaultValue="" 
              onChange={(e)=>{         
                setsubject(e.target.value)       
              }} 
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 bg-white cursor-pointer transition-all duration-200 hover:border-indigo-300"
            >         
              <option value="" disabled hidden>Select the subject</option>         
              <option value="maths">Engineering Mathematics</option>         
              <option value="chem">Chemistry</option>         
              <option value="mechanics">Engineering Mechanics</option>         
              <option value="physics">Applied Physics</option>         
              <option value="bee">Basic Electrical Engineering</option>       
            </select>        
          </div>

          <div className="flex flex-col">
            <label htmlFor="year" className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Year
            </label>       
            <select 
              name="year" 
              id="" 
              defaultValue="" 
              onChange={(e)=>{         
                setYear(e.target.value);       
              }} 
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 bg-white cursor-pointer transition-all duration-200 hover:border-indigo-300"
            >         
              <option value="" disabled hidden>Select the Year</option>         
              <option value="2024">2024</option>         
              <option value="2023">2023</option>         
              <option value="2022">2022</option>       
            </select>        
          </div>
        </div>

        <div className="flex justify-center">
          <button 
            type='Submit' 
            onClick={handleSubmit} 
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search Papers</span>
          </button>
        </div>
      </div>
    
      {/* Results Section */}
      <div className='bg-white rounded-xl shadow-lg border border-gray-100 p-8'>
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Search Results
        </h3>       
        
        {filteredqp.length>0?       
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredqp.map((qp,index)=>(         
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">           
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 rounded-lg p-2 mr-3">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">Question Paper</h4>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-20">Semester:</span>
                    <span className="text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded-md">{qp.sem}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-20">Subject:</span>
                    <span className="text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded-md">{qp.subject}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-20">Year:</span>
                    <span className="text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded-md">{qp.year}</span>
                  </div>
                </div>
                
                <a 
                  href={`http://localhost:5000/qps/${qp.sem}/${qp.subject}/${qp.year}/${qp.filename}`} 
                  className='inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-md' 
                  target='_blank'
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Paper
                </a>         
              </div>       
            ))}
          </div>
        :firstvisit?null:
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Results Found</h3>
            <p className="text-gray-500">No question papers found for the selected parameters. Try adjusting your search criteria.</p>
          </div>
        }     
      </div>
    </div>     
</>
  )

}



export default Questionpaper
