import mongoose, { Schema, Document } from "mongoose";

export interface Student extends Document {
  rollno: string;
  email: string;
}
const StudentSchema: Schema<Student> = new Schema({
  rollno: {
    type: String,
    required: [true, "Rollno is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
});

const StudentModel =
  (mongoose.models.Student as mongoose.Model<Student>) ||
  mongoose.model<Student>("Student", StudentSchema);
export default StudentModel;
