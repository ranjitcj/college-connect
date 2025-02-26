'use client';

import React, { useState, useEffect } from 'react';
import { ClassData, SelectionType, AttendanceData } from './types';

export default function AttendancePage() {
  // State for selections
  const [selections, setSelections] = useState<{
    Branch: string | null;
    Year: string | null;
    Division: string | null;
    Subject: string | null;
  }>({
    Branch: null,
    Year: null,
    Division: null,
    Subject: null,
  });

  // State for attendance tracking
  const [presentCount, setPresentCount] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [attendanceData, setAttendanceData] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Class data (in a real app, this would come from an API)
  const classData: ClassData = {
    classrooms: [
      {
        branches: [
          {
            branchName: "Computer",
            code: "C",
            years: {
              "SE": { 
                code: "S", 
                "A": { 
                  strength: 40,
                  subjects: ["M3", "DBMS", "CN", "OOP", "DS"]
                }, 
                "B": { 
                  strength: 38,
                  subjects: ["M3", "DBMS", "CN", "OOP", "DS"]
                }, 
                "C": { 
                  strength: 90,
                  subjects: ["M3", "PPL", "SE", "MP", "DSA"]
                } 
              },
              "TE": { 
                code: "T", 
                "A": { 
                  strength: 42,
                  subjects: ["ML", "AI", "IoT", "SPOS", "DAA"]
                } 
              },
              "BE": { 
                code: "B", 
                "A": { 
                  strength: 45,
                  subjects: ["HPC", "ICS", "CP", "ESD", "ML"]
                } 
              }
            }
          },
          {
            branchName: "Electronics",
            code: "E",
            years: {
              "SE": { 
                code: "S", 
                "A": { 
                  strength: 35,
                  subjects: ["DE", "AM", "ES", "SS", "CS"]
                }, 
                "B": { 
                  strength: 30,
                  subjects: ["DE", "AM", "ES", "SS", "CS"]
                } 
              },
              "TE": { 
                code: "T", 
                "A": { 
                  strength: 38,
                  subjects: ["VLSI", "MC", "CT", "EF", "PE"]
                } 
              },
              "BE": { 
                code: "B",
                "A": {
                  strength: 40,
                  subjects: ["AE", "DSP", "OC", "WC", "SC"]
                }
              }
            }
          }
        ]
      }
    ]
  };

  // Function to clear selections when a higher-level option is changed
  const clearSelections = (fromKey: string) => {
    const keys = ["Year", "Division", "Subject"];
    let clear = false;
    
    const newSelections = { ...selections };
    
    keys.forEach(key => {
      if (key === fromKey) clear = true;
      if (clear) {
        newSelections[key as keyof typeof selections] = null;
      }
    });
    
    setSelections(newSelections);
    
    // If subject is cleared, reset student grid
    if (fromKey === "Subject" || fromKey === "Year" || fromKey === "Division") {
      setPresentCount(0);
      setTotalStudents(0);
      setAttendanceData([]);
      setStatusMessage(null);
      setIsSubmitted(false);
    }
  };

  // Function to handle selection change
  const handleSelectionChange = (key: SelectionType, value: string) => {
    setIsSubmitted(false);
    setStatusMessage(null);
    
    setSelections(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Clear lower-level selections
    clearSelections(key);
  };

  // Function to toggle student attendance
  const toggleAttendance = (index: number) => {
    if (isSubmitted) return;
    
    const newAttendanceData = [...attendanceData];
    const currentStatus = newAttendanceData[index];
    const newStatus = currentStatus === 'P' ? 'A' : 'P';
    newAttendanceData[index] = newStatus;
    
    setAttendanceData(newAttendanceData);
    setPresentCount(prev => newStatus === 'P' ? prev + 1 : prev - 1);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!selections.Branch || !selections.Year || !selections.Division || !selections.Subject) {
      setStatusMessage({
        message: 'Please complete all selections first.',
        isError: true
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const branch = classData.classrooms[0].branches.find(b => b.branchName === selections.Branch);
    const year = branch?.years[selections.Year as keyof typeof branch.years]?.code || "X";
    const division = selections.Division || "X";
    const classCode = `${branch?.code || "X"}${year}${division}`;
    
    // Current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Prepare attendance data with date
    const submissionData = [currentDate, ...attendanceData];
    const attendanceString = submissionData.join(',');
    
    try {
      const response = await fetch('/api/classattendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classCode,
          subjectName: selections.Subject,
          attendance: attendanceString
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit attendance');
      }
      
      setStatusMessage({
        message: data.message || 'Attendance submitted successfully!',
        isError: false
      });
      setIsSubmitted(true);
    } catch (error) {
      setStatusMessage({
        message: error instanceof Error ? error.message : 'An error occurred. Please try again.',
        isError: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Effect to generate student grid when subject is selected
  useEffect(() => {
    if (selections.Branch && selections.Year && selections.Division && selections.Subject) {
      const branch = classData.classrooms[0].branches.find(b => b.branchName === selections.Branch);
      const strength = branch?.years[selections.Year as keyof typeof branch.years]?.[selections.Division as keyof typeof branch.years[keyof typeof branch.years]]?.strength || 0;
      
      if (strength > 0) {
        setTotalStudents(strength);
        setAttendanceData(new Array(strength).fill('A'));
        setPresentCount(0);
      }
    }
  }, [selections.Subject, selections.Branch, selections.Year, selections.Division]);

  // Get next selection options
  const getSelectionOptions = (key: SelectionType) => {
    switch (key) {
      case 'Branch':
        return classData.classrooms[0].branches.map(b => b.branchName);
      case 'Year':
        if (selections.Branch) {
          const branch = classData.classrooms[0].branches.find(b => b.branchName === selections.Branch);
          return branch ? Object.keys(branch.years) : [];
        }
        return [];
      case 'Division':
        if (selections.Branch && selections.Year) {
          const branch = classData.classrooms[0].branches.find(b => b.branchName === selections.Branch);
          const yearData = branch?.years[selections.Year as keyof typeof branch.years];
          return yearData ? Object.keys(yearData).filter(k => k !== 'code') : [];
        }
        return [];
      case 'Subject':
        if (selections.Branch && selections.Year && selections.Division) {
          const branch = classData.classrooms[0].branches.find(b => b.branchName === selections.Branch);
          const divisionData = branch?.years[selections.Year as keyof typeof branch.years]?.[selections.Division as keyof typeof branch.years[keyof typeof branch.years]];
          return divisionData?.subjects || [];
        }
        return [];
      default:
        return [];
    }
  };

  // Calculate class code and other summary info
  const getClassCode = () => {
    if (!selections.Branch || !selections.Year || !selections.Division) return 'N/A';
    
    const branch = classData.classrooms[0].branches.find(b => b.branchName === selections.Branch);
    const year = branch?.years[selections.Year as keyof typeof branch.years]?.code || "X";
    const division = selections.Division || "X";
    return `${branch?.code || "X"}${year}${division}`;
  };

  const absentCount = totalStudents - presentCount;
  const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <header className="w-full bg-green-500 text-white p-5 text-center shadow-md">
        <h1 className="text-2xl font-bold">Attendance Management System</h1>
      </header>
      
      <main className="max-w-3xl w-11/12 mx-auto p-5 my-5 bg-white rounded-lg shadow-md">
        <form>
          {/* Selection Container */}
          <div className="mb-6">
            {/* Branch Selection */}
            <div className="mb-4">
              <h2 className="font-bold text-lg mb-2">Branch:</h2>
              <div className="flex flex-wrap gap-2">
                {getSelectionOptions('Branch').map(option => (
                  <div 
                    key={option}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      selections.Branch === option 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    onClick={() => handleSelectionChange('Branch', option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Year Selection */}
            {selections.Branch && (
              <div className="mb-4">
                <h2 className="font-bold text-lg mb-2">Year:</h2>
                <div className="flex flex-wrap gap-2">
                  {getSelectionOptions('Year').map(option => (
                    <div 
                      key={option}
                      className={`p-2 rounded cursor-pointer transition-colors ${
                        selections.Year === option 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      onClick={() => handleSelectionChange('Year', option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Division Selection */}
            {selections.Year && (
              <div className="mb-4">
                <h2 className="font-bold text-lg mb-2">Division:</h2>
                <div className="flex flex-wrap gap-2">
                  {getSelectionOptions('Division').map(option => (
                    <div 
                      key={option}
                      className={`p-2 rounded cursor-pointer transition-colors ${
                        selections.Division === option 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      onClick={() => handleSelectionChange('Division', option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Subject Selection */}
            {selections.Division && (
              <div className="mb-4">
                <h2 className="font-bold text-lg mb-2">Subject:</h2>
                <div className="flex flex-wrap gap-2">
                  {getSelectionOptions('Subject').map(option => (
                    <div 
                      key={option}
                      className={`p-2 rounded cursor-pointer transition-colors ${
                        selections.Subject === option 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      onClick={() => handleSelectionChange('Subject', option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Class Header */}
          {selections.Subject && (
            <div className="flex justify-between items-center my-5">
              <span className="text-lg font-medium">
                {selections.Year} {selections.Branch} {selections.Division}
              </span>
              <div>
                <span className="inline-block px-4 py-2 rounded bg-green-500 text-white font-bold mr-2">
                  {presentCount}
                </span>
                <span className="inline-block px-4 py-2 rounded bg-red-500 text-white font-bold">
                  {absentCount}
                </span>
              </div>
            </div>
          )}
          
          {/* Student Grid */}
          {selections.Subject && totalStudents > 0 && (
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 my-5">
              {Array.from({ length: totalStudents }).map((_, index) => (
                <div 
                  key={index}
                  className={`w-12 h-12 flex items-center justify-center text-lg font-bold text-white rounded cursor-pointer transition-colors ${
                    attendanceData[index] === 'P' ? 'bg-green-400 hover:bg-green-500' : 'bg-red-400 hover:bg-red-500'
                  } ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                  onClick={() => !isSubmitted && toggleAttendance(index)}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          )}
          
          {/* Attendance Summary */}
          <div className="my-5 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="my-1">Selected: {Object.values(selections).filter(Boolean).join(' ') || 'None'}</p>
            <p className="my-1">Class Code: {getClassCode()}</p>
            <p className="my-1">Subject: {selections.Subject || 'Not Selected'}</p>
            <p className="my-1">Total Students: {totalStudents}</p>
            <p className="my-1">Present Students: {presentCount}</p>
            <p className="my-1">Absent Students: {absentCount}</p>
            <p className="my-1">Attendance Percentage: {attendancePercentage}%</p>
          </div>
          
          {/* Status Message */}
          {statusMessage && (
            <div className={`my-4 p-3 rounded text-center ${
              statusMessage.isError 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {statusMessage.message}
            </div>
          )}
          
          {/* Submit Button */}
          <button
            type="button"
            className={`w-full p-3 rounded text-white font-medium text-lg transition-colors ${
              !selections.Subject || isSubmitted
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            }`}
            disabled={!selections.Subject || isSubmitted || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                Submitting...
                <span className="inline-block ml-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              </>
            ) : isSubmitted ? (
              'Attendance Submitted'
            ) : (
              'Submit Attendance'
            )}
          </button>
        </form>
      </main>
    </div>
  );
}