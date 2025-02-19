"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

//
import { ApiResponseStudentV } from "@/types/ApiResponseStudentV";
import { verifyStudentSchema } from "@/schemas/verifyStudentSchemas";

//
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { User } from "@/model/User";

export default function VerifyStudentAccount() {
  const router = useRouter();
  const params = useParams<{ email: string }>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifyStudentSchema>>({
    resolver: zodResolver(verifyStudentSchema),
  });

  const { data: session } = useSession();
  const user: User = session?.user as User;

  const onSubmit = async (data: z.infer<typeof verifyStudentSchema>) => {
    try {
      const response = await axios.post<ApiResponseStudentV>(
        `/verify-student`,
        {
          email: user.email,
          rollno: data.rollno,
        }
      );

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseStudentV>;
      toast({
        title: "Verification Failed",
        description:
          axiosError.response?.data.message ??
          "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {session ? (
        <>
          <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md border">
              <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                  Verify Account For College Access
                </h1>
                <p className="mb-4">
                  Enter the Rollno to verify yourself as student
                </p>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    name="rollno"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification RollNo</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Verify</Button>
                </form>
              </Form>
            </div>
          </div>
        </>
      ) : (
        <div>sorry </div>
      )}
    </>
  );
}
