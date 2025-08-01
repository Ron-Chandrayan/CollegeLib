import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getApiUrl, getApiHeaders, debugApiConfig } from '../../utils/apiConfig';

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
                 try{
                   const booksUrl = getApiUrl(`endpoint=book_all&page=${i}&limit=20`);
                   const booksHeaders = getApiHeaders();
                   
                   const response = await fetch(booksUrl, {
                       headers: booksHeaders
                   });
                   
                   if (!response.ok) {
                     throw new Error(`HTTP error! status: ${response.status}`);
                   }
                   
                   const data = await response.json();
                   
                   if (data.data && data.data.books) {
                     setpaginatedbooks(data.data.books);
                   } else {
                     console.error('Invalid data structure:', data);
                   }
                 } catch(error){
                     console.error('Error fetching paginated books:', error);
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

             const handleSubmit = async (e)=>{
         e.preventDefault();
         setsearchActive(true);
         
         const title = formData.title;
         const author = formData.author.trim().split(" ")[0];
         const publisher = formData.publisher;
         
         try{
           const response = await fetch(getApiUrl(`endpoint=book_search&title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&publisher=${encodeURIComponent(publisher)}&limit=1000`), {
                   headers: getApiHeaders()
           });
           
           if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
           }
           
           const data = await response.json();
           
           if (data.data && data.data.books) {
             setfilterbooks(data.data.books);
             seti(1);
           } else {
             console.error('Invalid search data structure:', data);
           }
         } catch(error){
             console.error('Error searching books:', error);
         }
       }

return(<>
    {/* Header Section */}
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-8 sm:py-12 px-4 sm:px-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                        Library Management
                    </h1>
                    <p className="text-blue-100 text-base sm:text-lg md:text-xl font-light">
                        Browse and search through our extensive book collection
                    </p>
                    <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-blue-500 bg-opacity-20 border border-blue-400 border-opacity-30">
                        <span className="text-blue-200 text-sm font-medium">Page {i}</span>
                    </div>
                </div>
                <div className="hidden sm:block">
                    <svg className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-blue-300 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>

    {/* Main Content Container */}
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            
            {/* Search Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-10 hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mr-0 sm:mr-4 mb-3 sm:mb-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Search Books
                    </h2>
                </div>
                
                <form className="max-w-none sm:max-w-2xl mx-auto space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="sm:col-span-2">
                            <input 
                              type="text"
                              name='title'
                              placeholder='Enter Title/Subject'
                              onChange={handleChange}
                              value={formData.title}
                              className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/70 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-400 text-gray-700 shadow-sm hover:shadow-md text-base"
                            />
                        </div>
                        
                        <input 
                          type="text"
                          name='author'
                          placeholder='Enter Author'
                          onChange={handleChange}
                          value={formData.author}
                          className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/70 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-400 text-gray-700 shadow-sm hover:shadow-md text-base"
                        />

                        <input 
                          type="text"
                          name='publisher' 
                          placeholder='Enter Publisher'
                          onChange={handleChange}
                          value={formData.publisher}
                          className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/70 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-400 text-gray-700 shadow-sm hover:shadow-md text-base"
                        />
                    </div>

                    <button 
                      onClick={handleSubmit}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <span>Search Books</span>
                    </button>
                </form>

                {searchActive && (
                    <div className="mt-4 sm:mt-6 flex items-center justify-center">
                        <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-green-100 border border-green-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-green-700 text-sm font-medium">Search Results Active</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Books Display Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 sm:px-6 py-4 border-b border-gray-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                        {searchActive ? 'Search Results' : 'All Books'}
                    </h3>
                </div>
                <div className="p-4 sm:p-6">
                    {searchActive?(<Book books={filterbooks.slice((i - 1) * 20, i * 20)}/>):(<Book books={paginatedbooks}/>)}
                </div>
            </div>

            {/* Pagination Section */}
            {(!searchActive) ?(<div className="mt-6 sm:mt-10 flex justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-3 sm:p-4 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        
                        {/* Previous Button */}
                        <button 
                          onClick={()=>{
                              if(i>1){
                                  seti(i-1);
                              }
                          }}
                          disabled={i <= 1}
                          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                          </svg>
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4">
                            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold shadow-lg text-base sm:text-lg">
                                {i}
                            </div>
                            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300 text-gray-600 hover:text-gray-800 font-semibold transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 shadow-sm hover:shadow-md text-sm sm:text-base">
                                {i+1}
                            </div>
                            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300 text-gray-600 hover:text-gray-800 font-semibold transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 shadow-sm hover:shadow-md text-sm sm:text-base">
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
                          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </button>

                    </div>
                </div>
            </div>):(<div className="mt-6 sm:mt-10 flex justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-3 sm:p-4 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        
                        {/* Previous Button */}
                        <button 
                          onClick={()=>{
                              if(i>1){
                                  seti(i-1);
                              }
                          }}
                          disabled={i <= 1}
                          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                          </svg>
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4">
                            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold shadow-lg text-base sm:text-lg">
                                {i}
                            </div>
                            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300 text-gray-600 hover:text-gray-800 font-semibold transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 shadow-sm hover:shadow-md text-sm sm:text-base">
                                {i+1}
                            </div>
                            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300 text-gray-600 hover:text-gray-800 font-semibold transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 shadow-sm hover:shadow-md text-sm sm:text-base">
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
                          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </button>

                    </div>
                </div>
            </div>)}

            {/* Page Info */}
            {(!searchActive)?(<div className="mt-4 sm:mt-6 text-center">
                <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p className="text-gray-600 text-xs sm:text-sm font-medium">
                        Page {i} of {Math.ceil(books.length / 20)} | Showing up to 20 books per page
                    </p>
                </div>
            </div>):(<div className="mt-4 sm:mt-6 text-center">
                <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p className="text-gray-600 text-xs sm:text-sm font-medium">
                        Page {i} of {Math.ceil(filterbooks.length / 20)} | Showing up to 20 books per page
                    </p>
                </div>
            </div>)}

        </div>
    </div>

</>)
}

export default Books