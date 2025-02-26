"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Upload } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AddPost() {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImage(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!session?.user?._id) {
      // Handle not logged in state
      console.error("User not authenticated");
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        author: session.user.username,
        content,
        image,
        likes: [],
        comments: [],
      };

      // API call to create post
      const response = await fetch("/api/add-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        // Reset form
        setContent("");
        setImage("");
        // Add success notification or redirect
      } else {
        // Handle error
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex items-center justify-center w-full h-full py-8">
              <div className="container max-w-2xl mx-auto">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Create New Post</CardTitle>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="content">What's on your mind?</Label>
                        <Textarea
                          id="content"
                          placeholder="Share your thoughts..."
                          className="min-h-32"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="image">Add an image</Label>
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor="image-upload"
                            className="flex h-10 items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer hover:bg-accent hover:text-accent-foreground"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                          {image && (
                            <span className="text-sm text-muted-foreground">
                              Image selected
                            </span>
                          )}
                        </div>

                        {image && (
                          <div className="mt-2 relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
                            <img
                              src={image}
                              alt="Preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting || (!content && !image)}
                      >
                        {isSubmitting ? "Posting..." : "Post"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
