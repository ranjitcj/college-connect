import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6 digit random number
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exits Email already exists",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // Set expiry date to 1 hour from now
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash password
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry date to 1 hour from now
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();
    }
    ///
    // const checkingForRole = await UserModel.aggregate([
    //   {
    //     $lookup: {
    //       from: "student",
    //       localField: "email",
    //       foreignField: "email",
    //       as: "newdata",
    //     },
    //   },
    //   {
    //     $match: {
    //       email: email,
    //     },
    //   },
    // ]).exec();

    // if (!checkingForRole) {
    //   const student = new UserModel({
    //     role: "student",
    //   });
    //   await student.save();
    //   return Response.json(
    //     {
    //       success: true,
    //       message: "User registered as college student",
    //     },
    //     {
    //       status: 201,
    //     }
    //   );
    // } else {
    //   const student = new UserModel({
    //     role: "app-user",
    //   });
    //   await student.save();
    // }

    // Replace the role assignment section with this:
    const checkingForRole = await UserModel.aggregate([
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
        },
      },
    ]).exec();

    // Update the existing user's role instead of creating new documents
    const user = await UserModel.findOne({ email });
    if (user) {
      user.role = checkingForRole.length > 0 ? "student" : "app-user";
      await user.save();
    }
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: "Error sending verification email",
        },
        {
          status: 500,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
// export async function POST(request: Request) {
//   await dbConnect();

//   try {
//     const { username, email, password } = await request.json();

//     // Check for existing verified username
//     const existingUserVerifiedByUsername = await UserModel.findOne({
//       username,
//       isVerified: true,
//     });

//     if (existingUserVerifiedByUsername) {
//       return Response.json(
//         {
//           success: false,
//           message: "Username already exists",
//         },
//         { status: 400 }
//       );
//     }

//     // Generate verification code
//     const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
//     const expiryDate = new Date(Date.now() + 3600000); // 1 hour from now
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Check existing user by email
//     const existingUserByEmail = await UserModel.findOne({ email });

//     // Determine role
//     const studentCheck = await UserModel.aggregate([
//       {
//         $lookup: {
//           from: "student",
//           localField: "email",
//           foreignField: "email",
//           as: "newdata",
//         },
//       },
//       {
//         $match: { email },
//       },
//     ]).exec();

//     const role = studentCheck.length > 0 ? "student" : "app-user";

//     if (existingUserByEmail) {
//       if (existingUserByEmail.isVerified) {
//         return Response.json(
//           {
//             success: false,
//             message: "Email already exists",
//           },
//           { status: 400 }
//         );
//       }

//       // Update existing unverified user
//       existingUserByEmail.password = hashedPassword;
//       existingUserByEmail.verifyCode = verifyCode;
//       existingUserByEmail.verifyCodeExpiry = expiryDate;
//       existingUserByEmail.role = role;
//       await existingUserByEmail.save();
//     } else {
//       // Create new user
//       const newUser = new UserModel({
//         username,
//         email,
//         password: hashedPassword,
//         verifyCode,
//         verifyCodeExpiry: expiryDate,
//         isVerified: false,
//         isAcceptingMessages: true,
//         messages: [],
//         role,
//       });
//       await newUser.save();
//     }

//     // Send verification email
//     const emailResponse = await sendVerificationEmail(
//       email,
//       username,
//       verifyCode
//     );
//     if (!emailResponse.success) {
//       return Response.json(
//         {
//           success: false,
//           message: "Error sending verification email",
//         },
//         { status: 500 }
//       );
//     }

//     return Response.json(
//       {
//         success: true,
//         message: "User registered successfully",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.log("Error registering user", error);
//     return Response.json(
//       {
//         success: false,
//         message: "User validation failed",
//         error: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }
