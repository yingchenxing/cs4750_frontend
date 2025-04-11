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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    gender: "Male",
    cleanlinessLevel: "Moderate",
    age: "22",
    pets: false,
    smokingHabits: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username ?? "",
    email: user?.email ?? "",
    phoneNumber: user?.phoneNumber ?? "",
    profilePicture: user?.profilePicture ?? "",
    bio: "Student at University of Example. Looking for housing near campus.",
  });
  const [preferencesFormData, setPreferencesFormData] = useState({ ...preferences });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreferencesChange = (name: string, value: string | boolean) => {
    setPreferencesFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically update the user profile through an API
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPreferences(preferencesFormData);
    setIsEditingPreferences(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-center">
          <p className="text-lg">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.profilePicture || "/avatars/default.png"} alt={user.username} />
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
                  <span className="ml-2">2023</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Public Profile
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="security">
                <Key className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information and how others see you on the platform.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    {isEditing ? (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              username: user.username,
                              email: user.email,
                              phoneNumber: user.phoneNumber,
                              profilePicture: user.profilePicture,
                              bio: formData.bio,
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </>
                    ) : (
                      <Button type="button" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    )}
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Roommate Preferences</CardTitle>
                  <CardDescription>
                    Set your preferences for finding compatible roommates.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handlePreferencesSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={preferencesFormData.gender}
                        onValueChange={(value) => handlePreferencesChange("gender", value)}
                        disabled={!isEditingPreferences}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cleanlinessLevel">Cleanliness Level</Label>
                      <Select
                        value={preferencesFormData.cleanlinessLevel}
                        onValueChange={(value) => handlePreferencesChange("cleanlinessLevel", value)}
                        disabled={!isEditingPreferences}
                      >
                        <SelectTrigger id="cleanlinessLevel">
                          <SelectValue placeholder="Select cleanliness level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Very Clean">Very Clean</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Relaxed">Relaxed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={preferencesFormData.age}
                        onChange={(e) => handlePreferencesChange("age", e.target.value)}
                        disabled={!isEditingPreferences}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="pets"
                        checked={preferencesFormData.pets}
                        onCheckedChange={(checked) => handlePreferencesChange("pets", checked)}
                        disabled={!isEditingPreferences}
                      />
                      <Label htmlFor="pets">Pets Allowed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="smokingHabits"
                        checked={preferencesFormData.smokingHabits}
                        onCheckedChange={(checked) => handlePreferencesChange("smokingHabits", checked)}
                        disabled={!isEditingPreferences}
                      />
                      <Label htmlFor="smokingHabits">Smoking Allowed</Label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    {isEditingPreferences ? (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditingPreferences(false);
                            setPreferencesFormData({ ...preferences });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </>
                    ) : (
                      <Button type="button" onClick={() => setIsEditingPreferences(true)}>
                        Edit Preferences
                      </Button>
                    )}
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update Password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 