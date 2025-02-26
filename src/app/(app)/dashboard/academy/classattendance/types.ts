// Type definitions for Attendance Management System

// Selection types
export type SelectionType = 'Branch' | 'Year' | 'Division' | 'Subject';

// Division data structure
export interface DivisionData {
  strength: number;
  subjects: string[];
}

// Year data structure
export interface YearData {
  code: string;
  [division: string]: DivisionData | string;
}

// Branch years structure
export interface BranchYears {
  [year: string]: YearData;
}

// Branch structure
export interface Branch {
  branchName: string;
  code: string;
  years: BranchYears;
}

// Classroom structure
export interface Classroom {
  branches: Branch[];
}

// Class data structure
export interface ClassData {
  classrooms: Classroom[];
}

// Attendance data structure
export interface AttendanceData {
  classCode: string;
  subjectName: string;
  attendance: string;
}