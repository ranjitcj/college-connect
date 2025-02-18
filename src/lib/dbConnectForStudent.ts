import mongoose from "mongoose";

type ConnectioOptions = {
  isConnected?: number;
};

const connection: ConnectioOptions = {};

async function dbConnectForStudent(): Promise<void> {
  if (connection.isConnected) {
    console.log("Using existing connection");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    // console.log(db);
    connection.isConnected = db.connections[1].readyState;
    // console.log(connection.isConnected);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1);
  }
}

export default dbConnectForStudent;
