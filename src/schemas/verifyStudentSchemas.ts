import { z } from "zod";

export const verifyStudentSchema = z.object({
  rollno: z
    .string()
    .min(1, "Roll number is required")
    .regex(
      /^SEC\d{2}$/i,
      "Roll number must be in format SEC followed by 2 digits (e.g., SEC06)"
    )
    .transform((val) => val.toUpperCase()),
});
