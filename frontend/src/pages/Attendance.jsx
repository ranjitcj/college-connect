import React, { useState, useEffect } from 'react';
const Attendance = () => {
  // Data for class selection
  const classData = {
    "classrooms": [
      {
        "branches": [
          {
            "branchName": "Computer",
            "code": "C",
            "years": {
              "SE": {
                "code": "S",
                "A": {
                  "strength": 40,
                  "subjects": ["M3", "DBMS", "CN", "OOP", "DS"]
                },
                "B": {
                  "strength": 38,
                  "subjects": ["M3", "DBMS", "CN", "OOP", "DS"]
                },
                "C": {
                  "strength": 90,
                  "subjects": ["M3", "PPL", "SE", "MP", "DSA"]
                }
              },
              "TE": {
                "code": "T",
                "A": {
                  "strength": 42,
                  "subjects": ["ML", "AI", "IoT", "SPOS", "DAA"]
                }
              },
              "BE": {
                "code": "B",
                "A": {
                  "strength": 45,
                  "subjects": ["HPC", "ICS", "CP", "ESD", "ML"]
                }
              }
            }
          },
          {
            "branchName": "Electronics",
            "code": "E",
            "years": {
              "SE": {
                "code": "S",
                "A": {
                  "strength": 35,
                  "subjects": ["DE", "AM", "ES", "SS", "CS"]
                },
                "B": {
                  "strength": 30,
                  "subjects": ["DE", "AM", "ES", "SS", "CS"]
                }
              },
              "TE": {
                "code": "T",
                "A": {
                  "strength": 38,
                  "subjects": ["VLSI", "MC", "CT", "EF", "PE"]
                }
              },
              "BE": {
                "code": "B",
                "A": {
                  "strength": 40,
                  "subjects": ["AE", "DSP", "OC", "WC", "SC"]
                }
              }
            }
          }
        ]
      }
    ]
  };

  // State variables
  const [selections, setSelections] = useState({ Branch: null, Year: null, Division: null, Subject: null });
  const [presentCount, setPresentCount] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ message: '', isError: false, show: false });
  const [loading, setLoading] = useState(false);
  const [availableOptions, setAvailableOptions] = useState({
    branches: classData.classrooms[0].branches.map(b => b.branchName),
    years: [],
    divisions: [],
    subjects: []
  });

  // Clear selections when a higher-level option is changed
  const clearSelections = (fromKey) => {
    const keys = ["Branch", "Year", "Division", "Subject"];
    const startIndex = keys.indexOf(fromKey) + 1;
    
    if (startIndex >= keys.length) return;
    
    let newSelections = { ...selections };
    
    for (let i = startIndex; i < keys.length; i++) {
      newSelections[keys[i]] = null;
    }
    
    setSelections(newSelections);
    
    // Reset attendance if subject is cleared
    if (fromKey === "Branch" || fromKey === "Year" || fromKey === "Division" || newSelections.Subject === null) {
      setPresentCount(0);
      setTotalStudents(0);
      setAttendanceData([]);
      setStatusMessage({ message: '', isError: false, show: false });
      setIsSubmitted(false);
    }
  };

  // Update the next selection options based on current selection
  const updateNextSelection = (key, value) => {
    let newOptions = { ...availableOptions };
    
    if (key === "Branch") {
      const branch = classData.classrooms[0].branches.find(b => b.branchName === value);
      if (branch) {
        newOptions.years = Object.keys(branch.years);
        newOptions.divisions = [];
        newOptions.subjects = [];
      }
    }
    else if (key === "Year") {
      const branch = classData.classrooms[0].branches.find(b => b.branchName === selections.Branch);
      if (branch && branch.years[value]) {
        const divisions = Object.keys(branch.years[value]).filter(k => k !== "code");
        newOptions.divisions = divisions;
        newOptions.subjects = [];
      }
    }
    else if (key === "Division") {
      const branch = classData.classrooms[0].branches.find(b => b.branchName === selections.Branch);
      if (branch && branch.years[selections.Year] && branch.years[selections.Year][value]) {
        const subjects = branch.years[selections.Year][value].subjects || [];
        newOptions.subjects = subjects;
      }
    }
    
    setAvailableOptions(newOptions);
  };

  // Handle option selection
  // Update the state management for selections
