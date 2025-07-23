import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

const PURPOSE_OPTIONS = [
  { value: '', label: 'Select Purpose' },
  { value: 'study', label: 'Study' },
  { value: 'project', label: 'Project' },
  { value: 'reference', label: 'Reference' },
  { value: 'other', label: 'Other' },
];

function StudentGrid({ students }) {
  if (!students || students.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-sm mx-auto">
          <p className="text-amber-800 font-medium">No students found</p>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {students.map((student, idx) => (
        <div
          key={idx}
          className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:bg-slate-100 transition-colors relative"
        >
          <p className="font-medium text-slate-800 mb-1">{student.name}</p>
          <p className="text-sm text-slate-600">{student.PRN}</p>
          <p className="text-sm text-slate-600">{student.purpose}</p>
        </div>
      ))}
    </div>
  );
}

function Library() {
  const {
    name,
    setName,
    todayfootfall,
    settodayfootfall,
    totalfootfall,
    settotalfootfall,
    Students,
    setStudents,
    loading,
    setloading,
  } = useOutletContext();

  const [formData, setFormData] = useState({
    PRN: '',
    purpose: '',
  });
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [action, setAction] = useState('in'); // 'in' or 'out'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("name");
  const fetchStudents = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const apiKey = import.meta.env.VITE_SECRET_KEY;
      const res = await fetch(`${baseUrl}api/list_all`, {
        headers: { 'XApiKey': apiKey },
      });
      const data = await res.json();
      setAllStudents(data.students || []);
    } catch (err) {
      // Optionally keep previous students on error
    }
  };

  useEffect(() => {
    fetchStudents();
    const interval = setInterval(fetchStudents, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filtering logic (same as Home.jsx)
  let filteredStudents = allStudents;
  if (search.trim() !== "") {
    if (filter === "name") {
      filteredStudents = allStudents.filter((n) =>
        n.name && n.name.toLowerCase().includes(search.toLowerCase())
      );
    } else if (filter === "PRN") {
      filteredStudents = allStudents.filter((n) =>
        n.PRN && n.PRN.toLowerCase().includes(search.toLowerCase())
      );
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // const handleActionChange = (val) => {
  //   setAction(val);
  //   setSuccess('');
  //   setErr('');
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const apiKey = import.meta.env.VITE_SECRET_KEY;
      const payload = {
        PRN: formData.PRN,
        purpose: formData.purpose,
      //  action: action, // optionally send action if backend supports
      };
      console.log(payload);
      const res = await fetch(`/altapi/in_out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'XApiKey': apiKey,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        setSuccess(
          action === 'in'
            ? 'Student entry recorded successfully.'
            : 'Student exit recorded successfully.'
        );
        setFormData({ PRN: '', purpose: '' });
        fetchStudents(); // reload only the student list div
      } else {
        setErr(data.message || 'Failed to record entry/exit.');
      }
    } catch (error) {
      setErr('Network error. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-8 mb-8 border border-blue-200/50 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Library Entry/Exit
                </h1>
              </div>
              <p className="text-slate-600/80 text-lg font-medium">
                Add or remove students from the library
              </p>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  name="PRN"
                  placeholder="Enter PRN"
                  value={formData.PRN}
                  onChange={handleChange}
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-gray-50 hover:bg-white"
                />
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-gray-50 hover:bg-white"
                >
                  {PURPOSE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.PRN || !formData.purpose}
                  onClick={handleSubmit}
                  className={`px-6 py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-200 ${action === 'in' ? 'ring-2 ring-green-400' : ''}`}
                >
                  Enter
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.PRN || !formData.purpose}
                  onClick={handleSubmit}
                  className={`px-6 py-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-200 ${action === 'out' ? 'ring-2 ring-red-400' : ''}`}
                >
                  Out
                </button>
              </div>
              {err && <div className="text-red-600 font-medium">{err}</div>}
              {success && <div className="text-green-600 font-medium">{success}</div>}
            </form>
          </div>
        </div>
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <p className="text-sm font-medium text-slate-600 mb-2">Today's Footfall</p>
            <p className="text-3xl font-bold text-green-600">{todayfootfall}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <p className="text-sm font-medium text-slate-600 mb-2">Total Footfall</p>
            <p className="text-3xl font-bold text-blue-600">{totalfootfall}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <p className="text-sm font-medium text-slate-600 mb-2">No. of students in library</p>
            <p className="text-3xl font-bold text-blue-600">{name.length}</p>
          </div>
        </div>
        {/* Search Section */}
        <div className='flex flex-wrap m-3'>
          <form onSubmit={e => e.preventDefault()} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
            <input
              type="text"
              placeholder="Search"
              onChange={e => setSearch(e.target.value)}
              value={search}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-gray-50 transition-colors duration-200"
            />
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-white cursor-pointer transition-colors duration-200 min-w-20"
            >
              <option value="name">Name</option>
              <option value="PRN">PRN</option>
            </select>
          </form>
        </div>
        {/* Students List Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">All Students</h2>
          <StudentGrid students={filteredStudents} />
        </div>
      </div>
    </div>
  );
}

export default Library; 