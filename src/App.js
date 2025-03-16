import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const ExcelToGithubCards = () => {
  // Initial sample data
  const initialSampleData = [
    {
      "name": "RNS-Car-Racing",
      "link": "https://github.com/RNSsanjay/RNS-Car-Racing"
    },
    {
      "name": "RNS-Voice-Assistant",
      "link": "https://github.com/RNSsanjay/RNS-Voice-Assistant"
    },
    {
      "name": "Job-Seeker-Portal-v1",
      "link": "https://github.com/RNSsanjay/Job-Seeker-Portal-v1"
    },
    {
      "name": "GPS-Tracker",
      "link": "https://github.com/RNSsanjay/GPS-Tracker"
    },
    {
      "name": "RNS_Impactfolio",
      "link": "https://github.com/RNSsanjay/RNS_Impactfolio"
    },
    {
      "name": "AI-Language-Trainer",
      "link": "https://github.com/RNSsanjay/AI-Language-Trainer"
    },
    {
      "name": "QR-Code-Generator",
      "link": "https://github.com/RNSsanjay/QR-Code-Generator"
    },
    {
      "name": "TTS-Streamlit-",
      "link": "https://github.com/RNSsanjay/TTS-Streamlit-"
    },
    {
      "name": "RNS-Drawing-Application",
      "link": "https://github.com/RNSsanjay/RNS-Drawing-Application"
    },
    {
      "name": "RNS-Chatbot-python-",
      "link": "https://github.com/RNSsanjay/RNS-Chatbot-python-"
    },
    {
      "name": "AR-Filter-Application",
      "link": "https://github.com/RNSsanjay/AR-Filter-Application"
    },
    {
      "name": "E-Commerce-React-",
      "link": "https://github.com/RNSsanjay/E-Commerce-React-"
    },
    {
      "name": "Django-ChatBot",
      "link": "https://github.com/RNSsanjay/Django-ChatBot"
    },
    {
      "name": "LandBerg-Pvt-Ltd-Web-Intern",
      "link": "https://github.com/RNSsanjay/LandBerg-Pvt-Ltd-Web-Intern"
    },
    {
      "name": "AI-Text-to-Speech",
      "link": "https://github.com/RNSsanjay/AI-Text-to-Speech"
    },
    {
      "name": "Image-to-Text-Generation-Ai",
      "link": "https://github.com/RNSsanjay/Image-to-Text-Generation-Ai"
    },
    {
      "name": "Tracker-Intern",
      "link": "https://github.com/RNSsanjay/Tracker-Intern"
    },
    {
      "name": "HostMyResume",
      "link": "https://github.com/RNSsanjay/HostMyResume"
    },
    {
      "name": "Software-Development",
      "link": "https://github.com/RNSsanjay/Software-Development"
    },
    {
      "name": "My-Resume",
      "link": "https://github.com/RNSsanjay/My-Resume"
    },
    {
      "name": "Web-Projects",
      "link": "https://github.com/RNSsanjay/Web-Projects"
    },
    {
      "name": "Android-Development-Internship-Cognifyz-",
      "link": "https://github.com/RNSsanjay/Android-Development-Internship-Cognifyz-"
    },
    {
      "name": "Front-End-Development-Internship-cognifyz-",
      "link": "https://github.com/RNSsanjay/Front-End-Development-Internship-cognifyz-"
    },
    {
      "name": "Machine-Learning-Restaurant-Based-Project-",
      "link": "https://github.com/RNSsanjay/Machine-Learning-Restaurant-Based-Project-"
    },
    {
      "name": "AI-Tools",
      "link": "https://github.com/RNSsanjay/AI-Tools"
    },
    {
      "name": "C-plus-Language",
      "link": "https://github.com/RNSsanjay/C-plus-Language"
    },
    {
      "name": "Old-Output-MP4",
      "link": "https://github.com/RNSsanjay/Old-Output-MP4"
    }
  ];
  
  
  

  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [sampleData, setSampleData] = useState(initialSampleData);
  const [savedMessage, setSavedMessage] = useState('');
  const [jsonFileName, setJsonFileName] = useState('repository-data.json');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setIsLoading(true);
    setError(null);
    setSavedMessage('');
    
    if (!file) {
      setIsLoading(false);
      return;
    }

    // Check if it's a JSON file - we'll try to load it directly
    if (file.type === 'application/json') {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const jsonContent = JSON.parse(event.target.result);
          if (Array.isArray(jsonContent)) {
            setRepos(jsonContent);
            setJsonData(JSON.stringify(jsonContent, null, 2));
            setSavedMessage('JSON file loaded successfully!');
            setTimeout(() => {
              setSavedMessage('');
            }, 3000);
          } else {
            setError('Invalid JSON format. Expected an array of repository objects.');
          }
          setIsLoading(false);
        } catch (err) {
          console.error("Error parsing JSON file:", err);
          setError("Failed to parse JSON file. Please make sure it's formatted correctly.");
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        setError("Failed to read the file.");
        setIsLoading(false);
      };
      
      reader.readAsText(file);
      return;
    }

    // Handle Excel files
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
        
        const parsedRepos = [];
        
        // Skip header row if exists
        const startRow = excelData[0][0] === "Repository Name" && excelData[0][1] === "Repository Link" ? 1 : 0;
        
        for (let i = startRow; i < excelData.length; i++) {
          const row = excelData[i];
          // Check if we have content in the row
          if (row.length >= 2 && row[0] && row[1]) {
            parsedRepos.push({
              name: row[0],
              link: row[1]
            });
          }
        }
        
        // Convert to JSON string for display
        const jsonString = JSON.stringify(parsedRepos, null, 2);
        setJsonData(jsonString);
        
        setRepos(parsedRepos);
        setIsLoading(false);
      } catch (err) {
        console.error("Error parsing Excel file:", err);
        setError("Failed to parse Excel file. Please make sure it's formatted correctly.");
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError("Failed to read the file.");
      setIsLoading(false);
    };
    
    reader.readAsArrayBuffer(file);
  };

  // Save the current data to JSON file and update sampleData
  const handleSave = () => {
    if (repos.length > 0) {
      // Update the sampleData in memory
      setSampleData(repos);
      
      // Create and download JSON file
      const jsonString = JSON.stringify(repos, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = jsonFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSavedMessage(`Data saved to ${jsonFileName} and updated in code!`);
      setTimeout(() => {
        setSavedMessage('');
      }, 3000);
    } else {
      setError('No data to save. Please upload an Excel file first.');
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  // Load JSON from file input
  const handleJsonFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonContent = JSON.parse(event.target.result);
        if (Array.isArray(jsonContent)) {
          setRepos(jsonContent);
          setJsonData(JSON.stringify(jsonContent, null, 2));
          setSampleData(jsonContent);
          setSavedMessage('JSON file loaded and data updated in code!');
        } else {
          setError('Invalid JSON format. Expected an array of repository objects.');
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error parsing JSON file:", err);
        setError("Failed to parse JSON file. Please make sure it's formatted correctly.");
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError("Failed to read the file.");
      setIsLoading(false);
    };
    
    reader.readAsText(file);
  };

  // Load sample data on component mount
  useEffect(() => {
    // Try to load from localStorage if available
    const storedData = localStorage.getItem('repositoryData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setSampleData(parsedData);
        setRepos(parsedData);
        setJsonData(JSON.stringify(parsedData, null, 2));
      } catch (err) {
        console.error("Error loading stored data:", err);
        // Fallback to initial data
        setRepos(initialSampleData);
        setJsonData(JSON.stringify(initialSampleData, null, 2));
      }
    } else {
      // Use initial data if nothing in storage
      setRepos(initialSampleData);
      setJsonData(JSON.stringify(initialSampleData, null, 2));
    }
  }, []);

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-800">My GitHub Projects</h1>
        
        {/* <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-800 mb-4">File Operations</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Upload Excel File</label>
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleFileUpload}
                className="block w-full text-sm text-green-700
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-100 file:text-green-700
                  hover:file:bg-green-200 cursor-pointer
                  border border-green-300 rounded-md p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Upload JSON File</label>
              <input 
                type="file" 
                accept="application/json" 
                onChange={handleJsonFileUpload}
                className="block w-full text-sm text-green-700
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-100 file:text-green-700
                  hover:file:bg-green-200 cursor-pointer
                  border border-green-300 rounded-md p-2"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-green-700 mb-2">JSON Filename</label>
                <input 
                  type="text" 
                  value={jsonFileName}
                  onChange={(e) => setJsonFileName(e.target.value)}
                  className="w-full p-2 border border-green-300 rounded-md"
                  placeholder="repository-data.json"
                />
              </div>
              
              <div className="pt-8">
                <button 
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md font-medium transition-colors duration-200"
                >
                  Save to JSON File
                </button>
              </div>
            </div>
            
            {isLoading && <p className="mt-2 text-sm text-green-600">Loading...</p>}
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {savedMessage && <p className="mt-2 text-sm font-medium text-green-600">{savedMessage}</p>}
          </div>
        </div>
        
        {jsonData && (
          <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Current JSON Data</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {jsonData}
            </pre>
          </div>
        )}
        
        <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-800 mb-2">sampleData in Code</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(sampleData, null, 2)}
          </pre>
        </div> */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {repos.map((repo, index) => (
    <a
      key={index}
      href={repo.link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-green-200 transform hover:-translate-y-2 hover:scale-105 transition-transform duration-300"
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
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">View Repository</span>
        </div>
      </div>
    </a>
  ))}
</div>

        
        {repos.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-green-600">No repositories found. Please upload an Excel or JSON file.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelToGithubCards;