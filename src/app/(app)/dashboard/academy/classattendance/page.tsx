"use client";

import { useState, useEffect } from "react";
import { ClassData } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function AttendancePage() {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [selections, setSelections] = useState({
    Branch: null,
    Year: null,
    Division: null,
    Subject: null,
  });
  const [presentCount, setPresentCount] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [attendanceData, setAttendanceData] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    message: "",
    isError: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch class data from API
    fetch("/api/attendance")
      .then((response) => response.json())
      .then((data) => {
        setClassData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching class data:", error);
        setStatusMessage({
          message: "Error loading data. Please try again.",
          isError: true,
        });
        setLoading(false);
      });
  }, []);

  const clearSelections = (fromKey: string) => {
    const keys = ["Year", "Division", "Subject"];
    let clear = false;
    const newSelections = { ...selections } as any;

    keys.forEach((key) => {
      if (key === fromKey) clear = true;
      if (clear) {
        newSelections[key] = null;
      }
    });

    setSelections(newSelections);

    if (newSelections.Subject === null) {
      setAttendanceData([]);
      setPresentCount(0);
      setTotalStudents(0);
      setStatusMessage({ message: "", isError: false });
      setIsSubmitted(false);
    }
  };

  const handleSelection = (key: string, value: string) => {
    setIsSubmitted(false);
    setStatusMessage({ message: "", isError: false });

    setSelections((prev) => {
      const newSelections = { ...prev, [key]: value };
      return newSelections;
    });

    clearSelections(key);

    if (
      key === "Subject" &&
      selections.Branch &&
      selections.Year &&
      selections.Division &&
      classData
    ) {
      generateStudentGrid();
    }
  };

  const generateStudentGrid = () => {
    if (!classData) return;

    const branch = classData.classrooms[0].branches.find(
      (b) => b.branchName === selections.Branch
    );
    const strength =
      branch?.years[selections.Year]?.[selections.Division]?.strength || 0 ;

    if (strength > 0) {
      setTotalStudents(strength);
      setPresentCount(0);
      setAttendanceData(new Array(strength).fill("A"));
    }
  };

  const toggleAttendance = (index: number) => {
    if (isSubmitted) return;

    const newAttendanceData = [...attendanceData];
    const currentValue = newAttendanceData[index];
    const newValue = currentValue === "P" ? "A" : "P";
    newAttendanceData[index] = newValue;

    setAttendanceData(newAttendanceData);
    setPresentCount((prev) => (newValue === "P" ? prev + 1 : prev - 1));
  };

  const submitAttendance = async () => {
    if (
      !selections.Branch ||
      !selections.Year ||
      !selections.Division ||
      !selections.Subject ||
      !classData
    ) {
      setStatusMessage({
        message: "Please complete all selections first.",
        isError: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const branch = classData.classrooms[0].branches.find(
        (b) => b.branchName === selections.Branch
      );
      const year = branch?.years[selections.Year]?.code || "X";
      const division = selections.Division || "X";
      const classCode = `${branch?.code || "X"}${year}${division}`;

      // Current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      // Prepare attendance data with date
      const submissionData = [currentDate, ...attendanceData];
      const attendanceString = submissionData.join(",");

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class_code: classCode,
          subject_name: selections.Subject,
          attendance: attendanceString,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setStatusMessage({
          message: `Error: ${data.error}. Please try again.`,
          isError: true,
        });
        setIsSubmitted(false);
      } else {
        setStatusMessage({
          message: data.message || "Attendance submitted successfully!",
          isError: false,
        });
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      setStatusMessage({
        message: "Network error occurred. Please try again.",
        isError: true,
      });
      setIsSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getClassCode = () => {
    if (!classData) return "N/A";

    const branch = classData.classrooms[0].branches.find(
      (b) => b.branchName === selections.Branch
    );
    const year = branch?.years[selections.Year]?.code || "X";
    const division = selections.Division || "X";
    return `${branch?.code || "X"}${year}${division}`;
  };

  const getAttendancePercentage = () => {
    return totalStudents > 0
      ? Math.round((presentCount / totalStudents) * 100)
      : 0;
  };

  const getDisplayOptions = () => {
    return Object.values(selections).filter(Boolean).join(" ") || "None";
  };

  const absentCount = totalStudents - presentCount;

  if (loading) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-3xl">
          <Skeleton className="h-12 w-full mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Add a check to ensure classData is loaded before rendering the main content
  if (!classData) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
        <Alert variant="destructive" className="w-full max-w-3xl">
          <AlertDescription>
            Failed to load class data. Please refresh the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <Card className="mb-6 bg-green-600 text-white border-none shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Attendance Management System
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Take Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* Branch Selection */}
              <div>
                <h3 className="text-lg font-medium mb-2">Branch:</h3>
                <div className="flex flex-wrap gap-2">
                  {classData.classrooms[0].branches.map((branch) => (
                    <Button
                      key={branch.code}
                      variant={
                        selections.Branch === branch.branchName
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        handleSelection("Branch", branch.branchName)
                      }
                      className="transition-all"
                    >
                      {branch.branchName}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Year Selection */}
              {selections.Branch && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Year:</h3>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      // Find the selected branch safely
                      const selectedBranch =
                        classData.classrooms[0].branches.find(
                          (b) => b.branchName === selections.Branch
                        );

                      // Only proceed if a matching branch was found
                      if (!selectedBranch)
                        return <p>No years found for this branch</p>;

                      // Now we can safely access the years
                      return Object.keys(selectedBranch.years).map((year) => (
                        <Button
                          key={year}
                          variant={
                            selections.Year === year ? "default" : "outline"
                          }
                          onClick={() => handleSelection("Year", year)}
                          className="transition-all"
                        >
                          {year}
                        </Button>
                      ));
                    })()}
                  </div>
                </div>
              )}
              {/* {selections.Branch && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Year:</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(
                      classData.classrooms[0].branches.find(
                        (b) => b.branchName === selections.Branch
                      ).years
                    ).map((year) => (
                      <Button
                        key={year}
                        variant={
                          selections.Year === year ? "default" : "outline"
                        }
                        onClick={() => handleSelection("Year", year)}
                        className="transition-all"
                      >
                        {year}
                      </Button>
                    ))}
                  </div>
                </div>
              )} */}

              {/* Division Selection */}
              {/* Division Selection */}
              {selections.Branch && selections.Year && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Division:</h3>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      // Find the selected branch safely
                      const selectedBranch =
                        classData.classrooms[0].branches.find(
                          (b) => b.branchName === selections.Branch
                        );

                      // Return early if branch not found
                      if (!selectedBranch) return <p>No branch found</p>;

                      // Check if the year exists
                      const yearData = selectedBranch.years[selections.Year];
                      if (!yearData)
                        return <p>No divisions found for this year</p>;

                      // Now safely map over the divisions
                      return Object.keys(yearData)
                        .filter((k) => k !== "code")
                        .map((division) => (
                          <Button
                            key={division}
                            variant={
                              selections.Division === division
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              handleSelection("Division", division)
                            }
                            className="transition-all"
                          >
                            {division}
                          </Button>
                        ));
                    })()}
                  </div>
                </div>
              )}

              {/* Subject Selection */}
              {selections.Branch && selections.Year && selections.Division && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Subject:</h3>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      // Find the selected branch safely
                      const selectedBranch =
                        classData.classrooms[0].branches.find(
                          (b) => b.branchName === selections.Branch
                        );

                      // Return early if branch not found
                      if (!selectedBranch) return <p>No branch found</p>;

                      // Check if the year exists
                      const yearData = selectedBranch.years[selections.Year];
                      if (!yearData) return <p>No year data found</p>;

                      // Check if the division exists
                      const divisionData = yearData[selections.Division];
                      if (!divisionData) return <p>No division data found</p>;

                      // Check if subjects array exists
                      const subjects = divisionData.subjects;
                      if (
                        !subjects ||
                        !Array.isArray(subjects) ||
                        subjects.length === 0
                      ) {
                        return <p>No subjects found for this selection</p>;
                      }

                      // Now safely map over the subjects
                      return subjects.map((subject) => (
                        <Button
                          key={subject}
                          variant={
                            selections.Subject === subject
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handleSelection("Subject", subject)}
                          className="transition-all"
                        >
                          {subject}
                        </Button>
                      ));
                    })()}
                  </div>
                </div>
              )}
              {/* {selections.Branch && selections.Year && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Division:</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(
                      classData.classrooms[0].branches.find(
                        (b) => b.branchName === selections.Branch
                      ).years[selections.Year]
                    )
                      .filter((k) => k !== "code")
                      .map((division) => (
                        <Button
                          key={division}
                          variant={
                            selections.Division === division
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handleSelection("Division", division)}
                          className="transition-all"
                        >
                          {division}
                        </Button>
                      ))}
                  </div>
                </div>
              )}

              {/* Subject Selection */}
              {/* {selections.Branch && selections.Year && selections.Division && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Subject:</h3>
                  <div className="flex flex-wrap gap-2">
                    {classData.classrooms[0].branches
                      .find((b) => b.branchName === selections.Branch)
                      .years[selections.Year][selections.Division].subjects.map(
                        (subject) => (
                          <Button
                            key={subject}
                            variant={
                              selections.Subject === subject
                                ? "default"
                                : "outline"
                            }
                            onClick={() => handleSelection("Subject", subject)}
                            className="transition-all"
                          >
                            {subject}
                          </Button>
                        )
                      )}
                  </div>
                </div>
              )} */}

              {/* Class Header and Status */}
              {selections.Branch &&
                selections.Year &&
                selections.Division &&
                selections.Subject && (
                  <>
                    <div className="flex justify-between items-center mt-6 mb-2">
                      <h3 className="text-lg font-medium">
                        {selections.Year} {selections.Branch}{" "}
                        {selections.Division}
                      </h3>
                      <div className="flex gap-2">
                        <Badge
                          variant="default"
                          className="bg-green-500 text-md px-3 py-1"
                        >
                          Present: {presentCount}
                        </Badge>
                        <Badge
                          variant="destructive"
                          className="text-md px-3 py-1"
                        >
                          Absent: {absentCount}
                        </Badge>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Student Grid */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Student Attendance:
                      </h3>
                      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                        {Array.from({ length: totalStudents }).map(
                          (_, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className={`h-12 w-12 p-0 font-medium ${
                                attendanceData[index] === "P"
                                  ? "bg-green-100 hover:bg-green-200 border-green-500 text-green-700"
                                  : "bg-red-100 hover:bg-red-200 border-red-500 text-red-700"
                              } ${isSubmitted ? "cursor-not-allowed opacity-80" : ""}`}
                              onClick={() => toggleAttendance(index)}
                              disabled={isSubmitted}
                            >
                              {index + 1}
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}

              {/* Attendance Summary */}
              {selections.Branch && (
                <Card className="mt-6 bg-blue-50 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-blue-700">
                      Attendance Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-blue-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Selected:</span>
                        <span>{getDisplayOptions()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Class Code:</span>
                        <span>{getClassCode()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Subject:</span>
                        <span>{selections.Subject || "Not Selected"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Students:</span>
                        <span>{totalStudents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Present:</span>
                        <span className="text-green-600 font-medium">
                          {presentCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Absent:</span>
                        <span className="text-red-600 font-medium">
                          {absentCount}
                        </span>
                      </div>
                      <div className="flex justify-between sm:col-span-2">
                        <span className="font-medium">
                          Attendance Percentage:
                        </span>
                        <span
                          className={`font-bold ${getAttendancePercentage() > 75 ? "text-green-600" : "text-red-600"}`}
                        >
                          {getAttendancePercentage()}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Status Message */}
              {statusMessage.message && (
                <Alert
                  variant={statusMessage.isError ? "destructive" : "default"}
                  className="mt-4"
                >
                  <AlertDescription>{statusMessage.message}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              {selections.Subject && totalStudents > 0 && (
                <Button
                  type="button"
                  className="w-full mt-6"
                  onClick={submitAttendance}
                  disabled={isSubmitted || isSubmitting}
                  variant={isSubmitted ? "secondary" : "default"}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : isSubmitted ? (
                    "Attendance Submitted"
                  ) : (
                    "Submit Attendance"
                  )}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
