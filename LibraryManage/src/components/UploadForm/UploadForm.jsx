import React, { useState } from 'react';

const UploadForm = ({ onClose }) => {
  const [sem, setSem] = useState('');
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !sem || !subject || !year) return alert("All fields are required");

    const formData = new FormData();
    formData.append('file', file);
    formData.append('sem', sem);
    formData.append('subject', subject);
    formData.append('year', year);

    try {
      const res = await fetch('/api/qps/upload', {
        method: 'POST',
        body: formData
      });
      const result = await res.json();
      alert(result.message || "Uploaded");
      onClose(); // close modal
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 w-96 space-y-4 relative"
      >
        <h2 className="text-xl font-semibold mb-4">Upload Question Paper</h2>

        {/* Semester dropdown */}
        <select
          value={sem}
          name="sem"
          onChange={e => setSem(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Semester</option>
          <option value="sem1">Semester 1</option>
          <option value="sem2">Semester 2</option>
          <option value="sem3">Semester 3</option>
          <option value="sem4">Semester 4</option>
          <option value="sem5">Semester 5</option>
          <option value="sem6">Semester 6</option>
        </select>

        {/* Subject dropdown */}
        <select
          value={subject}
          name='subject'
          onChange={e => setSubject(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Subject</option>
          <option value="maths">Engineering Mathematics</option>
          <option value="chem">Chemistry</option>
          <option value="mechanics">Engineering Mechanics</option>
          <option value="physics">Applied Physics</option>
          <option value="bee">Basic Electrical Engineering</option>
        </select>

        {/* Year dropdown */}
        <select
          value={year}
          name='year'
          onChange={e => setYear(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Year</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>

        <input
          type="file"
          name="file"
          accept="application/pdf"
          onChange={e => setFile(e.target.files[0])}
          className="w-full"
          required
        />

        <div className="flex justify-between mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
          <button type="button" onClick={onClose} className="text-red-500">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
