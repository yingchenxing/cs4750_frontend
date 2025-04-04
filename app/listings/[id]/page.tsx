"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, DollarSign, Building, Home, Heart, MessageSquare, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for a single listing
const mockListing = {
  id: 1,
  title: "Cozy Studio Apartment Near Campus",
  description: "A comfortable studio apartment within walking distance to the university. Perfect for a single student. The apartment features:\n\n- Fully furnished with modern furniture\n- In-unit washer and dryer\n- Central air conditioning\n- High-speed internet included\n- Secure building with 24/7 access\n- On-site parking available\n- Close to public transportation\n- Walking distance to grocery stores and restaurants",
  propertyType: "Apartment",
  location: "123 University Ave, College Town",
  rentPrice: 1200,
  leaseDuration: 12,
  availTimeStart: "2023-08-01",
  availTimeEnd: "2024-07-31",
  isSublease: false,
  isHouse: false,
  images: [
    "/listings/apartment1.jpg",
    "/listings/apartment1-2.jpg",
    "/listings/apartment1-3.jpg",
  ],
  amenities: [
    "Furnished",
    "Washer/Dryer",
    "Air Conditioning",
    "Internet Included",
    "Parking",
    "Security System",
  ],
  owner: {
    id: 1,
    name: "John Doe",
    avatar: "/avatars/john.jpg",
    rating: 4.8,
    responseRate: "98%",
    responseTime: "1 hour",
  },
};

export default function ListingDetailsPage() {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Image Gallery */}
          <Card className="overflow-hidden">
            <div className="aspect-video w-full bg-muted">
              {/* Main Image */}
              <div className="relative h-full">
                <img
                  src={mockListing.images[activeImage]}
                  alt={mockListing.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setSaved(!saved)}
                  >
                    <Heart
                      className={cn("h-4 w-4", saved && "fill-current text-red-500")}
                    />
                  </Button>
                  <Button variant="secondary" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-3 gap-2 p-4">
              {mockListing.images.map((image, index) => (
                <button
                  key={index}
                  className={cn(
                    "aspect-video overflow-hidden rounded-lg border-2",
                    activeImage === index
                      ? "border-primary"
                      : "border-transparent"
                  )}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image}
                    alt={`${mockListing.title} - Image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </Card>

          {/* Listing Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{mockListing.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {mockListing.location}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span className="font-medium">${mockListing.rentPrice}/month</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{mockListing.leaseDuration} months</span>
                </div>
                <div className="flex items-center">
                  {mockListing.isHouse ? (
                    <Home className="mr-2 h-4 w-4" />
                  ) : (
                    <Building className="mr-2 h-4 w-4" />
                  )}
                  <span>{mockListing.propertyType}</span>
                </div>
                {mockListing.isSublease && (
                  <div className="flex items-center text-amber-600">
                    <span>Sublease</span>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Description</h3>
                <p className="whitespace-pre-line text-muted-foreground">
                  {mockListing.description}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Amenities</h3>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {mockListing.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center rounded-lg border p-2"
                    >
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Info */}
          <Card>
            <CardHeader>
              <CardTitle>Listed by</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={mockListing.owner.avatar} />
                  <AvatarFallback>
                    {mockListing.owner.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{mockListing.owner.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Member since 2022
                  </div>
                </div>
              </div>

              <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Response rate</span>
                  <span className="font-medium">{mockListing.owner.responseRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Response time</span>
                  <span className="font-medium">{mockListing.owner.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium">{mockListing.owner.rating}/5</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </CardFooter>
          </Card>

          {/* Availability Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Available from</span>
                  <span className="font-medium">
                    {new Date(mockListing.availTimeStart).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Available until</span>
                  <span className="font-medium">
                    {new Date(mockListing.availTimeEnd).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 