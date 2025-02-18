import mongoose from "mongoose";

type ConnectioOptions = {
  isConnected?: number;
};

const connection: ConnectioOptions = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Using existing connection");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    // console.log(db);
    connection.isConnected = db.connections[0].readyState;
    // console.log(connection.isConnected);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1);
  }
}

export default dbConnect;

// import mongoose, { Model, Schema, Document } from "mongoose";

// type ConnectionOptions = {
//   isConnected?: number;
// };

// const connection: ConnectionOptions = {};

// async function dbConnect(): Promise<void> {
//   if (connection.isConnected) {
//     console.log("Using existing connection");
//     return;
//   }
//   try {
//     const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
//     connection.isConnected = db.connections[0].readyState;
//     console.log("Database Connected Successfully");
//   } catch (error) {
//     console.error("Error connecting to database", error);
//     process.exit(1);
//   }
// }

// // Define a generic schema (Modify as per your needs)
// const UserSchema = new Schema({}, { strict: false });
// const StudentSchema = new Schema({}, { strict: false });

// async function getUserCollection(): Promise<Model<Document>> {
//   await dbConnect();
//   return mongoose.models.User || mongoose.model("User", UserSchema);
// }

// async function getStudentCollection(): Promise<Model<Document>> {
//   await dbConnect();
//   return mongoose.models.Student || mongoose.model("Student", StudentSchema);
// }

// export { dbConnect, getUserCollection, getStudentCollection };
