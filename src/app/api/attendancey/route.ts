import { NextRequest, NextResponse } from "next/server";

// Define the class data structure
export interface ClassData {
  classrooms: Array<{
    branches: Array<{
      branchName: string;
      code: string;
      years: {
        [key: string]: {
          code: string;
          [key: string]:
            | {
                strength: number;
                subjects: string[];
              }
            | string;
        };
      };
    }>;
  }>;
}

// Mock data - same as in the HTML
const classData: ClassData = {
  classrooms: [
    {
      branches: [
        {
          branchName: "Computer",
          code: "C",
          years: {
            SE: {
              code: "S",
              A: {
                strength: 40,
                subjects: ["M3", "DBMS", "CN", "OOP", "DS"],
              },
              B: {
                strength: 38,
                subjects: ["M3", "DBMS", "CN", "OOP", "DS"],
              },
              C: {
                strength: 90,
                subjects: ["M3", "PPL", "SE", "MP", "DSA"],
              },
            },
            TE: {
              code: "T",
              A: {
                strength: 42,
                subjects: ["ML", "AI", "IoT", "SPOS", "DAA"],
              },
            },
            BE: {
              code: "B",
              A: {
                strength: 45,
                subjects: ["HPC", "ICS", "CP", "ESD", "ML"],
              },
            },
          },
        },
        {
          branchName: "Electronics",
          code: "E",
          years: {
            SE: {
              code: "S",
              A: {
                strength: 35,
                subjects: ["DE", "AM", "ES", "SS", "CS"],
              },
              B: {
                strength: 30,
                subjects: ["DE", "AM", "ES", "SS", "CS"],
              },
            },
            TE: {
              code: "T",
              A: {
                strength: 38,
                subjects: ["VLSI", "MC", "CT", "EF", "PE"],
              },
            },
            BE: {
              code: "B",
              A: {
                strength: 40,
                subjects: ["AE", "DSP", "OC", "WC", "SC"],
              },
            },
          },
        },
      ],
    },
  ],
};

export async function GET() {
  // Return the class data
  return NextResponse.json(classData);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.class_code || !body.subject_name || !body.attendance) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a real application, you would save this data to a database
    // For this example, we'll just simulate a successful response

    // Simulate an API call to the Google Apps Script URL
    // In a production environment, you would make an actual fetch call here
    const apiUrl = new URL(
      "https://script.google.com/macros/s/AKfycbxCtcHvxpj_uQTDhwwAsE5ItuVqArRerEemFQXWmH1fOJkXkOiffRTHFBf9ZA9TS7QW/exec"
    );
    apiUrl.searchParams.append("mode", "push");
    apiUrl.searchParams.append("class_code", body.class_code);
    apiUrl.searchParams.append("subject_name", body.subject_name);
    apiUrl.searchParams.append("attendance", body.attendance);

    // Log the data that would be sent (for demonstration purposes)
    console.log("Submitting attendance:", {
      class_code: body.class_code,
      subject_name: body.subject_name,
      attendance: body.attendance,
      url: apiUrl.toString(),
    });

    // Return success response
    return NextResponse.json({
      message: "Attendance submitted successfully!",
      timestamp: new Date().toISOString(),
    });

    // In a real implementation, you would use fetch:
    /*
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
    });
    
    const data = await response.json();
    return NextResponse.json(data);
    */
  } catch (error) {
    console.error("Error processing attendance submission:", error);
    return NextResponse.json(
      { error: "Failed to process attendance submission" },
      { status: 500 }
    );
  }
}
