
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get roll number from query parameters
    const searchParams = request.nextUrl.searchParams;
    const roll = searchParams.get('roll');
  // const { data: session } = useSession();
  // const user: User = session?.user as User;
  // const userForAttendance = await UserModel.findOne({username: user.username});
  // if (!userForAttendance) {
  //   throw new Error("No user found");
  // }
  // const roll = userForAttendance.rollno;
  if (!roll) {
    return NextResponse.json(
      { error: 'Roll number is required' },
      { status: 400 }
    );
  }

  try {
    // Call the external API to get the attendance data
    const url = `https://script.google.com/macros/s/AKfycbxCtcHvxpj_uQTDhwwAsE5ItuVqArRerEemFQXWmH1fOJkXkOiffRTHFBf9ZA9TS7QW/exec?mode=fetch&class_code=CSC&subject_name=M3&roll=${encodeURIComponent(roll)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance data' },
      { status: 500 }
    );
  }
}