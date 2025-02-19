// // import dbConnect from "@/lib/dbConnect";
// // import UserModel from "@/model/User";
// // import { User } from "next-auth";
// // import { useSession } from "next-auth/react";
// // import StudentModel from "@/model/User";

// // export async function POST(request: Request) {
// //   // Connect to the database
// //   await dbConnect();

// //   try {
// //     const { data: session } = useSession();
// //     const user: User = session?.user as User;
// //     const studentemail = user.email;
// //     const { Rollno } = await request.json();
// //     const student = await StudentModel.findOne({
// //       email: studentemail,
// //       rollno: Rollno,
// //     });

// //     if (!student) {
// //       return Response.json(
// //         { success: false, message: "Student not found" },
// //         { status: 404 }
// //       );
// //     }

// //     if (student) {
// //       // Update the user's verification status
// //       await UserModel.updateOne({ email: studentemail }, { role: "student" });

// //       return Response.json(
// //         { success: true, message: "Verified successfully as Student" },
// //         { status: 200 }
// //       );
// //     } else {
// //       // Code is incorrect
// //       return Response.json(
// //         { success: false, message: "Incorrect RollNo" },
// //         { status: 400 }
// //       );
// //     }
// //   } catch (error) {
// //     console.error("Error verifying user:", error);
// //     return Response.json(
// //       { success: false, message: "Error verifying user" },
// //       { status: 500 }
// //     );
// //   }
// // }

// ///-------------------------------------------------------------------------
// // import dbConnect from "@/lib/dbConnect";
// // import UserModel from "@/model/User";
// // import { User } from "next-auth";
// // import { getServerSession } from "next-auth/next";
// // import { authOptions } from "@/app/api/auth/[...nextauth]/option";

// // export async function GET(request: Request) {
// //   await dbConnect();
// //   const { email, rollno } = await request.json();
// //   const session = await getServerSession(authOptions);
// //   const user = session?.user as User | undefined;

// //   if (!session || !user) {
// //     return Response.json(
// //       { success: false, message: "Not authenticated" },
// //       { status: 401 }
// //     );
// //   }

// //   // const userEmail = user.email; // Get user email dynamically

// //   try {
// //     const userData = await UserModel.aggregate([
// //       {
// //         $lookup: {
// //           from: "student",
// //           localField: "email", // This is a static field in UserModel
// //           foreignField: "email",
// //           as: "newdata",
// //         },
// //       },
// //       {
// //         $match: { email: email }, // Dynamically filter results based on userEmail
// //       },
// //     ]).exec();

// //     return Response.json({ success: true, data: userData });
// //   } catch (error) {
// //     console.error("Error fetching user data:", error);
// //     return Response.json(
// //       { success: false, message: "Error fetching data" },
// //       { status: 500 }
// //     );
// //   }
// // }
// ///-------------------------------------------------------------------------

// // import dbConnect from "@/lib/dbConnect";
// // import UserModel from "@/model/User";
// // import { User } from "next-auth";
// // import { getServerSession } from "next-auth/next";
// // import { authOptions } from "@/app/api/auth/[...nextauth]/option";
// // import StudentModel from "@/model/Student";
// // import dbConnectForStudent from "@/lib/dbConnectForStudent";

// // export async function GET(request: Request) {
// //   await dbConnectForStudent();
// //   await dbConnect();
// //   const { email, rollno } = await request.json();
// // const session = await getServerSession(authOptions);
// // const user = session?.user as User | undefined;

// // if (!session || !user) {
// //   return Response.json(
// //     { success: false, message: "Not authenticated" },
// //     { status: 401 }
// //   );
// // }
// ///--------------------------------------------------------------------------------------
// // try {
// //   const userData = await UserModel.aggregate([
// //     {
// //       $lookup: {
// //         from: "student",
// //         localField: "email",
// //         foreignField: "email",
// //         as: "newdata",
// //       },
// //     },
// //     {
// //       $match: {
// //         email: email,
// //         "newdata.rollno": rollno,
// //       },
// //     },
// //   ]).exec();
// ///--------------------------------------------------------------------------------------

// ///--------------------------------------------------------------------------------------

// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import { User } from "next-auth";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/option";
// import StudentModel from "@/model/Student";
// import dbConnectForStudent from "@/lib/dbConnectForStudent";

// export async function GET(request: Request) {
//   await dbConnectForStudent();
//   await dbConnect();
//   const { email, rollno } = await request.json();
//   try {
//     // First, verify the user exists with the given email and rollno
//     const userData = await UserModel.aggregate([
//       {
//         $lookup: {
//           from: "student",
//           localField: "email",
//           foreignField: "email",
//           as: "newdata",
//         },
//       },
//       {
//         $match: {
//           email: email,
//           "newdata.rollno": rollno,
//         },
//       },
//     ]).exec();

