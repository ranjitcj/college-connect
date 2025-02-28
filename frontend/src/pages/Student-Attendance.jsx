import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const StudentAttendance = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  
  // Chart refs
  const barChartRef = useRef(null);
  const radarChartRef = useRef(null);
  const polarChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  
  // Chart instances
  const barChartInstance = useRef(null);
  const radarChartInstance = useRef(null);
  const polarChartInstance = useRef(null);
  const doughnutChartInstance = useRef(null);
  
  const fetchAttendance = () => {
    if (!rollNumber) {
      alert("Please enter a roll number");
      return;
    }
    
    setLoading(true);
    setShowResults(false);
    
    const url = `https://script.google.com/macros/s/AKfycbxCtcHvxpj_uQTDhwwAsE5ItuVqArRerEemFQXWmH1fOJkXkOiffRTHFBf9ZA9TS7QW/exec?mode=fetch&class_code=CSC&subject_name=M3&roll=${encodeURIComponent(rollNumber)}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setAttendanceData(data);
        setLoading(false);
        setShowResults(true);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        alert("Error fetching data. Please try again.");
        setLoading(false);
      });
  };
  
  useEffect(() => {
    if (attendanceData && showResults) {
      processData(attendanceData);
    }
  }, [attendanceData, showResults]);
  
  const processData = (data) => {
    // Filter out the TOTAL entry for charts
    const subjectEntries = data.scores.filter(item => item.subject !== "TOTAL");
    const totalEntry = data.scores.find(item => item.subject === "TOTAL");
    
    // Get total attendance percentage
    const totalAttendance = totalEntry ? totalEntry.attendance : 0;
    
    // Prepare data for charts
    const subjects = subjectEntries.map(item => item.subject);
    const attendanceValues = subjectEntries.map(item => item.attendance);
    
    // Generate random colors for charts
    const colors = generateColors(subjectEntries.length);
    
    // Create charts
    createBarChart(subjects, attendanceValues, colors);
    createRadarChart(subjects, attendanceValues);
    createPolarChart(subjects, attendanceValues, colors);
    createDoughnutChart(subjects, attendanceValues, colors);
  };
  
  const createBarChart = (labels, data, colors) => {
    const ctx = barChartRef.current.getContext('2d');
    
    if (barChartInstance.current) {
      barChartInstance.current.destroy();
    }
    
    barChartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Attendance',
          data: data,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.7', '1')),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: 'Subject Attendance'
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    });
  };
  
  const createRadarChart = (labels, data) => {
    const ctx = radarChartRef.current.getContext('2d');
    
    if (radarChartInstance.current) {
      radarChartInstance.current.destroy();
    }
    
    radarChartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Attendance',
          data: data,
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: 'rgba(76, 175, 80, 1)',
          pointBackgroundColor: 'rgba(76, 175, 80, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(76, 175, 80, 1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: 'Attendance Profile'
          }
        },
        scales: {
          r: {
            angleLines: {
              display: true
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      }
    });
  };
  
  const createPolarChart = (labels, data, colors) => {
    const ctx = polarChartRef.current.getContext('2d');
    
    if (polarChartInstance.current) {
      polarChartInstance.current.destroy();
    }
    
    polarChartInstance.current = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: 'Attendance Distribution'
          }
        },
        scales: {
          r: {
            ticks: {
              backdropColor: 'rgba(0, 0, 0, 0)'
            }
          }
        }
      }
    });
  };
  
  const createDoughnutChart = (labels, data, colors) => {
    const ctx = doughnutChartRef.current.getContext('2d');
    
    if (doughnutChartInstance.current) {
      doughnutChartInstance.current.destroy();
    }
    
    doughnutChartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: 'white',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: 'Subject Comparison'
          }
        }
      }
    });
  };
  
  const generateColors = (count) => {
    const baseColors = [
      'rgba(76, 175, 80, 0.7)',    // Green
      'rgba(33, 150, 243, 0.7)',   // Blue
      'rgba(255, 152, 0, 0.7)',    // Orange
      'rgba(156, 39, 176, 0.7)',   // Purple
      'rgba(233, 30, 99, 0.7)',    // Pink
      'rgba(3, 169, 244, 0.7)'     // Light Blue
    ];
    
    // If we need more colors than in our base set, repeat them
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    
    return colors;
  };
  
  // Get attendance status based on percentage
  const getAttendanceStatus = (percentage) => {
    if (percentage >= 75) {
      return {
        class: 'status-good',
        message: 'Your attendance is good! Keep it up.'
      };
    } else if (percentage >= 60) {
      return {
        class: 'status-warning',
        message: 'Your attendance needs improvement. Try to attend more classes.'
      };
    } else {
      return {
        class: 'status-danger',
        message: 'Warning: Your attendance is critically low. You may not be eligible for exams.'
      };
    }
  };
  
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: '#1f2937',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        overflowX: 'hidden',
        border: '1px solid #374151',
        color: '#e5e7eb'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          background: 'linear-gradient(to right, #a78bfa, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          <h1>Student Attendance Dashboard</h1>
          <p style={{ color: '#d1d5db' }}>Enter a roll number to view detailed attendance analysis</p>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          <input 
            type="number" 
            min="1" 
            placeholder="Enter Roll Number" 
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #4b5563',
              borderRadius: '5px',
              fontSize: '16px',
              maxWidth: '100%',
              backgroundColor: '#374151',
              color: '#e5e7eb'
            }}
          />
          <button 
            onClick={fetchAttendance}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background-color 0.3s',
              fontWeight: 'bold'
            }}
          >
            Get Attendance
          </button>
        </div>
        
        {loading && (
          <div style={{
            border: '5px solid #374151',
            borderTop: '5px solid #8b5cf6',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '20px auto'
          }}></div>
        )}
        
        {showResults && attendanceData && (
          <div>
            <div style={{
              width: '100%',
              margin: '20px auto',
              backgroundColor: '#f0f0f0',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '30px',
                width: `${attendanceData.scores.find(item => item.subject === "TOTAL")?.attendance.toFixed(1)}%`,
                backgroundColor: '#4caf50',
                textAlign: 'center',
                lineHeight: '30px',
                color: 'white',
                borderRadius: '10px',
                transition: 'width 0.5s ease-in-out'
              }}>
                {attendanceData.scores.find(item => item.subject === "TOTAL")?.attendance.toFixed(1)}%
              </div>
            </div>
            
            <div style={{
              width: '100%',
              marginBottom: '30px',
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden'
              }}>
                <canvas ref={barChartRef}></canvas>
              </div>
              <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden'
              }}>
                <canvas ref={radarChartRef}></canvas>
              </div>
            </div>
            
            <div style={{
              width: '100%',
              marginBottom: '30px',
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden'
              }}>
                <canvas ref={polarChartRef}></canvas>
              </div>
              <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden'
              }}>
                <canvas ref={doughnutChartRef}></canvas>
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#2a3441',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '20px',
              overflowX: 'auto',
              border: '1px solid #374151'
            }}>
              <h3 style={{ 
                textAlign: 'center',
                color: '#e5e7eb'
              }}>Attendance Summary</h3>
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '5px'
              }}>
                {attendanceData.scores
                  .filter(item => item.subject !== "TOTAL")
                  .map((item, index) => (
                    <div 
                      key={index} 
                      style={{
                        display: 'inline-block',
                        padding: '8px 15px',
                        borderRadius: '20px',
                        margin: '5px',
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: item.attendance >= 75 
                          ? '#6366f1' 
                          : item.attendance >= 60 
                            ? '#eab308' 
                            : '#ef4444',
                        ...(item.attendance >= 60 && item.attendance < 75 ? { color: '#1f2937' } : {})
                      }}
                    >
                      {item.subject}: {item.attendance.toFixed(1)}%
                    </div>
                  ))
                }
              </div>
              
              {attendanceData.scores.find(item => item.subject === "TOTAL") && (
                <>
                  <p style={{ 
                    textAlign: 'center',
                    color: '#e5e7eb' 
                  }}>
                    Overall Attendance: {attendanceData.scores.find(item => item.subject === "TOTAL").attendance.toFixed(1)}%
                  </p>
                  
                  {attendanceData.scores.filter(item => item.subject !== "TOTAL").length > 0 && (
                    <>
                      <p style={{ 
                        textAlign: 'center',
                        color: '#e5e7eb'
                      }}>
                        Highest Attendance: {
                          attendanceData.scores
                            .filter(item => item.subject !== "TOTAL")
                            .reduce((max, item) => item.attendance > max.attendance ? item : max, 
                              attendanceData.scores.filter(item => item.subject !== "TOTAL")[0])
                            .subject
                        } ({
                          attendanceData.scores
                            .filter(item => item.subject !== "TOTAL")
                            .reduce((max, item) => item.attendance > max.attendance ? item : max, 
                              attendanceData.scores.filter(item => item.subject !== "TOTAL")[0])
                            .attendance.toFixed(1)
                        }%)
                      </p>
                      
                      <p style={{ 
                        textAlign: 'center',
                        color: '#e5e7eb'
                      }}>
                        Lowest Attendance: {
                          attendanceData.scores
                            .filter(item => item.subject !== "TOTAL")
                            .reduce((min, item) => item.attendance < min.attendance ? item : min, 
                              attendanceData.scores.filter(item => item.subject !== "TOTAL")[0])
                            .subject
                        } ({
                          attendanceData.scores
                            .filter(item => item.subject !== "TOTAL")
                            .reduce((min, item) => item.attendance < min.attendance ? item : min, 
                              attendanceData.scores.filter(item => item.subject !== "TOTAL")[0])
                            .attendance.toFixed(1)
                        }%)
                      </p>
                    </>
                  )}
                  
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '1.2em',
                    padding: '10px',
                    borderRadius: '5px',
                    marginTop: '15px',
                    textAlign: 'center',
                    backgroundColor: getAttendanceStatus(attendanceData.scores.find(item => item.subject === "TOTAL").attendance).class === 'status-good' 
                      ? 'rgba(79, 70, 229, 0.2)' 
                      : getAttendanceStatus(attendanceData.scores.find(item => item.subject === "TOTAL").attendance).class === 'status-warning' 
                        ? 'rgba(234, 179, 8, 0.2)' 
                        : 'rgba(239, 68, 68, 0.2)',
                    color: getAttendanceStatus(attendanceData.scores.find(item => item.subject === "TOTAL").attendance).class === 'status-good' 
                      ? '#8b5cf6' 
                      : getAttendanceStatus(attendanceData.scores.find(item => item.subject === "TOTAL").attendance).class === 'status-warning' 
                        ? '#eab308' 
                        : '#ef4444'
                  }}>
                    {getAttendanceStatus(attendanceData.scores.find(item => item.subject === "TOTAL").attendance).message}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .chart-box {
            width: 100%;
            max-width: 100%;
          }
          .container {
            padding: 15px;
          }
          .input-section {
            flex-direction: column;
            align-items: center;
          }
          .input-section input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default StudentAttendance
