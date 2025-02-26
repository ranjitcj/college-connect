"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import {
  Bell,
  Sun,
  Moon,
  Menu,
  Search,
  Grid,
  Clipboard,
  Book,
  Home,
  MessageCircle,
  PlusCircle,
  Briefcase,
  GraduationCap,
  MapPin,
  Users,
  Edit,
} from "lucide-react";

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface UserData {
  name: string;
  username: string;
  role: "student" | "app-user" | "admin" | "teacher";
  email: string;
  isAcceptingMessages: boolean;
  profilePicture: string;
  bannerImg: string;
  headline: string;
  location: string;
  about: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    startDate: Date;
    endDate: Date;
    description: string;
  }[];
  education: {
    school: string;
    fieldOfStudy: string;
    startYear: number;
    endYear: number;
  }[];
  connections: string[];
}

interface Post {
  id: string;
  author: string;
  content?: string;
  image?: string;
  likes: string[];
  comments: {
    content: string;
    user: string;
    createdAt: Date;
  }[];
  createdAt: Date;
}

export default function ProfilePage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  // Mock user data based on your schema
  const [userData, setUserData] = useState<UserData>({
    name: "John Doe",
    username: "johndoe",
    role: "student",
    email: "john.doe@example.com",
    isAcceptingMessages: true,
    profilePicture: "",
    bannerImg: "",
    headline: "Computer Science Student",
    location: "New York, USA",
    about:
      "Passionate computer science student with a focus on web development and AI.",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "TypeScript"],
    experience: [
      {
        title: "Web Developer Intern",
        company: "Tech Innovations",
        startDate: new Date("2023-05-01"),
        endDate: new Date("2023-08-31"),
        description:
          "Worked on developing and maintaining web applications using React and Node.js.",
      },
    ],
    education: [
      {
        school: "University of Technology",
        fieldOfStudy: "Computer Science",
        startYear: 2021,
        endYear: 2025,
      },
    ],
    connections: ["1", "2", "3", "4", "5"],
  });

  // Mock posts data
  const [posts, setPosts] = useState<Post[]>(
    Array(9)
      .fill(null)
      .map((_, i) => ({
        id: `${i}`,
        author: userData.username,
        content: `This is post ${i + 1}`,
        image: ``,
        likes: [],
        comments: [],
        createdAt: new Date(),
      }))
  );

  // Attendance charts data
  const attendancePieData = {
    labels: ["Present", "Late", "Absent"],
    datasets: [
      {
        data: [70, 15, 15],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
        hoverBackgroundColor: ["#059669", "#d97706", "#dc2626"],
      },
    ],
  };

  const attendanceBarData = {
    labels: ["CS-101", "Math-202", "Physics-303", "Eng-404", "History-505"],
    datasets: [
      {
        label: "Attendance %",
        data: [85, 75, 90, 65, 80],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
  };

  // Toggle dark mode and update document class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 p-5 border-r h-screen sticky top-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">College Connect</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/attendance-records">
              <Clipboard className="mr-2 h-4 w-4" />
              Attendance Record
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="#">
              <Book className="mr-2 h-4 w-4" />
              Library Record
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="#">
              <Users className="mr-2 h-4 w-4" />
              Take Attendance
            </Link>
          </Button>
        </nav>

        <div className="mt-auto">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="#">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage
                  src={userData.profilePicture || ""}
                  alt={userData.name}
                />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {userData.name}
            </Link>
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <main className="flex-1">
          {/* Top Navbar */}
          <header className="sticky top-0 z-30 w-full border-b bg-background">
            <div className="flex h-16 items-center px-4 gap-4">
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <div className="flex items-center rounded-md border px-3 w-full max-w-md">
                <Search className="h-4 w-4 text-muted-foreground mr-2" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="border-0 h-9 focus-visible:ring-0 bg-transparent"
                />
              </div>

              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                className="hidden md:flex"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </header>

          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full p-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">College Connect</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </div>

              <nav className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/attendance-records">
                    <Clipboard className="mr-2 h-4 w-4" />
                    Attendance Record
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="#">
                    <Book className="mr-2 h-4 w-4" />
                    Library Record
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="#">
                    <Users className="mr-2 h-4 w-4" />
                    Take Attendance
                  </Link>
                </Button>
              </nav>

              <div className="mt-auto">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="#">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage
                        src={userData.profilePicture || ""}
                        alt={userData.name}
                      />
                      <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {userData.name}
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>

          {/* Profile Content */}
          <div className="container max-w-screen-xl mx-auto">
            {/* Profile Header */}
            <div className="relative">
              {/* Banner Image */}
              <div className="h-40 w-full bg-gradient-to-r from-blue-500 to-blue-700 relative">
                {userData.bannerImg && (
                  <Image
                    src={userData.bannerImg}
                    alt="Banner"
                    fill
                    className="object-cover"
                  />
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-4 bottom-4"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Profile
                </Button>
              </div>

              {/* Profile Info */}
              <div className="relative px-6 pb-4">
                <Avatar className="absolute -top-12 h-24 w-24 border-4 border-background">
                  <AvatarImage
                    src={userData.profilePicture || ""}
                    alt={userData.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {userData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="pt-14 flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold">{userData.name}</h1>
                      <Badge variant="outline">{userData.role}</Badge>
                    </div>
                    <p className="text-muted-foreground">{userData.headline}</p>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {userData.location}
                      <span className="mx-2">•</span>
                      <Users className="h-3 w-3 mr-1" />
                      {userData.connections.length} connections
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button size="sm">Connect</Button>
                    <Button size="sm" variant="outline">
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Tabs */}
            <Tabs
              defaultValue="posts"
              value={activeTab}
              onValueChange={setActiveTab}
              className="px-6"
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="posts">
                  <Grid className="h-4 w-4 mr-2" />
                  Posts
                </TabsTrigger>
                <TabsTrigger value="attendance">
                  <Clipboard className="h-4 w-4 mr-2" />
                  Attendance
                </TabsTrigger>
                <TabsTrigger value="library">
                  <Book className="h-4 w-4 mr-2" />
                  Library
                </TabsTrigger>
              </TabsList>

              {/* About and Skills Sections - Above the tabs content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{userData.about}</p>

                    {userData.experience.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-semibold text-sm flex items-center mb-2">
                          <Briefcase className="h-4 w-4 mr-2" />
                          Experience
                        </h3>
                        {userData.experience.map((exp, index) => (
                          <div key={index} className="mb-3">
                            <div className="font-medium">{exp.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {exp.company}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(exp.startDate).toLocaleDateString(
                                "en-US",
                                { month: "short", year: "numeric" }
                              )}{" "}
                              -
                              {new Date(exp.endDate).toLocaleDateString(
                                "en-US",
                                { month: "short", year: "numeric" }
                              )}
                            </div>
                            <p className="text-sm mt-1">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {userData.education.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-semibold text-sm flex items-center mb-2">
                          <GraduationCap className="h-4 w-4 mr-2" />
                          Education
                        </h3>
                        {userData.education.map((edu, index) => (
                          <div key={index} className="mb-3">
                            <div className="font-medium">{edu.school}</div>
                            <div className="text-sm text-muted-foreground">
                              {edu.fieldOfStudy}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {edu.startYear} - {edu.endYear}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {userData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tab Contents */}
              <TabsContent value="posts" className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {posts.map((post, index) => (
                    <div
                      key={index}
                      className="aspect-square relative bg-muted rounded overflow-hidden group"
                    >
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={`Post ${index + 1}`}
                          fill
                          className="object-cover group-hover:opacity-90 transition-opacity"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full p-4 text-center text-muted-foreground">
                          {post.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="attendance" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Attendance Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <Pie data={attendancePieData} options={chartOptions} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Attendance by Subject</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <Bar data={attendanceBarData} options={chartOptions} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Attendance History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-muted">
                          <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Subject</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Marked By</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array(5)
                            .fill(null)
                            .map((_, index) => (
                              <tr key={index} className="border-b">
                                <td className="px-6 py-4">
                                  {new Date(
                                    2025,
                                    1,
                                    20 - index
                                  ).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                  {
                                    [
                                      "CS-101",
                                      "Math-202",
                                      "Physics-303",
                                      "Eng-404",
                                      "History-505",
                                    ][index]
                                  }
                                </td>
                                <td className="px-6 py-4">
                                  <Badge
                                    variant={
                                      index % 3 === 0
                                        ? "default"
                                        : index % 3 === 1
                                          ? "warning"
                                          : "destructive"
                                    }
                                  >
                                    {index % 3 === 0
                                      ? "Present"
                                      : index % 3 === 1
                                        ? "Late"
                                        : "Absent"}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4">Prof. Smith</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="library" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Library Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array(6)
                        .fill(null)
                        .map((_, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex flex-col">
                                <h3 className="font-semibold">
                                  Book Title {index + 1}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Author Name
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-sm text-blue-500">
                                    Due:{" "}
                                    {new Date(
                                      2025,
                                      2,
                                      30 - index
                                    ).toLocaleDateString()}
                                  </span>
                                  <Button variant="outline" size="sm">
                                    Return
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </Sheet>

      {/* Mobile Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden border-t bg-background z-30">
        <div className="flex justify-around py-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <Home className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/add-post")}
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/messages")}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
