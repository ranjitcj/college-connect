import { z } from "zod";

export const verifyStudentSchema = z.object({
  rollno: z
    .string()
    .min(5, { message: "Code must be at least 5 characters long" }),
});
