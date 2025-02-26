// import { NextRequest } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import PostModel from "@/model/Post";
// import cloudinary from "@/lib/cloudinary"; // Assuming you have this set up
// import { User } from "next-auth";
// import { useSession } from "next-auth/react";

// export async function POST(request: NextRequest) {
//   await dbConnect();
//   try {
//     // Get the request body
//     const { content, image } = await request.json();
//     const { data: session } = useSession();
//     const user: User = session?.user as User;
//     const userId = user._id;

//     if (!userId) {
//       return Response.json(
//         {
//           success: false,
//           message: "Unauthorized access",
//         },
//         {
//           status: 401,
//         }
//       );
//     }

//     let newPost;

//     if (image) {
//       const imgResult = await cloudinary.uploader.upload(image);

//       // Create new post with image
//       newPost = new PostModel({
//         author: userId,
//         content,
//         image: imgResult.secure_url,
//         createdAt: new Date(),
//       });
//     } else {
//       // Create new post without image
//       newPost = new PostModel({
//         author: userId,
//         content,
//         createdAt: new Date(),
//       });
//     }

//     // Save the post to database
//     await newPost.save();

//     // Return success response
//     return Response.json(
//       {
//         success: true,
//         message: "Post created successfully",
//         post: newPost,
//       },
//       {
//         status: 201,
//       }
//     );
//   } catch (error) {
//     console.error("Error creating post:", error);

//     // Return error response
//     return Response.json(
//       {
//         success: false,
//         message: "Error creating post",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }
import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PostModel from "@/model/Post";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/option";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    // Get the request body
    const { content, image } = await request.json();

    // Use getServerSession instead of useSession hook
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized access",
        },
        {
          status: 401,
        }
      );
    }

    // Get user ID from session
    const userId = session.user._id || session.user._id;

    if (!userId) {
      return Response.json(
        {
          success: false,
          message: "User ID not found in session",
        },
        {
          status: 401,
        }
      );
    }

    let newPost;

    if (image) {
      const imgResult = await cloudinary.uploader.upload(image);
      newPost = new PostModel({
        author: userId,
        content,
        image: imgResult.secure_url,
        createdAt: new Date(),
      });
    } else {
      newPost = new PostModel({
        author: userId,
        content,
        createdAt: new Date(),
      });
    }

    // Save the post to database
    await newPost.save();

    // Return success response
    return Response.json(
      {
        success: true,
        message: "Post created successfully",
        post: newPost,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating post:", error);

    // Return error response
    return Response.json(
      {
        success: false,
        message: "Error creating post",
      },
      {
        status: 500,
      }
    );
  }
}