const handleSelection = (key, value) => {
  // Reset submission status on any new selection
  setIsSubmitted(false);
  setStatusMessage({ message: '', isError: false, show: false });
  
  // Create new selections object with the updated value
  const newSelections = { ...selections, [key]: value };
  
  // Clear dependent selections
  const keys = ["Branch", "Year", "Division", "Subject"];
  const startIndex = keys.indexOf(key) + 1;
  
  if (startIndex < keys.length) {
    for (let i = startIndex; i < keys.length; i++) {
      newSelections[keys[i]] = null;
    }
  }
  
  // Update the state with new selections
  setSelections(newSelections);
  
  // Update available options based on the new selection
  let newOptions = { ...availableOptions };
  
  if (key === "Branch") {
    const branch = classData.classrooms[0].branches.find(b => b.branchName === value);
    if (branch) {
      newOptions.years = Object.keys(branch.years);
      newOptions.divisions = [];
      newOptions.subjects = [];
    }
  }
  else if (key === "Year") {
    const branch = classData.classrooms[0].branches.find(b => b.branchName === newSelections.Branch);
    if (branch && branch.years[value]) {
      const divisions = Object.keys(branch.years[value]).filter(k => k !== "code");
      newOptions.divisions = divisions;
      newOptions.subjects = [];
    }
  }
  else if (key === "Division") {
    const branch = classData.classrooms[0].branches.find(b => b.branchName === newSelections.Branch);
    if (branch && branch.years[newSelections.Year] && branch.years[newSelections.Year][value]) {
      const subjects = branch.years[newSelections.Year][value].subjects || [];
      newOptions.subjects = subjects;
    }
  }
  
  setAvailableOptions(newOptions);
  
  // Reset attendance if needed
  if (key === "Branch" || key === "Year" || key === "Division") {
    setPresentCount(0);
    setTotalStudents(0);
    setAttendanceData([]);
  }
};


useEffect(() => {
  if (selections.Branch && selections.Year && selections.Division && selections.Subject) {
    const branch = classData.classrooms[0].branches.find(b => b.branchName === selections.Branch);
    if (!branch || !branch.years[selections.Year] || !branch.years[selections.Year][selections.Division]) return;
    
    const strength = branch.years[selections.Year][selections.Division].strength || 0;
    
    if (strength > 0) {
      // Reset attendance
      setPresentCount(0);
      setTotalStudents(strength);
      
      // Initialize all students as 'Absent'
      const newAttendanceData = new Array(strength).fill('A');
      setAttendanceData(newAttendanceData);
    }
  }
}, [selections]);

    
    
    
  // Generate student grid
  const generateStudentGrid = () => {
    if (!selections.Branch || !selections.Year || !selections.Division) return;
    
    const branch = classData.classrooms[0].branches.find(b => b.branchName === selections.Branch);
    if (!branch || !branch.years[selections.Year] || !branch.years[selections.Year][selections.Division]) return;
    
    const strength = branch.years[selections.Year][selections.Division].strength || 0;
    
    if (strength > 0) {
      // Reset attendance
      setPresentCount(0);
      setTotalStudents(strength);
      
      // Initialize all students as 'Absent'
      const newAttendanceData = new Array(strength).fill('A');
      setAttendanceData(newAttendanceData);
    }
  };

  // Toggle attendance state
  const toggleAttendance = (index) => {
    if (isSubmitted) return;
    
    const newAttendanceData = [...attendanceData];
    const currentStatus = newAttendanceData[index];
    const newStatus = currentStatus === 'P' ? 'A' : 'P';
    newAttendanceData[index] = newStatus;
    
    setAttendanceData(newAttendanceData);
    
    // Update present count based on new attendance data
    const newPresentCount = newAttendanceData.filter(status => status === 'P').length;
    setPresentCount(newPresentCount);
  };

  // Submit attendance
  const submitAttendance = (e) => {
    // Prevent form submission if called from a form
    if (e) e.preventDefault();
    
    if (!selections.Branch || !selections.Year || !selections.Division || !selections.Subject) {
      setStatusMessage({
        message: 'Please complete all selections first.',
        isError: true,
        show: true
      });
      return;
    }
    
    if (attendanceData.length === 0) {
      setStatusMessage({
        message: 'No students to mark attendance for.',
        isError: true,
        show: true
      });
      return;
    }
    
    // Set loading state
    setLoading(true);
    
    try {
      const branch = classData.classrooms[0].branches.find(b => b.branchName === selections.Branch);
      const year = branch?.years[selections.Year]?.code || "X";
      const division = selections.Division || "X";
      const classCode = `${branch?.code || "X"}${year}${division}`;
      
      // Current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Prepare attendance data with date
      const submissionData = [currentDate, ...attendanceData];
      const attendanceString = submissionData.join(',');
      
    
      const url = new URL("https://script.google.com/macros/s/AKfycbxCtcHvxpj_uQTDhwwAsE5ItuVqArRerEemFQXWmH1fOJkXkOiffRTHFBf9ZA9TS7QW/exec");
      url.searchParams.append("mode", "push");
      url.searchParams.append("class_code", classCode);
      url.searchParams.append("subject_name", selections.Subject);
      url.searchParams.append("attendance", attendanceString);
      
      console.log("Submitting attendance to:", url.toString());
      
      // Send request with CORS mode specified
      fetch(url, {
        method: "GET",
        mode: "cors", // Explicitly set CORS mode
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.error) {
          // Handle error response
          throw new Error(data.error);
        } else {
          // Handle success response
          setStatusMessage({
            message: data.message || 'Attendance submitted successfully!',
            isError: false,
            show: true
          });
          setIsSubmitted(true);
        }
      })
      .catch(error => {
        console.error("Error submitting attendance:", error);
        setStatusMessage({
          message: `Error: ${error.message || 'Unknown error occurred'}. Please try again.`,
          isError: true,
          show: true
        });
        setIsSubmitted(false);
      })
      .finally(() => {
        setLoading(false);
      });
    } catch (error) {
      console.error("Exception in submission process:", error);
      setStatusMessage({
        message: `Error: ${error.message || 'Unknown error occurred'}. Please try again.`,
        isError: true,
        show: true
      });
      setLoading(false);
    }
  };

  // Get class code
  const getClassCode = () => {
    if (!selections.Branch || !selections.Year || !selections.Division) return "N/A";
    
    const branch = classData.classrooms[0].branches.find(b => b.branchName === selections.Branch);
    if (!branch || !branch.years[selections.Year]) return "N/A";
    
    const year = branch.years[selections.Year].code || "X";
    const division = selections.Division || "X";
    return `${branch.code || "X"}${year}${division}`;
  };

  return (
    
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <header className="bg-green-500 text-white p-5 text-center w-full mb-5 shadow-md">
        <h1 className="text-2xl font-bold">Attendance Management System</h1>
      </header>
      
      <main className="max-w-4xl w-11/12 mx-auto p-5 bg-white rounded-lg shadow-md">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Selection Options */}
          <div className="mb-4">
            {/* Branch Selection */}
            <div className="mb-4">
              <span className="block text-lg font-bold mb-2">Branch:</span>
              <div className="flex flex-wrap">
                {availableOptions.branches.map((branch) => (
                  <div
                    key={branch}
                    className={`px-3 py-2 bg-gray-200 m-1 cursor-pointer rounded hover:bg-green-500 hover:text-white ${selections.Branch === branch ? 'bg-green-500 text-white' : ''}`}
                    onClick={() => handleSelection('Branch', branch)}
                  >
                    {branch}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Year Selection */}
            {selections.Branch && (
              <div className="mb-4">
                <span className="block text-lg font-bold mb-2">Year:</span>
                <div className="flex flex-wrap">
                  {availableOptions.years.map((year) => (
                    <div
                      key={year}
                      className={`px-3 py-2 bg-gray-200 m-1 cursor-pointer rounded hover:bg-green-500 hover:text-white ${selections.Year === year ? 'bg-green-500 text-white' : ''}`}
                      onClick={() => handleSelection('Year', year)}
                    >
                      {year}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Division Selection */}
            {selections.Year && (
              <div className="mb-4">
                <span className="block text-lg font-bold mb-2">Division:</span>
                <div className="flex flex-wrap">
                  {availableOptions.divisions.map((division) => (
                    <div
                      key={division}
                      className={`px-3 py-2 bg-gray-200 m-1 cursor-pointer rounded hover:bg-green-500 hover:text-white ${selections.Division === division ? 'bg-green-500 text-white' : ''}`}
                      onClick={() => handleSelection('Division', division)}
                    >
                      {division}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Subject Selection */}
            {selections.Division && (
              <div className="mb-4">
                <span className="block text-lg font-bold mb-2">Subject:</span>
                <div className="flex flex-wrap">
                  {availableOptions.subjects.map((subject) => (
                    <div
                      key={subject}
                      className={`px-3 py-2 bg-gray-200 m-1 cursor-pointer rounded hover:bg-green-500 hover:text-white ${selections.Subject === subject ? 'bg-green-500 text-white' : ''}`}
                      onClick={() => handleSelection('Subject', subject)}
                    >
                      {subject}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Class Header with Status */}
          {selections.Subject && totalStudents > 0 && (
            <div className="flex justify-between items-center my-5 w-full">
              <span className="text-lg font-medium">
                {selections.Year} {selections.Branch} {selections.Division}
              </span>
              <div>
                <span className="inline-block px-4 py-2 rounded bg-green-500 text-white font-bold mr-2">
                  Present: {presentCount}
                </span>
                <span className="inline-block px-4 py-2 rounded bg-orange-500 text-white font-bold">
                  Absent: {totalStudents - presentCount}
                </span>
              </div>
            </div>
          )}
          
          {/* Student Grid */}
          {selections.Subject && attendanceData.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2 my-5">
              {attendanceData.map((status, index) => (
                <div
                  key={index}
                  className={`w-14 h-14 flex justify-center items-center font-mono text-lg text-white font-bold rounded cursor-pointer transition-colors duration-300 ${status === 'P' ? 'bg-green-400 hover:bg-green-500' : 'bg-orange-500 hover:bg-orange-600'}`}
                  onClick={() => toggleAttendance(index)}
                  style={isSubmitted ? { cursor: 'default' } : {}}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          )}
          
          {/* Attendance Summary */}
          {selections.Subject && totalStudents > 0 && (
            <div className="my-5 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="my-1 text-base">Selected: {selections.Year && selections.Branch && selections.Division ? `${selections.Year} ${selections.Branch} ${selections.Division}` : 'None'}</p>
              <p className="my-1 text-base">Class Code: {getClassCode()}</p>
              <p className="my-1 text-base">Subject: {selections.Subject || 'Not Selected'}</p>
              <p className="my-1 text-base">Total Students: {totalStudents}</p>
              <p className="my-1 text-base">Present Students: {presentCount}</p>
              <p className="my-1 text-base">Absent Students: {totalStudents - presentCount}</p>
              <p className="my-1 text-base">Attendance Percentage: {totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0}%</p>
            </div>
          )}
          
          {/* Status Message */}
          {statusMessage.show && (
            <div className={`my-4 p-3 rounded text-center ${statusMessage.isError ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'}`}>
              {statusMessage.message}
            </div>
          )}
          
          {/* Submit Button */}
          {selections.Subject && totalStudents > 0 && (
            <button
              type="button"
              className={`w-full p-3 rounded text-white text-base ${!selections.Subject || isSubmitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
              onClick={submitAttendance}
              disabled={!selections.Subject || isSubmitted || loading}
            >
              {loading ? (
                <span>
                  Submitting...
                  <span className="inline-block w-5 h-5 ml-2 border-2 border-white border-t-transparent rounded-full animate-spin align-middle"></span>
                </span>
              ) : isSubmitted ? 'Attendance Submitted' : 'Submit Attendance'}
            </button>
          )}
        </form>
      </main>
    </div>
  );
};

export default Attendance;

