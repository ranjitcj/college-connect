// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import { User } from "next-auth";
// import { useSession } from "next-auth/react";
// import StudentModel from "@/model/User";

// export async function POST(request: Request) {
//   // Connect to the database
//   await dbConnect();

//   try {
//     const { data: session } = useSession();
//     const user: User = session?.user as User;
//     const studentemail = user.email;
//     const { Rollno } = await request.json();
//     const student = await StudentModel.findOne({
//       email: studentemail,
//       rollno: Rollno,
//     });

//     if (!student) {
//       return Response.json(
//         { success: false, message: "Student not found" },
//         { status: 404 }
//       );
//     }

//     if (student) {
//       // Update the user's verification status
//       await UserModel.updateOne({ email: studentemail }, { role: "student" });

//       return Response.json(
//         { success: true, message: "Verified successfully as Student" },
//         { status: 200 }
//       );
//     } else {
//       // Code is incorrect
//       return Response.json(
//         { success: false, message: "Incorrect RollNo" },
//         { status: 400 }
//       );
//     }
//   } catch (error) {
//     console.error("Error verifying user:", error);
//     return Response.json(
//       { success: false, message: "Error verifying user" },
//       { status: 500 }
//     );
//   }
// }

///-------------------------------------------------------------------------
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import { User } from "next-auth";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/option";

// export async function GET(request: Request) {
//   await dbConnect();
//   const { email, rollno } = await request.json();
//   const session = await getServerSession(authOptions);
//   const user = session?.user as User | undefined;

//   if (!session || !user) {
//     return Response.json(
//       { success: false, message: "Not authenticated" },
//       { status: 401 }
//     );
//   }

//   // const userEmail = user.email; // Get user email dynamically

//   try {
//     const userData = await UserModel.aggregate([
//       {
//         $lookup: {
//           from: "student",
//           localField: "email", // This is a static field in UserModel
//           foreignField: "email",
//           as: "newdata",
//         },
//       },
//       {
//         $match: { email: email }, // Dynamically filter results based on userEmail
//       },
//     ]).exec();

//     return Response.json({ success: true, data: userData });
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return Response.json(
//       { success: false, message: "Error fetching data" },
//       { status: 500 }
//     );
//   }
// }
///-------------------------------------------------------------------------

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import StudentModel from "@/model/Student";
import dbConnectForStudent from "@/lib/dbConnectForStudent";

export async function GET(request: Request) {
  await dbConnectForStudent();
  await dbConnect();
  const { email, rollno } = await request.json();
  const session = await getServerSession(authOptions);
  const user = session?.user as User | undefined;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
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
          "newdata.rollno": rollno, // Ensuring rollno matches from the joined student data
        },
      },
    ]).exec();

    return Response.json({ success: true, data: userData });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return Response.json(
      { success: false, message: "Error fetching data" },
      { status: 500 }
    );
  }
}
