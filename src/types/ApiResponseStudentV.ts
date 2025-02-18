import { Message } from "@/model/Student";

export interface ApiResponseStudentV {
  success: boolean;
  message: string;
  messages?: Array<Message>;
}
