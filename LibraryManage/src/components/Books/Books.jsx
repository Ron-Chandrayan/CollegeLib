import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import Book from '../Book/Book';

function Books() {
    const{books, setBooks}=useOutletContext()
    const[i,seti]=useState(1);
    const[paginatedbooks,setpaginatedbooks]=useState([])

      const [formData, setformData] = useState({
        title: '',
        author: '',
        publisher: ''
      });
      const[filterbooks,setfilterbooks]=useState([])
    const[searchActive, setsearchActive]=useState(false);
 


    useEffect(()=>{
              const fetchData =async()=>{
                const BASEURL = 'https://libman.ethiccode.in';
                const apikey = import.meta.env.VITE_SECRET_KEY2;
    
                try{fetch(`${BASEURL}/api/api/index.php?endpoint=book_all&page=${i}&limit=20`, {
                      headers: {
                          'x-api-key': apikey // Use XAPIKEY header
                      }
                      })
                      .then(response => response.json())
                      .then(data => {console.log(data.data.books);
                        const paginatedkitab = data.data.books
                          //seterr(false)
                          // const info = data.students
                          // setName(info);
                          // // console.log(info[0].name)
                          setpaginatedbooks(paginatedkitab)
                          
                      })
                      }
                      catch(error){
                          seterr(true);
                          console.error(error);
                      }
              }
              fetchData();
              
            },[i])

            const handleChange = (e) => {
           // setsearchActive(e.target.value.trim() !== '');
        setformData(prev => ({
          ...prev,
          [e.target.name]: e.target.value
        }));
      };

      const handleSubmit = (e)=>{
        e.preventDefault();
        setsearchActive(true);
        console.log(formData);
        const apikey = import.meta.env.VITE_SECRET_KEY2;
        const title=formData.title;
        const author=formData.author.trim().split(" ")[0];
        const publisher = formData.publisher;
         try{fetch(`/api/api/index.php?endpoint=book_search&title=${title}&author=${author}&publisher=${publisher}&limit=1000`, {
                  headers: {
                      'x-api-key': apikey // Use XAPIKEY header
                  }
                  })
                  .then(response => response.json())
                  .then(data => {console.log(data.data.books);
                    // const kitab = data.data.books;
                    setfilterbooks(data.data.books)
                    // setBooks(kitab);
                      //seterr(false)
                      // const info = data.students
                      // setName(info);
                      // // console.log(info[0].name)
                      seti(1);
                      
                  })
                  }
                  catch(error){
                      seterr(true);
                      console.error(error);
                  }
      
        
      }

return(<>
    {/* Header Section */}
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-12 px-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                        Library Management
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl font-light">
                        Browse and search through our extensive book collection
                    </p>
                    <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-blue-500 bg-opacity-20 border border-blue-400 border-opacity-30">
                        <span className="text-blue-200 text-sm font-medium">Page {i}</span>
                    </div>
                </div>
                <div className="hidden md:block">
                    <svg className="w-24 h-24 text-blue-300 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>

    {/* Main Content Container */}
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
            
            {/* Search Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-10 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Search Books
                    </h2>
                </div>
                
                <form className="max-w-2xl mx-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <input 
                              type="text"
                              name='title'
                              placeholder='Enter Title/Subject'
                              onChange={handleChange}
                              value={formData.title}
                              className="w-full px-5 py-4 bg-white/70 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-400 text-gray-700 shadow-sm hover:shadow-md"
                            />
                        </div>
                        
                        <input 
                          type="text"
                          name='author'
                          placeholder='Enter Author'
                          onChange={handleChange}
                          value={formData.author}
                          className="w-full px-5 py-4 bg-white/70 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-400 text-gray-700 shadow-sm hover:shadow-md"
                        />

                        <input 
                          type="text"
                          name='publisher' 
                          placeholder='Enter Publisher'
                          onChange={handleChange}
                          value={formData.publisher}
                          className="w-full px-5 py-4 bg-white/70 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-400 text-gray-700 shadow-sm hover:shadow-md"
                        />
                    </div>

                    <button 
                      onClick={handleSubmit}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <span>Search Books</span>
                    </button>
                </form>

                {searchActive && (
                    <div className="mt-6 flex items-center justify-center">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 border border-green-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-green-700 text-sm font-medium">Search Results Active</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Books Display Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                        {searchActive ? 'Search Results' : 'All Books'}
                    </h3>
                </div>
                <div className="p-6">
                    {searchActive?(<Book books={filterbooks.slice((i - 1) * 20, i * 20)}/>):(<Book books={paginatedbooks}/>)}
                </div>
            </div>

            {/* Pagination Section */}
            {(!searchActive) ?(<div className="mt-10 flex justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-2">
                        
                        {/* Previous Button */}
                        <button 
                          onClick={()=>{
                              if(i>1){
                                  seti(i-1);
                              }
                          }}
                          disabled={i <= 1}
                          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                          </svg>
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center space-x-2 px-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold shadow-lg text-lg">
                                {i}
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300 text-gray-600 hover:text-gray-800 font-semibold transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 shadow-sm hover:shadow-md">
                                {i+1}
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300 text-gray-600 hover:text-gray-800 font-semibold transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 shadow-sm hover:shadow-md">
                                {i+2}
                            </div>
                        </div>

                        {/* Next Button */}
                        <button 
                          onClick={()=>{
                              if(i<(Math.floor((books.length)/20))){
                                  seti(i+1)
                              }
                          }}
                          disabled={i >= Math.floor((books.length)/20)}
                          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </button>

                    </div>
                </div>
            </div>):(<div className="mt-10 flex justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-2">
                        
                        {/* Previous Button */}
                        <button 
                          onClick={()=>{
                              if(i>1){
                                  seti(i-1);
                              }
                          }}
                          disabled={i <= 1}
                          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                          </svg>
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center space-x-2 px-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold shadow-lg text-lg">
                                {i}
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300 text-gray-600 hover:text-gray-800 font-semibold transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 shadow-sm hover:shadow-md">
                                {i+1}
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300 text-gray-600 hover:text-gray-800 font-semibold transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 shadow-sm hover:shadow-md">
                                {i+2}
                            </div>
                        </div>

                        {/* Next Button */}
                        <button 
                          onClick={()=>{
                              if(i<(Math.ceil((filterbooks.length)/20))){
                                  seti(i+1)
                              }
                          }}
                          disabled={i >= Math.ceil((filterbooks.length)/20)}
                          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </button>

                    </div>
                </div>
            </div>)}

            {/* Page Info */}
            {(!searchActive)?(<div className="mt-6 text-center">
                <div className="inline-flex items-center px-6 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p className="text-gray-600 text-sm font-medium">
                        Page {i} of {Math.ceil(books.length / 20)} | Showing up to 20 books per page
                    </p>
                </div>
            </div>):(<div className="mt-6 text-center">
                <div className="inline-flex items-center px-6 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p className="text-gray-600 text-sm font-medium">
                        Page {i} of {Math.ceil(filterbooks.length / 20)} | Showing up to 20 books per page
                    </p>
                </div>
            </div>)}

        </div>
    </div>

</>)
}

export default Books