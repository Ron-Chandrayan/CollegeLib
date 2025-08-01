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
      const response = await fetch('/api/qps');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Hero Header Section */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8 lg:mb-10 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-white rounded-full -translate-x-10 -translate-y-10 sm:-translate-x-16 sm:-translate-y-16 lg:-translate-x-20 lg:-translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-60 lg:h-60 bg-white rounded-full translate-x-10 translate-y-10 sm:translate-x-16 sm:translate-y-16 lg:translate-x-20 lg:translate-y-20"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white rounded-full -translate-x-8 -translate-y-8 sm:-translate-x-12 sm:-translate-y-12 lg:-translate-x-16 lg:-translate-y-16"></div>
          </div>
          
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg self-start sm:self-auto">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
                  Question Papers
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-white/90 font-medium">
                  📚 Access previous year papers from our digital library
                </p>
                <p className="text-sm sm:text-base text-indigo-100 mt-1 sm:mt-2">
                  Download, study, and excel in your exams
                </p>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <button
                onClick={() => setShowForm(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-white/20 flex items-center space-x-2 sm:space-x-3"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm sm:text-base">Upload PDF</span>
              </button>
            </div>
          </div>
          
          {/* Mobile Upload Button */}
          <div className="lg:hidden mt-4 sm:mt-6">
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 border border-white/20 flex items-center justify-center space-x-2 sm:space-x-3"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm sm:text-base">Upload PDF</span>
            </button>
          </div>
        </div>

      {showForm && <UploadForm onClose={() => setShowForm(false)} />}

        {/* Search Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-10">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Find Your Papers</h2>
            <p className="text-sm sm:text-base text-gray-600">Filter by semester, subject, and year to find exactly what you need</p>
          </div>     
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">       
          <div className="group">
            <label className="text-xs sm:text-sm font-bold text-gray-800 mb-2 sm:mb-4 flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              Semester
            </label>       
            <select 
              name="sem" 
              id=""  
              defaultValue="" 
              onChange={(e)=>{         
                setsem(e.target.value);       
              }} 
              className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-700 bg-white cursor-pointer transition-all duration-300 hover:border-indigo-300 hover:shadow-lg group-hover:shadow-xl text-sm sm:text-base"
            >         
              <option value="" disabled hidden>🎓 Select Semester</option>         
              <option value="sem1">📚 Semester 1</option>         
              <option value="sem2">📖 Semester 2</option>         
              <option value="sem3">📝 Semester 3</option>         
              <option value="sem4">📊 Semester 4</option>         
              <option value="sem5">🔬 Semester 5</option>         
              <option value="sem6">⚡ Semester 6</option>         
              <option value="sem7">🚀 Semester 7</option>         
              <option value="sem8">🎯 Semester 8</option>       
            </select>        
          </div>

          <div className="group">
            <label htmlFor="subject" className="text-xs sm:text-sm font-bold text-gray-800 mb-2 sm:mb-4 flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              Subject
            </label>       
            <select 
              name="subject" 
              id="" 
              defaultValue="" 
              onChange={(e)=>{         
                setsubject(e.target.value)       
              }} 
              className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-gray-700 bg-white cursor-pointer transition-all duration-300 hover:border-purple-300 hover:shadow-lg group-hover:shadow-xl text-sm sm:text-base"
            >         
              <option value="" disabled hidden>📖 Select Subject</option>         
              <option value="maths">🧮 Engineering Mathematics</option>         
              <option value="chem">⚗️ Chemistry</option>         
              <option value="mechanics">⚙️ Engineering Mechanics</option>         
              <option value="physics">🔬 Applied Physics</option>         
              <option value="bee">⚡ Basic Electrical Engineering</option>       
            </select>        
          </div>

          <div className="group sm:col-span-2 lg:col-span-1">
            <label htmlFor="year" className="text-xs sm:text-sm font-bold text-gray-800 mb-2 sm:mb-4 flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Year
            </label>       
            <select 
              name="year" 
              id="" 
              defaultValue="" 
              onChange={(e)=>{         
                setYear(e.target.value);       
              }} 
              className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 text-gray-700 bg-white cursor-pointer transition-all duration-300 hover:border-pink-300 hover:shadow-lg group-hover:shadow-xl text-sm sm:text-base"
            >         
              <option value="" disabled hidden>📅 Select Year</option>         
              <option value="2024">🔥 2024</option>         
              <option value="2023">✨ 2023</option>         
              <option value="2022">💫 2022</option>       
            </select>        
          </div>
        </div>

          <div className="flex justify-center">
            <button 
              type='Submit' 
              onClick={handleSubmit} 
              className="px-8 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl sm:rounded-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base lg:text-lg"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>🔍 Find Papers</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
      </div>
    
        {/* Results Section */}
        <div className='bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 p-4 sm:p-6 lg:p-8'>
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">📋 Your Results</h3>
            <p className="text-sm sm:text-base text-gray-600">Found the perfect papers for your studies</p>
          </div>       
        
        {filteredqp.length>0?       
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredqp.map((qp,index)=>(         
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
                
                {/* Question Paper Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-indigo-100 transition-colors duration-200">
                        📄 Question Paper
                      </h3>
                      <p className="text-indigo-100 text-sm">Academic Resource</p>
                    </div>
                    <div className="ml-3">
                      <svg className="w-6 h-6 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Question Paper Details */}
                <div className="p-5 space-y-4">
                  
                  {/* Semester */}
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Semester</p>
                      <p className="text-gray-800 font-semibold">{qp.sem}</p>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Subject</p>
                      <p className="text-gray-800 font-semibold">{qp.subject}</p>
                    </div>
                  </div>
                  
                  {/* Year */}
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-pink-100 rounded-lg mr-3">
                      <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Year</p>
                      <p className="text-gray-800 font-semibold">{qp.year}</p>
                    </div>
                  </div>

                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Paper #{index + 1}</span>
                    <button 
                      onClick={async () => {
                        try {
                          const response = await fetch(`/download/${qp.sem}/${qp.subject}/${qp.year}/${qp.filename}`);
                          const data = await response.json();
                          if (data.success) {
                            window.open(data.downloadUrl, '_blank');
                          } else {
                            alert('Error: ' + data.message);
                          }
                        } catch (error) {
                          alert('Error downloading file');
                        }
                      }}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors duration-200 flex items-center"
                    >
                      View Paper
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

              </div>       
            ))}
          </div>
        :firstvisit?null:
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="relative mx-auto mb-6 sm:mb-8">
              <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-full p-4 sm:p-6 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-500 text-sm sm:text-xl">😔</span>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">🔍 No Papers Found</h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6">We couldn't find any question papers matching your criteria.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-sm sm:max-w-md mx-auto">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">💡 Try these tips:</h4>
              <ul className="text-blue-700 text-left space-y-1 text-xs sm:text-sm">
                <li>• Select different semester or subject</li>
                <li>• Try a different year</li>
                <li>• Check if papers are available for upload</li>
              </ul>
            </div>
          </div>
        }     
        </div>
      </div>
    </div>     
</>
  )

}



export default Questionpaper
