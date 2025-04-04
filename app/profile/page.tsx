"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Key, Camera } from "lucide-react";

export default function ProfilePage() {
  // Mock user data - would be fetched from API
  const [user, setUser] = useState({
    username: "johndoe",
    email: "john@example.com",
    phoneNumber: "+1 (555) 123-4567",
    profilePicture: "/avatars/01.png",
    bio: "Student at University of Example. Looking for housing near campus.",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-[1fr_3fr]">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.profilePicture} alt={user.username} />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <CardTitle className="text-xl">{user.username}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">{user.phoneNumber || "Not provided"}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Member since:</span>
                  <span className="ml-2">January 2023</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Public Profile
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Key className="mr-2 h-4 w-4" />
                Security
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information and how others see you on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-1">
                    <div className="text-sm font-medium">Username</div>
                    <div className="text-sm text-muted-foreground">{user.username}</div>
                  </div>
                  <div className="grid gap-1">
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                  <div className="grid gap-1">
                    <div className="text-sm font-medium">Phone Number</div>
                    <div className="text-sm text-muted-foreground">
                      {user.phoneNumber || "Not provided"}
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <div className="text-sm font-medium">Bio</div>
                    <div className="text-sm text-muted-foreground">{user.bio}</div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Roommate Profile</CardTitle>
              <CardDescription>
                Manage your roommate preferences and profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preferences">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="preferences" className="space-y-4 pt-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Gender</Label>
                      <div className="text-sm text-muted-foreground">Male</div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Cleanliness Level</Label>
                      <div className="text-sm text-muted-foreground">Moderate</div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Age</Label>
                      <div className="text-sm text-muted-foreground">22</div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Pets</Label>
                      <div className="text-sm text-muted-foreground">No pets</div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Smoking Habits</Label>
                      <div className="text-sm text-muted-foreground">Non-smoker</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline">Edit Preferences</Button>
                  </div>
                </TabsContent>
                <TabsContent value="availability" className="space-y-4 pt-4">
                  <div className="text-center text-muted-foreground">
                    No availability information set.
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline">Set Availability</Button>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="space-y-4 pt-4">
                  <div className="text-center text-muted-foreground">
                    No reviews yet.
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 