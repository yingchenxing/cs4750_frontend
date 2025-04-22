"use client";

import { useState, useEffect } from "react";
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
import { getUserPreferences, createUserPreferences, updateUserPreferences, handlePreferencesError, type UserPreferences, type CreatePreferencesRequest, type UpdatePreferencesRequest } from "../services/preferences";

export default function ProfilePage() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username ?? "",
    email: user?.email ?? "",
    phoneNumber: user?.phoneNumber ?? "",
    profilePicture: user?.profilePicture ?? "",
    bio: "Student at University of Example. Looking for housing near campus.",
  });
  const [preferencesFormData, setPreferencesFormData] = useState<CreatePreferencesRequest>({
    userId: user?.userId || 0,
    gender: "Other",
    cleanlinessLevel: "Moderate",
    age: 20,
    pets: false,
    smokingHabits: false,
    bio: "",
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user?.userId) return;

      try {
        setIsLoading(true);
        const data = await getUserPreferences(user.userId);
        setPreferences(data);
        setPreferencesFormData({
          userId: user.userId,
          gender: data.gender,
          cleanlinessLevel: data.cleanlinessLevel,
          age: data.age,
          pets: data.pets,
          smokingHabits: data.smokingHabits,
          bio: data.bio,
        });
        setNeedsSetup(false);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setNeedsSetup(true);
          setIsEditingPreferences(true);
        } else {
          const { message } = handlePreferencesError(error);
          toast.error(message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [user?.userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to update the user's profile
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.userId) return;

    try {
      let updatedPreferences;
      if (needsSetup) {
        updatedPreferences = await createUserPreferences(preferencesFormData);
        setNeedsSetup(false);
      } else {
        const updateData: UpdatePreferencesRequest = {
          gender: preferencesFormData.gender,
          cleanlinessLevel: preferencesFormData.cleanlinessLevel,
          age: preferencesFormData.age,
          pets: preferencesFormData.pets,
          smokingHabits: preferencesFormData.smokingHabits,
          bio: preferencesFormData.bio,
        };
        updatedPreferences = await updateUserPreferences(user.userId, updateData);
      }
      setPreferences(updatedPreferences);
      setIsEditingPreferences(false);
      toast.success(needsSetup ? "Preferences created successfully!" : "Preferences updated successfully!");
    } catch (error) {
      const { message } = handlePreferencesError(error);
      toast.error(message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferencesChange = (name: string, value: string | boolean | number) => {
    setPreferencesFormData((prev: CreatePreferencesRequest) => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Please Log In</CardTitle>
            <CardDescription>You need to be logged in to view your profile.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => window.location.href = '/auth/login'}>
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading preferences...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          {/* <TabsTrigger value="security">Security</TabsTrigger> */}
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.profilePicture || "/default-avatar.png"} alt={formData.username} />
                  <AvatarFallback>{formData.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{formData.username}</CardTitle>
                  <CardDescription>{formData.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Username</Label>
                    <p className="text-sm text-muted-foreground">{formData.username}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">{formData.email}</p>
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <p className="text-sm text-muted-foreground">{formData.phoneNumber}</p>
                  </div>
                  <div>
                    <Label>Bio</Label>
                    <p className="text-sm text-muted-foreground">{formData.bio}</p>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>{needsSetup ? "Set Up Your Preferences" : "Housing Preferences"}</CardTitle>
              <CardDescription>
                {needsSetup
                  ? "Welcome! Please set up your housing preferences to help us find your perfect match."
                  : "Set your preferences for finding the perfect housing match."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(isEditingPreferences || needsSetup) ? (
                <form onSubmit={handlePreferencesSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select
                      value={preferencesFormData.gender}
                      onValueChange={(value) => handlePreferencesChange("gender", value)}
                    >
                      <SelectTrigger>
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
                    <Label>Cleanliness Level</Label>
                    <Select
                      value={preferencesFormData.cleanlinessLevel}
                      onValueChange={(value) => handlePreferencesChange("cleanlinessLevel", value)}
                    >
                      <SelectTrigger>
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
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={preferencesFormData.age}
                      onChange={(e) => handlePreferencesChange("age", parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                      value={preferencesFormData.bio}
                      onChange={(e) => handlePreferencesChange("bio", e.target.value)}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Pets</Label>
                    <Switch
                      checked={preferencesFormData.pets}
                      onCheckedChange={(checked) => handlePreferencesChange("pets", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Smoking Habits</Label>
                    <Switch
                      checked={preferencesFormData.smokingHabits}
                      onCheckedChange={(checked) => handlePreferencesChange("smokingHabits", checked)}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    {!needsSetup && (
                      <Button type="button" variant="outline" onClick={() => setIsEditingPreferences(false)}>
                        Cancel
                      </Button>
                    )}
                    <Button type="submit">{needsSetup ? "Create Preferences" : "Save Changes"}</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Gender</Label>
                    <p className="text-sm text-muted-foreground">{preferences?.gender}</p>
                  </div>
                  <div>
                    <Label>Cleanliness Level</Label>
                    <p className="text-sm text-muted-foreground">{preferences?.cleanlinessLevel}</p>
                  </div>
                  <div>
                    <Label>Age</Label>
                    <p className="text-sm text-muted-foreground">{preferences?.age}</p>
                  </div>
                  <div>
                    <Label>Bio</Label>
                    <p className="text-sm text-muted-foreground">{preferences?.bio || "No bio provided"}</p>
                  </div>
                  <div>
                    <Label>Pets</Label>
                    <p className="text-sm text-muted-foreground">{preferences?.pets ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <Label>Smoking Habits</Label>
                    <p className="text-sm text-muted-foreground">{preferences?.smokingHabits ? "Yes" : "No"}</p>
                  </div>
                  <Button onClick={() => setIsEditingPreferences(true)}>Edit Preferences</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Change Password</Label>
                <Button variant="outline" className="w-full">
                  Update Password
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Two-Factor Authentication</Label>
                <Button variant="outline" className="w-full">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
} 