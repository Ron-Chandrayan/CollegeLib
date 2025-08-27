import React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify'; // ✅ Import toast
import 'react-toastify/dist/ReactToastify.css'; // ✅ Ensure CSS is loaded
import { getApiUrl, getApiHeaders, getLibraryApiUrl, getLibraryApiHeaders, debugApiConfig } from '../../utils/apiConfig';

function Student({ name, Students }) { // Students prop kept, but unused

const[i,seti]=useState(1);

   const itemsPerPage = 10;
    const start = (i - 1) * itemsPerPage;
    const end = i * itemsPerPage;

    let slicename = name.slice(start, end);

  // Optional: Remove logic (currently not used in UI)
  async function remove({ prnno, name }) {
   
    const payload = {
      PRN: prnno,
      purpose:name
    };

    try {

      const res = await fetch('/submit', {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
      
            const data = await res.json();
      
            if (data.success===true) {
              toast.success(data.message || "Student removed!");
            } else {
              toast.error(data.message || "Something went wrong");
            }

       const resp = await fetch(getLibraryApiUrl('in_out'), {
              method: 'POST',
              headers: getLibraryApiHeaders(),
              body: JSON.stringify(payload),
            });
      
    } catch (error) {
      toast.error("Network error");
    }
    
  }

  return (
    <div className="h-full flex flex-col bg-white/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden relative">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #8b5cf6 2px, transparent 2px)`,
          backgroundSize: '50px 50px',
          backgroundPosition: '0 0, 25px 25px'
        }}></div>
      </div>

      {/* Modern Header with Gradient */}
      <div className="relative z-10 p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">Students Currently in Library</h2>
              <p className="text-blue-100 text-sm font-medium">Real-time tracking system</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
            <p className="text-white font-semibold">Page {i}</p>
          </div>
        </div>
      </div>

      {slicename.length === 0 ? (
        <div className="relative z-10 flex-1 flex items-center justify-center py-20 bg-gradient-to-br from-white/60 to-blue-50/60 backdrop-blur-sm">
          <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl p-12 max-w-md mx-auto shadow-2xl relative overflow-hidden group">
            {/* Animated background for empty state */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Library is Peaceful</h3>
              <p className="text-gray-600 text-center font-medium">No students currently in the library</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto">
            {/* Modern Table Design */}
            <div className="bg-white/60 backdrop-blur-sm">
              <table className="w-full">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-gradient-to-r from-slate-800 via-gray-900 to-slate-800 border-b-4 border-blue-500/30">
                    <th className="text-left py-5 px-8 font-bold text-white text-sm uppercase tracking-wider w-32 relative">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                        Purpose
                      </div>
                    </th>
                    <th className="text-center py-5 px-8 font-bold text-white text-sm uppercase tracking-wider w-24 relative">
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                        Action
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {slicename.map((element, index) => (
                    <tr 
                      key={name.indexOf(element)}
                      className="group hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-purple-50/80 transition-all duration-300 backdrop-blur-sm border-b border-white/10 hover:shadow-lg hover:scale-[1.01] transform"
                    >
                      <td className="py-6 px-8 text-gray-900 font-bold text-base relative">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            {(name.indexOf(element)) + 1}
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-8 relative">
                        <div className="bg-gradient-to-r from-gray-100/80 to-blue-100/80 backdrop-blur-sm px-4 py-2 rounded-xl font-mono text-sm font-bold text-gray-900 shadow-md border border-white/30 inline-block">
                          {element.PRN}
                        </div>
                      </td>
                      <td className="py-6 px-8 text-gray-900 font-bold text-base relative">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                            {element.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="group-hover:text-blue-700 transition-colors">{element.name}</span>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-900 border-2 border-blue-300/50 shadow-lg backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-200">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                          {element.purpose}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-center">
                        <button
                          onClick={() => remove({ prnno: element.PRN, name: element.purpose })}
                          className="group relative inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300/50 shadow-xl hover:shadow-2xl transform hover:-rotate-12"
                          title="Remove student"
                        >
                          <svg className="w-6 h-6 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400/0 to-red-600/0 group-hover:from-red-400/20 group-hover:to-red-600/20 transition-all duration-300"></div>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {slicename.length > 0 && (
        <>
          {/* Enhanced Footer Statistics */}
          <div className="relative z-10 bg-gradient-to-r from-slate-100/80 to-blue-100/80 backdrop-blur-xl px-8 py-6 border-t-2 border-white/30">
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                <p className="text-gray-800 font-bold">
                  Showing <span className="text-blue-600 font-black text-lg">{name.length}</span> student{name.length !== 1 ? 's' : ''} currently in the library
                </p>
              </div>
            </div>
          </div>

          {/* Modern Pagination */}
          <div className="relative z-10 bg-gradient-to-r from-white/90 to-slate-100/90 backdrop-blur-xl px-8 py-6 border-t border-white/20">
            <div className="flex items-center justify-between">
              {/* Enhanced Previous Button */}
              <button
                onClick={() => seti(i - 1)}
                disabled={i === 1}
                className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-bold shadow-xl transition-all duration-300 transform ${
                  i === 1 
                    ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-2xl focus:ring-4 focus:ring-blue-300/50"
                }`}
              >
                <svg className={`w-5 h-5 transition-transform ${i !== 1 ? 'group-hover:-translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {/* Enhanced Page Numbers */}
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-6 py-3 rounded-2xl font-black shadow-xl border-2 border-white/30">
                  <span className="text-lg">{i}</span>
                </div>
                {i + 1 <= Math.ceil(name.length / 10) && (
                  <div className="bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-2xl font-bold hover:bg-gradient-to-r hover:from-gray-100 hover:to-blue-100 cursor-pointer shadow-lg transition-all duration-200 border border-gray-200">
                    <span>{i + 1}</span>
                  </div>
                )}
                {i + 2 <= Math.ceil(name.length / 10) && (
                  <div className="bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-2xl font-bold hover:bg-gradient-to-r hover:from-gray-100 hover:to-blue-100 cursor-pointer shadow-lg transition-all duration-200 border border-gray-200">
                    <span>{i + 2}</span>
                  </div>
                )}
              </div>

              {/* Enhanced Next Button */}
              <button
                onClick={() => seti(i + 1)}
                disabled={i >= Math.ceil(name.length / 10)}
                className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-bold shadow-xl transition-all duration-300 transform ${
                  i >= Math.ceil(name.length / 10)
                    ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-2xl focus:ring-4 focus:ring-blue-300/50"
                }`}
              >
                Next
                <svg className={`w-5 h-5 transition-transform ${i < Math.ceil(name.length / 10) ? 'group-hover:translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

}

export default Student;