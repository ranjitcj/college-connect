"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { ChevronRight } from "lucide-react";

const ChessClubPage: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Sample data
  const upcomingEvents = [
    {
      id: 1,
      name: "Weekly Tournament",
      date: "March 5, 2025",
      location: "Main Hall",
      level: "All Levels",
    },
    {
      id: 2,
      name: "Beginner's Workshop",
      date: "March 12, 2025",
      location: "Room 103",
      level: "Beginner",
    },
    {
      id: 3,
      name: "Grand Master Exhibition",
      date: "March 19, 2025",
      location: "Auditorium",
      level: "Spectators Welcome",
    },
  ];

  const topPlayers = [
    { rank: 1, name: "Alexandra Knight", rating: 2150, wins: 38, losses: 4 },
    { rank: 2, name: "Michael Bishop", rating: 2085, wins: 32, losses: 8 },
    { rank: 3, name: "Robert King", rating: 2040, wins: 29, losses: 11 },
    { rank: 4, name: "Sarah Queen", rating: 1980, wins: 26, losses: 13 },
    { rank: 5, name: "David Rook", rating: 1945, wins: 24, losses: 16 },
  ];

  const chessNews = [
    {
      id: 1,
      title: "Club Champion Crowned",
      excerpt:
        "Alexandra Knight defeats Michael Bishop in an exciting final match to become our new club champion.",
      date: "February 20, 2025",
    },
    {
      id: 2,
      title: "New Chess Sets Arrived",
      excerpt:
        "The club has received a donation of 10 new tournament-quality chess sets from local business Chess Masters Inc.",
      date: "February 15, 2025",
    },
    {
      id: 3,
      title: "Online Tournament Success",
      excerpt:
        "Our first online tournament attracted over 50 participants from around the city. Congratulations to all players!",
      date: "February 8, 2025",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2">Queen's Gambit Chess Club</h1>
        <p className="text-xl text-gray-600 mb-6">
          Fostering strategic minds since 2024
        </p>
        <div className="flex justify-center gap-4">
          <Button>Join Now</Button>
          <Button variant="outline">Contact Us</Button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Membership</CardTitle>
            <CardDescription>Join our growing community</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Enjoy weekly tournaments, training sessions, and access to our
              extensive chess library.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Standard: $60/year
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Student: $30/year
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Family: $100/year
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Become a Member</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meeting Times</CardTitle>
            <CardDescription>When to find us</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Tuesdays: 6:00 PM -
                9:00 PM
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Thursdays: 6:00 PM -
                9:00 PM
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Saturdays: 1:00 PM -
                5:00 PM
              </li>
            </ul>
            <p className="mt-4">Located at: 123 Chess Square, Downtown</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View on Map
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Club Calendar</CardTitle>
            <CardDescription>Upcoming events</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Events
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
        <Table>
          <TableCaption>Join us at our next event</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.level}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    Register
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="mb-12">
        <Tabs defaultValue="rankings">
          <TabsList className="mb-4">
            <TabsTrigger value="rankings">Club Rankings</TabsTrigger>
            <TabsTrigger value="news">Chess News</TabsTrigger>
          </TabsList>

          <TabsContent value="rankings">
            <Card>
              <CardHeader>
                <CardTitle>Top Players</CardTitle>
                <CardDescription>Current club rankings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Wins</TableHead>
                      <TableHead>Losses</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topPlayers.map((player) => (
                      <TableRow key={player.rank}>
                        <TableCell>{player.rank}</TableCell>
                        <TableCell className="font-medium">
                          {player.name}
                        </TableCell>
                        <TableCell>{player.rating}</TableCell>
                        <TableCell>{player.wins}</TableCell>
                        <TableCell>{player.losses}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>Latest Club News</CardTitle>
                <CardDescription>
                  Stay updated with chess happenings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {chessNews.map((news) => (
                    <div key={news.id} className="border-b pb-4 last:border-0">
                      <h3 className="text-lg font-semibold">{news.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{news.date}</p>
                      <p>{news.excerpt}</p>
                      <Button variant="link" className="p-0 mt-2">
                        Read more
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Learn with Us</CardTitle>
            <CardDescription>Chess education for all levels</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Whether you're just learning how the pieces move or preparing for
              tournament play, our club offers instruction for chess players of
              all skill levels.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Beginner Lessons
                (Saturdays at 1:00 PM)
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Intermediate Strategy
                (Thursdays at 6:30 PM)
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Advanced Tactics
                (Tuesdays at 7:00 PM)
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> One-on-one coaching
                available
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline">View Class Schedule</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Club Resources</CardTitle>
            <CardDescription>Tools to improve your game</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Members have access to our extensive collection of chess
              resources:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Chess library with
                over 200 books
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Digital analysis tools
                and software
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Video recordings of
                master games
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Training puzzles and
                exercises
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Browse Resources</Button>
          </CardFooter>
        </Card>
      </section>

      <footer className="border-t pt-8 text-center">
        <p className="text-gray-600 mb-4">
          Queen's Gambit Chess Club &copy; 2025
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="ghost" size="sm">
            About
          </Button>
          <Button variant="ghost" size="sm">
            Privacy
          </Button>
          <Button variant="ghost" size="sm">
            Terms
          </Button>
          <Button variant="ghost" size="sm">
            Contact
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ChessClubPage;
