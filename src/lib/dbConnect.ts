// import mongoose from "mongoose";

// type ConnectioOptions = {
//   isConnected?: number;
// };

// const connection: ConnectioOptions = {};

// async function dbConnect(): Promise<void> {
//   if (connection.isConnected) {
//     console.log("Using existing connection");
//     return;
//   }
//   try {
//     const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
//     // console.log(db);
//     connection.isConnected = db.connections[0].readyState;
//     // console.log(connection.isConnected);
//     console.log("Database Connected Successfully");
//   } catch (error) {
//     console.log("Error connecting to database", error);
//     process.exit(1);
//   }
// }

// export default dbConnect;
import mongoose from "mongoose";

type ConnectionOptions = {
  isConnected?: number;
};

const connection: ConnectionOptions = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: "users_details",
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
}

export default dbConnect;
