import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';

const ExcelToGithubCards = () => {
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('data.xlsx'); // Default file name
  const fileInputRef = useRef(null); // Ref for file input

  // Function to parse Excel data (shared between default load and upload)
  const parseExcelData = (data) => {
    try {
      const workbook = XLSX.read(data, { type: 'array' });
      if (!workbook.SheetNames.length) {
        throw new Error("No sheets found in the Excel file.");
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

      if (!jsonData.length) {
        throw new Error("Excel file is empty.");
      }

      const parsedRepos = [];
      const startRow = jsonData[0][0] === "Repository Name" && jsonData[0][1] === "Repository Link" ? 1 : 0;

      for (let i = startRow; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row.length >= 2 && row[0] && row[1]) {
          const repoName = row[0];
          const repoLink = row[1];
          parsedRepos.push({ name: repoName, link: repoLink });
        }
      }

      if (parsedRepos.length === 0) {
        throw new Error("No valid repository data found in the Excel file.");
      }

      setRepos(parsedRepos);
      setError(null);
    } catch (err) {
      console.error("Error parsing Excel:", err.message);
      setError(`Failed to parse Excel file: ${err.message}`);
      setRepos([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load default data from public/data.xlsx
  useEffect(() => {
    const fetchDefaultData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/data.xlsx');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        parseExcelData(data);
      } catch (err) {
        console.error("Error fetching default data:", err.message);
        setError(`Failed to load default data: ${err.message}`);
        setIsLoading(false);
      }
    };

    fetchDefaultData();
  }, []);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFileName('data.xlsx'); // Revert to default if no file selected
      return;
    }

    setFileName(file.name); // Update displayed file name
    setIsLoading(true);
    setError(null);

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      parseExcelData(data);
    };

    reader.onerror = () => {
      setError("Failed to read the uploaded file.");
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-800">GitHub Repositories</h1>

        <div className="mb-8">
          <label className="block text-sm font-medium text-green-700 mb-2">Upload Excel File</label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden" // Hide default input
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100 cursor-pointer
                border rounded-md p-2 bg-white"
            >
              <span className="inline-block w-20 truncate">{fileName}</span>
              <span className="ml-2 bg-green-50 text-green-700 px-3 py-1 rounded-full">Browse</span>
            </label>
          </div>
          {isLoading && <p className="mt-2 text-sm text-gray-500 animate-pulse">Loading...</p>}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo, index) => (
            <a
              key={index}
              href={repo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
            >
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" />
                  </svg>
                  <h2 className="text-xl font-semibold text-green-800">{repo.name}</h2>
                </div>
                <p className="text-sm text-gray-500 truncate">{repo.link}</p>
                <div className="mt-4 flex justify-end">
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">View Repository</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {repos.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No repositories found. Please check your Excel file.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelToGithubCards;