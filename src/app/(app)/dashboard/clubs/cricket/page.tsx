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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Trophy,
  Calendar as CalendarIcon,
  Users,
  MapPin,
} from "lucide-react";

const CricketClubPage: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Sample data
  const upcomingMatches = [
    {
      id: 1,
      opponent: "Royal Strikers",
      date: "March 10, 2025",
      venue: "Central Oval",
      format: "T20",
    },
    {
      id: 2,
      opponent: "Metro Cricket Club",
      date: "March 17, 2025",
      venue: "Riverside Ground",
      format: "ODI",
    },
    {
      id: 3,
      opponent: "Southside Chargers",
      date: "March 24, 2025",
      venue: "Home Ground",
      format: "T20",
    },
  ];

  const topPlayers = [
    {
      rank: 1,
      name: "James Anderson",
      role: "Bowler",
      matches: 42,
      wickets: 67,
      batting_avg: 12.5,
    },
    {
      rank: 2,
      name: "Virat Singh",
      role: "Batsman",
      matches: 45,
      runs: 1840,
      batting_avg: 42.8,
    },
    {
      rank: 3,
      name: "Sarah Taylor",
      role: "All-rounder",
      matches: 38,
      runs: 1250,
      wickets: 28,
      batting_avg: 36.4,
    },
    {
      rank: 4,
      name: "Michael Clarke",
      role: "Batsman",
      matches: 40,
      runs: 1680,
      batting_avg: 40.0,
    },
    {
      rank: 5,
      name: "Rashid Khan",
      role: "Bowler",
      matches: 36,
      wickets: 62,
      batting_avg: 15.2,
    },
  ];

  const clubNews = [
    {
      id: 1,
      title: "Club Wins Regional Championship",
      excerpt:
        "Our first team defeated Royal Strikers by 5 wickets in an exciting final to secure this season's regional trophy.",
      date: "February 18, 2025",
    },
    {
      id: 2,
      title: "New Training Facilities Open",
      excerpt:
        "The club's new indoor training center is now open, featuring state-of-the-art bowling machines and batting nets.",
      date: "February 12, 2025",
    },
    {
      id: 3,
      title: "Youth Team Success",
      excerpt:
        "Our Under-19 team has qualified for the national tournament after an unbeaten run in the regional qualifiers.",
      date: "February 5, 2025",
    },
  ];

  const trainingSchedule = [
    { day: "Monday", time: "5:00 PM - 7:00 PM", group: "Women's Team" },
    { day: "Tuesday", time: "6:00 PM - 8:00 PM", group: "Senior Men's Team" },
    { day: "Wednesday", time: "4:30 PM - 6:00 PM", group: "Under-16s" },
    { day: "Thursday", time: "6:00 PM - 8:00 PM", group: "Senior Men's Team" },
    { day: "Saturday", time: "10:00 AM - 12:00 PM", group: "All Teams" },
    { day: "Sunday", time: "9:00 AM - 11:00 AM", group: "Beginners" },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2">
          Willow Warriors Cricket Club
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Excellence in cricket since 2023
        </p>
        <div className="flex justify-center gap-4">
          <Button>Join Our Club</Button>
          <Button variant="outline">Contact Us</Button>
        </div>
      </header>

      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5" /> About Our Club
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Willow Warriors Cricket Club is a premier cricket organization
                dedicated to fostering cricket talent and promoting the spirit
                of the game. Founded in 2023, we have grown from a small local
                team to one of the region's most respected cricket clubs.
              </p>
              <p className="mb-4">
                Our club offers competitive cricket for all ages and skill
                levels, from beginners to seasoned players. With dedicated
                coaching staff and excellent facilities, we provide the perfect
                environment for players to develop their skills and enjoy the
                game.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-white-100 p-4 rounded-lg text-center border">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-bold">250+</h3>
                  <p className="text-sm">Active Members</p>
                </div>
                <div className="bg-white-100 p-4 rounded-lg text-center border">
                  <Trophy className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-bold">15</h3>
                  <p className="text-sm">Regional Titles</p>
                </div>
                <div className="bg-white-100 p-4 rounded-lg text-center border">
                  <CalendarIcon className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-bold">40</h3>
                  <p className="text-sm">Years of History</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" /> Club Calendar
              </CardTitle>
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
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <MapPin className="mr-2 h-5 w-5" /> Upcoming Matches
        </h2>
        <Table>
          <TableCaption>Fixtures for the coming month</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Opponent</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Format</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell className="font-medium">{match.opponent}</TableCell>
                <TableCell>{match.date}</TableCell>
                <TableCell>{match.venue}</TableCell>
                <TableCell>
                  <Badge
                    variant={match.format === "T20" ? "default" : "secondary"}
                  >
                    {match.format}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Membership</CardTitle>
            <CardDescription>Join our cricket community</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Become a member and enjoy access to our facilities, coaching
              sessions, and the opportunity to represent the club in matches.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Senior: $150/year
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Junior (U18): $80/year
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Family: $250/year
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Social Member:
                $50/year
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Join Now</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Schedule</CardTitle>
            <CardDescription>Weekly practice sessions</CardDescription>
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Group</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainingSchedule.map((session, index) => (
                  <TableRow key={index}>
                    <TableCell>{session.day}</TableCell>
                    <TableCell>{session.time}</TableCell>
                    <TableCell>{session.group}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Full Schedule
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Club Facilities</CardTitle>
            <CardDescription>What we offer</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> 3 professional cricket
                grounds
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Indoor training center
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> 8 practice nets
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Bowling machines
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Video analysis room
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Clubhouse with bar and
                catering
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" /> Gym and fitness center
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Gallery
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className="mb-12">
        <Tabs defaultValue="players">
          <TabsList className="mb-4">
            <TabsTrigger value="players">Top Players</TabsTrigger>
            <TabsTrigger value="news">Club News</TabsTrigger>
          </TabsList>

          <TabsContent value="players">
            <Card>
              <CardHeader>
                <CardTitle>Club Stars</CardTitle>
                <CardDescription>Our outstanding performers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {topPlayers.slice(0, 3).map((player) => (
                    <Card key={player.rank} className="border">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>
                              {player.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">
                              {player.name}
                            </CardTitle>
                            <Badge variant="outline">{player.role}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            Matches:{" "}
                            <span className="font-semibold">
                              {player.matches}
                            </span>
                          </div>
                          {player.runs && (
                            <div>
                              Runs:{" "}
                              <span className="font-semibold">
                                {player.runs}
                              </span>
                            </div>
                          )}
                          {player.wickets && (
                            <div>
                              Wickets:{" "}
                              <span className="font-semibold">
                                {player.wickets}
                              </span>
                            </div>
                          )}
                          <div>
                            Avg:{" "}
                            <span className="font-semibold">
                              {player.batting_avg}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Matches</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topPlayers.map((player) => (
                      <TableRow key={player.rank}>
                        <TableCell>{player.rank}</TableCell>
                        <TableCell className="font-medium">
                          {player.name}
                        </TableCell>
                        <TableCell>{player.role}</TableCell>
                        <TableCell>{player.matches}</TableCell>
                        <TableCell>
                          {player.role === "Bowler"
                            ? `${player.wickets} wickets`
                            : player.role === "Batsman"
                              ? `${player.runs} runs, avg ${player.batting_avg}`
                              : `${player.runs} runs, ${player.wickets} wickets`}
                        </TableCell>
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
                  Stay updated with club happenings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {clubNews.map((news) => (
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
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All News
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Our Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Youth Development</CardTitle>
              <CardDescription>Nurturing future stars</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Our youth development program is designed to introduce young
                players to cricket and develop their skills in a fun and
                supportive environment.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2" /> Under-11s
                  (Saturdays, 9:00 AM)
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2" /> Under-13s
                  (Wednesdays, 4:30 PM)
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2" /> Under-16s
                  (Wednesdays, 6:00 PM)
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2" /> Under-19s (Tuesdays,
                  5:00 PM)
                </li>
              </ul>
              <p className="mt-4">
                All coaching is provided by ECB-qualified coaches with extensive
                experience.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Learn More</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Women's Cricket</CardTitle>
              <CardDescription>Growing the women's game</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Our women's section is one of the fastest-growing parts of the
                club, with teams competing at various levels.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2" /> Seniors (Mondays,
                  5:00 PM)
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2" /> Development squad
                  (Sundays, 2:00 PM)
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2" /> Girls U15
                  (Saturdays, 10:00 AM)
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2" /> Beginners welcome
                  (Sundays, 11:00 AM)
                </li>
              </ul>
              <p className="mt-4">
                We're proud to have several county and regional representatives
                in our women's teams.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Join Women's Section</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <footer className="border-t pt-8 text-center">
        <p className="text-gray-600 mb-4">
          Willow Warriors Cricket Club &copy; 2025
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
        <p className="text-sm text-gray-500 mt-4">
          123 Cricket Lane, Sportsfield, SP1 2CR
        </p>
      </footer>
    </div>
  );
};

export default CricketClubPage;