//     // Check if user exists
//     if (userData && userData.length > 0) {
//       // Now update the role
//       const updateResult = await UserModel.updateOne(
//         { email: email },
//         { $set: { role: "student" } }
//       );

//       if (updateResult.modifiedCount > 0) {
//         return {
//           success: true,
//           message: "Role updated to student successfully",
//         };
//       } else {
//         return { success: false, message: "Failed to update role" };
//       }
//     } else {
//       return {
//         success: false,
//         message: "User not found or rollno doesn't match",
//       };
//     }

//     // return Response.json({ success: true, data: userData });
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return Response.json(
//       { success: false, message: "Error fetching data" },
//       { status: 500 }
//     );
//   }
// }

// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import StudentModel from "@/model/Student";
// import dbConnectForStudent from "@/lib/dbConnectForStudent";

// export async function POST(request: Request) {
//   await dbConnectForStudent();
//   await dbConnect();

//   try {
//     const { email, rollno } = await request.json();

//     // First, verify the user exists with the given email and rollno
//     const userData = await UserModel.aggregate([
//       {
//         $lookup: {
//           from: "student",
//           localField: "email",
//           foreignField: "email",
//           as: "newdata",
//         },
//       },
//       {
//         $match: {
//           email: email,
//           "newdata.rollno": rollno,
//         },
//       },
//     ]).exec();

//     // Check if user exists
//     if (userData && userData.length > 0) {
//       // Now update the role
//       const updateResult = await UserModel.updateOne(
//         { email: email },
//         { $set: { role: "student" } }
//       );

//       if (updateResult.modifiedCount > 0) {
//         return Response.json({
//           success: true,
//           message: "Role updated to student successfully",
//         });
//       } else {
//         return Response.json(
//           { success: false, message: "Failed to update role" },
//           { status: 400 }
//         );
//       }
//     } else {
//       return Response.json(
//         {
//           success: false,
//           message: "User not found or rollno doesn't match",
//         },
//         { status: 404 }
//       );
//     }

//   } catch (error) {
//     console.error("Error updating user role:", error);
//     return Response.json(
//       { success: false, message: "Error updating role" },
//       { status: 500 }
//     );
//   }
// }

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import StudentModel from "@/model/Student";
// import dbConnectForStudent from "@/lib/dbConnectForStudent";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   await dbConnectForStudent();
//   await dbConnect();

//   try {
//     const { email, rollno } = await request.json();

//     // First, verify the user exists with the given email and rollno
//     const userData = await UserModel.aggregate([
//       {
//         $lookup: {
//           from: "student",
//           localField: "email",
//           foreignField: "email",
//           as: "newdata",
//         },
//       },
//       {
//         $match: {
//           email: email,
//           "newdata.rollno": rollno,
//         },
//       },
//     ]).exec();

//     // Return response right after getting userData
//     return NextResponse.json({ success: true, data: userData });

//     // Note: The code below this point will never execute because of the return statement above
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return NextResponse.json(
//       { success: false, message: "Error fetching data" },
//       { status: 500 }
//     );
//   }
// }

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import dbConnectForStudent from "@/lib/dbConnectForStudent";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnectForStudent();
  await dbConnect();

  try {
    const { email, rollno } = await request.json();

    // First, verify the user exists with the given email and rollno
    const userData = await UserModel.aggregate([
      {
        $lookup: {
          from: "student",
          localField: "email",
          foreignField: "email",
          as: "newdata",
        },
      },
      {
        $match: {
          email: email,
          "newdata.rollno": rollno,
        },
      },
    ]).exec();

    // Check if user exists and rollno matches
    if (userData && userData.length > 0) {
      // Extract the rollno from the result to verify
      const matchedRollno = userData[0].newdata[0]?.rollno;

      if (matchedRollno === rollno) {
        // Now update the role
        const updateResult = await UserModel.updateOne(
          { email: email },
          { $set: { role: "student" } }
        );

        if (updateResult.modifiedCount > 0) {
          return NextResponse.json({
            success: true,
            message: "Role updated to student successfully",
            userData: userData,
          });
        } else {
          return NextResponse.json(
            {
              success: false,
              message: "Failed to update role",
              userData: userData,
            },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Rollno doesn't match",
            matchedRollno,
            providedRollno: rollno,
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "User not found or rollno doesn't match" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating role",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
