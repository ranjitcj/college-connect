import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { classCode, subjectName, attendance } = body;

    // Validate request data
    if (!classCode || !subjectName || !attendance) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real application, you would make a request to your backend API
    // or directly interact with a database. For this example, we'll simulate
    // the API call to Google Script.

    // URL for the Google Script (as shown in your HTML example)
    const scriptUrl = new URL("https://script.google.com/macros/s/AKfycbxCtcHvxpj_uQTDhwwAsE5ItuVqArRerEemFQXWmH1fOJkXkOiffRTHFBf9ZA9TS7QW/exec");
    scriptUrl.searchParams.append("mode", "push");
    scriptUrl.searchParams.append("class_code", classCode);
    scriptUrl.searchParams.append("subject_name", subjectName);
    scriptUrl.searchParams.append("attendance", attendance);
    
    try {
      // Make the request to Google Script
      const response = await fetch(scriptUrl.toString(), {
        method: "GET",
        // Note: In production, you should handle CORS properly
        // and consider using server-side requests for security
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit attendance to Google Script');
      }
      
      const data = await response.json();
      
      if (data.error) {
        return NextResponse.json(
          { error: data.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        message: 'Attendance submitted successfully',
        data: data
      });
    } catch (error) {
      console.error('Error submitting to Google Script:', error);
      
      // Return a controlled error response
      return NextResponse.json(
        { error: 'Failed to submit attendance. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}