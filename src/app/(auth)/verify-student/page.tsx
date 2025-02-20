"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { verifyStudentSchema } from "@/schemas/verifyStudentSchemas";
import { ApiResponseStudentV } from "@/types/ApiResponseStudentV";
import Image from "next/image";
import logo from "@/app/logo/logo.png";

// Schema that matches SEC06 format

export default function VerifyAccount() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifyStudentSchema>>({
    resolver: zodResolver(verifyStudentSchema),
    defaultValues: {
      rollno: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifyStudentSchema>) => {
    try {
      const response = await axios.post<ApiResponseStudentV>(
        "/api/verify-student",
        {
          rollno: data.rollno,
        }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        router.replace("/");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseStudentV>;
      toast({
        title: "Verification Failed",
        description:
          axiosError.response?.data?.message ??
          "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md border">
        <div className="text-center">
          <div className="flex items-center space-x-4">
            <Image
              src={logo}
              width={100}
              height={100}
              alt="College Connect Logo"
            />
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              College Connect
            </h1>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="rollno"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verify Your Account As Student</FormLabel>
                  <Input
                    {...field}
                    placeholder="Enter your roll number (e.g., SEC06)"
                    autoComplete="off"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
