"use client";

import { useState } from "react";
import Image from "next/image";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  MapPinIcon,
  PencilIcon,
  PlusCircleIcon,
} from "lucide-react";
import { format } from "date-fns";

// Mock user data (this would come from your API)
const mockUser = {
  _id: "1",
  name: "Alex Johnson",
  username: "alexj",
  role: "app-user",
  email: "alex@example.com",
  isAcceptingMessages: true,
  profilePicture: "",
  bannerImg: "",
  headline: "Full Stack Developer",
  location: "San Francisco, CA",
  about:
    "Passionate developer with 5+ years of experience building web applications. I specialize in React, Node.js, and MongoDB. Always looking to learn new technologies and collaborate on interesting projects.",
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "Express",
    "Next.js",
    "Tailwind CSS",
  ],
  experience: [
    {
      title: "Senior Developer",
      company: "TechCorp",
      startDate: new Date("2022-01-01"),
      endDate: new Date("2024-02-15"),
      description:
        "Led a team of 5 developers to build and maintain the company's flagship product. Implemented new features and improved performance.",
    },
    {
      title: "Web Developer",
      company: "StartupX",
      startDate: new Date("2019-03-15"),
      endDate: new Date("2021-12-31"),
      description:
        "Developed and maintained multiple client websites. Worked directly with clients to gather requirements and implement solutions.",
    },
  ],
  education: [
    {
      school: "University of Technology",
      fieldOfStudy: "Computer Science",
      startYear: 2015,
      endYear: 2019,
    },
  ],
  connections: [],
};

// Mock posts data
const mockPosts = [
  {
    _id: "post1",
    author: {
      _id: "1",
      name: "Alex Johnson",
      username: "alexj",
      profilePicture: "",
    },
    content:
      "Just completed a new project using React and TypeScript. Check it out!",
    createdAt: new Date("2024-02-10T14:30:00"),
    likes: [],
    comments: [
      {
        content: "Looks amazing!",
        user: {
          _id: "2",
          name: "Sarah Lee",
          username: "sarahlee",
          profilePicture: "",
        },
        createdAt: new Date("2024-02-10T15:00:00"),
      },
    ],
  },
  {
    _id: "post2",
    author: {
      _id: "1",
      name: "Alex Johnson",
      username: "alexj",
      profilePicture: "",
    },
    content: "Learning a new framework today. So excited!",
    image: "/api/placeholder/600/400",
    createdAt: new Date("2024-01-25T09:15:00"),
    likes: [],
    comments: [],
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="container mx-auto py-6 space-y-6 max-w-5xl">
              {/* Profile Header */}
              <div className="relative">
                <div className="h-48 w-full rounded-lg bg-slate-200 overflow-hidden">
                  {mockUser.bannerImg ? (
                    <Image
                      src={mockUser.bannerImg}
                      alt="Profile banner"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-r from-blue-400 to-indigo-600" />
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-4 right-4 bg-white/80"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Banner
                  </Button>
                </div>

                <div className="px-6">
                  <div className="flex flex-col md:flex-row md:items-end -mt-12 md:-mt-16 gap-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-white bg-white">
                        <AvatarImage
                          src={mockUser.profilePicture}
                          alt={mockUser.name}
                        />
                        <AvatarFallback className="text-2xl bg-blue-500 text-white">
                          {mockUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex-1 space-y-1 pb-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <h1 className="text-2xl font-bold">{mockUser.name}</h1>
                        <Badge variant="outline" className="w-fit">
                          @{mockUser.username}
                        </Badge>
                      </div>
                      <p className="text-lg text-gray-600">
                        {mockUser.headline}
                      </p>
                      <div className="flex items-center text-gray-500">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span>{mockUser.location}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pb-4">
                      <Button>Connect</Button>
                      <Button variant="outline">Message</Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="posts">Posts</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                </TabsList>

                {/* Posts Tab */}
                <TabsContent value="posts" className="space-y-4 mt-6">
                  {/* Create Post Card */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage
                            src={mockUser.profilePicture}
                            alt={mockUser.name}
                          />
                          <AvatarFallback className="bg-blue-500 text-white">
                            {mockUser.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <textarea
                            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="What's on your mind?"
                            rows={2}
                          />
                          <div className="flex justify-between mt-3">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <PlusCircleIcon className="h-4 w-4 mr-1" />
                                Image
                              </Button>
                            </div>
                            <Button size="sm">Post</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Posts List */}
                  {mockPosts.map((post) => (
                    <Card key={post._id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage
                              src={post.author.profilePicture}
                              alt={post.author.name}
                            />
                            <AvatarFallback className="bg-blue-500 text-white">
                              {post.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-semibold">
                                  {post.author.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {format(post.createdAt, "MMM d, yyyy")}
                                </p>
                              </div>
                            </div>

                            <p className="my-3">{post.content}</p>

                            {post.image && (
                              <div className="mt-3 mb-4 rounded-lg overflow-hidden">
                                <Image
                                  src={post.image}
                                  alt="Post image"
                                  width={600}
                                  height={400}
                                  className="w-full object-cover"
                                />
                              </div>
                            )}

                            <div className="flex justify-between pt-3 border-t">
                              <Button variant="ghost" size="sm">
                                Like • {post.likes.length}
                              </Button>
                              <Button variant="ghost" size="sm">
                                Comment • {post.comments.length}
                              </Button>
                            </div>

                            {post.comments.length > 0 && (
                              <div className="mt-4 space-y-3">
                                {post.comments.map((comment, idx) => (
                                  <div key={idx} className="flex gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={comment.user.profilePicture}
                                        alt={comment.user.name}
                                      />
                                      <AvatarFallback className="text-xs bg-gray-500 text-white">
                                        {comment.user.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 bg-gray-100 p-3 rounded-lg">
                                      <h4 className="font-semibold text-sm">
                                        {comment.user.name}
                                      </h4>
                                      <p className="text-sm">
                                        {comment.content}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* About Tab */}
                <TabsContent value="about" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>About</CardTitle>
                        <Button variant="ghost" size="sm">
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{mockUser.about}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Skills</CardTitle>
                        <Button variant="ghost" size="sm">
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {mockUser.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Experience Tab */}
                <TabsContent value="experience" className="space-y-6 mt-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Work Experience</h2>
                    <Button>
                      <PlusCircleIcon className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>

                  {mockUser.experience.map((exp, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <BriefcaseIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-bold text-lg">
                                  {exp.title}
                                </h3>
                                <p className="text-gray-600">{exp.company}</p>
                              </div>
                              <Button variant="ghost" size="sm">
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              <span>
                                {format(exp.startDate, "MMM yyyy")} -{" "}
                                {format(exp.endDate, "MMM yyyy")}
                              </span>
                            </div>
                            <p className="mt-3">{exp.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Education Tab */}
                <TabsContent value="education" className="space-y-6 mt-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Education</h2>
                    <Button>
                      <PlusCircleIcon className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </div>

                  {mockUser.education.map((edu, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <GraduationCapIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-bold text-lg">
                                  {edu.school}
                                </h3>
                                <p className="text-gray-600">
                                  {edu.fieldOfStudy}
                                </p>
                              </div>
                              <Button variant="ghost" size="sm">
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              <span>
                                {edu.startYear} - {edu.endYear}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
