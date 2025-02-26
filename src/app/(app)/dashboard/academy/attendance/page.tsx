"use client";

import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AttendanceDashboard() {
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [attendanceSummary, setAttendanceSummary] = useState({
    totalAttendance: 0,
    highest: { subject: "", attendance: 0 },
    lowest: { subject: "", attendance: 0 },
    subjects: [],
  });

  // Refs for chart canvases
  const barChartRef = useRef(null);
  const radarChartRef = useRef(null);
  const polarChartRef = useRef(null);
  const doughnutChartRef = useRef(null);

  // Refs for chart instances
  const barChartInstance = useRef(null);
  const radarChartInstance = useRef(null);
  const polarChartInstance = useRef(null);
  const doughnutChartInstance = useRef(null);

  const fetchAttendance = async () => {
    if (!rollNumber) {
      alert("Please enter a roll number");
      return;
    }

    setLoading(true);
    setShowResults(false);

    try {
      const response = await fetch(
        `/api/attendance?roll=${encodeURIComponent(rollNumber)}`
      );
      // const response = await fetch(`/api/attendance`);
      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }

      const data = await response.json();
      // const userdata = await UserModel.findOne({username: user.username})
      // const data =userdata?.rollno;
      setAttendanceData(data);
      processData(data);
      setShowResults(true);

      setAttendanceData(data);
      processData(data);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const processData = (data: { scores: any[] }) => {
    // Filter out the TOTAL entry for charts
    const subjectEntries = data.scores.filter(
      (item: { subject: string }) => item.subject !== "TOTAL"
    );
    const totalEntry = data.scores.find(
      (item: { subject: string }) => item.subject === "TOTAL"
    );

    // Get total attendance percentage
    const totalAttendance = totalEntry ? totalEntry.attendance : 0;

    // Update progress
    setProgress(totalAttendance);

    // Prepare data for charts
    const subjects = subjectEntries.map(
      (item: { subject: any }) => item.subject
    );
    const attendanceValues = subjectEntries.map(
      (item: { attendance: any }) => item.attendance
    );

    // Generate colors for charts
    const colors = generateColors(subjectEntries.length);

    // Update summary
    const highest = subjectEntries.reduce(
      (max: { attendance: number }, item: { attendance: number }) =>
        item.attendance > max.attendance ? item : max,
      subjectEntries[0]
    );
    const lowest = subjectEntries.reduce(
      (min: { attendance: number }, item: { attendance: number }) =>
        item.attendance < min.attendance ? item : min,
      subjectEntries[0]
    );

    setAttendanceSummary({
      totalAttendance,
      highest,
      lowest,
      subjects: subjectEntries as any,
    });

    // Create charts after a short delay to ensure DOM is ready
    setTimeout(() => {
      createBarChart(subjects, attendanceValues, colors);
      createRadarChart(subjects, attendanceValues);
      createPolarChart(subjects, attendanceValues, colors);
      createDoughnutChart(subjects, attendanceValues, colors);
    }, 100);
  };

  const createBarChart = (labels: any, data: any, colors: any[]) => {
    if (!barChartRef.current) return;

    const ctx = barChartRef.current.getContext("2d");

    if (barChartInstance.current) {
      barChartInstance.current.destroy();
    }

    barChartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Attendance",
            data: data,
            backgroundColor: colors,
            borderColor: colors.map((color: string) =>
              color.replace("0.7", "1")
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: "Subject Attendance",
          },
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function (value) {
                return value + "%";
              },
            },
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45,
            },
          },
        },
      },
    });
  };

  const createRadarChart = (labels: any, data: any) => {
    if (!radarChartRef.current) return;

    const ctx = radarChartRef.current.getContext("2d");

    if (radarChartInstance.current) {
      radarChartInstance.current.destroy();
    }

    radarChartInstance.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Attendance",
            data: data,
            backgroundColor: "rgba(76, 175, 80, 0.2)",
            borderColor: "rgba(76, 175, 80, 1)",
            pointBackgroundColor: "rgba(76, 175, 80, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(76, 175, 80, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: "Attendance Profile",
          },
        },
        scales: {
          r: {
            angleLines: {
              display: true,
            },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
      },
    });
  };

  const createPolarChart = (labels: any, data: any, colors: string[]) => {
    if (!polarChartRef.current) return;

    const ctx = polarChartRef.current.getContext("2d");

    if (polarChartInstance.current) {
      polarChartInstance.current.destroy();
    }

    polarChartInstance.current = new Chart(ctx, {
      type: "polarArea",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: "Attendance Distribution",
          },
        },
        scales: {
          r: {
            ticks: {
              backdropColor: "rgba(0, 0, 0, 0)",
            },
          },
        },
      },
    });
  };

  const createDoughnutChart = (labels: any, data: any, colors: string[]) => {
    if (!doughnutChartRef.current) return;

    const ctx = doughnutChartRef.current.getContext("2d");

    if (doughnutChartInstance.current) {
      doughnutChartInstance.current.destroy();
    }

    doughnutChartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors,
            borderColor: "white",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: "Subject Comparison",
          },
        },
      },
    });
  };

  const generateColors = (count: number) => {
    const baseColors = [
      "rgba(76, 175, 80, 0.7)", // Green
      "rgba(33, 150, 243, 0.7)", // Blue
      "rgba(255, 152, 0, 0.7)", // Orange
      "rgba(156, 39, 176, 0.7)", // Purple
      "rgba(233, 30, 99, 0.7)", // Pink
      "rgba(3, 169, 244, 0.7)", // Light Blue
    ];

    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }

    return colors;
  };

  const getStatusClass = (attendance: number) => {
    if (attendance >= 75) return "bg-green-500";
    if (attendance >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getAlertVariant = (attendance: number) => {
    if (attendance >= 75) return "bg-green-50 text-green-800 border-green-200";
    if (attendance >= 60)
      return "bg-yellow-50 text-yellow-800 border-yellow-200";
    return "bg-red-50 text-red-800 border-red-200";
  };

  const getStatusMessage = (attendance: number) => {
    if (attendance >= 75) return "Your attendance is good! Keep it up.";
    if (attendance >= 60)
      return "Your attendance needs improvement. Try to attend more classes.";
    return "Warning: Your attendance is critically low. You may not be eligible for exams.";
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Student Attendance Dashboard
          </CardTitle>
          <CardDescription>
            Enter a roll number to view detailed attendance analysis
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8 max-w-md mx-auto">
            <Input
              type="number"
              min="1"
              placeholder="Enter Roll Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={fetchAttendance}
              className="bg-green-500 hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Loading..." : "Get Attendance"}
            </Button>
          </div>

          {loading && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <Skeleton className="h-8 w-full rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            </div>
          )}

          {showResults && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span>Overall Attendance</span>
                  <span>{attendanceSummary.totalAttendance.toFixed(1)}%</span>
                </div>
                <Progress
                  value={attendanceSummary.totalAttendance}
                  className="h-4"
                />
              </div>

              <Tabs defaultValue="charts" className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="charts">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <canvas ref={barChartRef}></canvas>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <canvas ref={radarChartRef}></canvas>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <canvas ref={polarChartRef}></canvas>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <canvas ref={doughnutChartRef}></canvas>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="summary">
                  <Card>
                    <CardHeader>
                      <CardTitle>Attendance Summary</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {attendanceSummary.subjects.map((subject) => (
                            <Badge
                              key={subject.subject}
                              variant="outline"
                              className={`px-3 py-1 ${getStatusClass(subject.attendance)} text-white`}
                            >
                              {subject.subject}: {subject.attendance.toFixed(1)}
                              %
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="bg-white-50">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base font-medium">
                                Overall
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-2xl font-bold">
                                {attendanceSummary.totalAttendance.toFixed(1)}%
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="bg-white-50">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base font-medium">
                                Highest
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-2xl font-bold">
                                {attendanceSummary.highest.subject}
                              </p>
                              <p className="text-lg">
                                {attendanceSummary.highest.attendance.toFixed(
                                  1
                                )}
                                %
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="bg-white-50">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base font-medium">
                                Lowest
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-2xl font-bold">
                                {attendanceSummary.lowest.subject}
                              </p>
                              <p className="text-lg">
                                {attendanceSummary.lowest.attendance.toFixed(1)}
                                %
                              </p>
                            </CardContent>
                          </Card>
                        </div>

                        <Alert
                          className={`${getAlertVariant(attendanceSummary.totalAttendance)} border`}
                        >
                          <AlertDescription>
                            {getStatusMessage(
                              attendanceSummary.totalAttendance
                            )}
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>

        {showResults && (
          <CardFooter className="text-center text-sm text-gray-500">
            Data last updated: {new Date().toLocaleDateString()}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
