import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";

export async function POST(request: Request) {
  try {
    // Get session server-side
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to the database
    await dbConnect();

    const { rollno } = await request.json();
    const userEmail = session.user.email;

    // Find existing user - using the correct collection structure
    const existingUser = await UserModel.findOne({ email: userEmail });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Updated aggregation to match your actual database structure
    const studentMatch = await UserModel.aggregate([
      {
        $lookup: {
          from: "student", // Your collection name from MongoDB Compass
          localField: "email",
          foreignField: "email",
          as: "result",
        },
      },
      {
        $match: {
          email: userEmail,
          "result.rollno": rollno.toUpperCase(),
        },
      },
    ]);

    if (!studentMatch || studentMatch.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid roll number" },
        { status: 404 }
      );
    }

    // Update user role
    // await UserModel.findByIdAndUpdate(
    //   existingUser._id,
    //   {
    //     role: "student",
    //   },
    //   { new: true }
    // );
    // await UserModel.findByIdAndUpdate(
    //   existingUser._id,
    //   {
    //     rollno: rollno,
    //   },
    //   { new: true }
    // );
    await UserModel.findByIdAndUpdate(
      existingUser._id,
      {
        role: "student",
        rollno: rollno
      },
      { new: true }
    );



    return NextResponse.json(
      { success: true, message: "Account verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
