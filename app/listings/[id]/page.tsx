"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { MessageSquare, Share2, Bookmark, MapPin, DollarSign, Calendar as CalendarIcon } from "lucide-react";
import Image from "next/image";

// Mock data for a single listing
const mockListing = {
  id: "1",
  title: "Cozy Studio Apartment Near Campus",
  description: "Perfect for graduate students, this studio apartment offers a quiet and comfortable living space just 5 minutes walk from campus. Recently renovated with modern appliances and plenty of natural light.",
  propertyType: "Studio",
  location: "123 University Ave, Charlottesville, VA",
  rentPrice: 1200,
  leaseDuration: "12 months",
  availTimeStart: new Date("2024-05-01"),
  availTimeEnd: new Date("2024-08-31"),
  isSublease: true,
  isHouse: false,
  images: [
    "/listings/apartment1.jpg",
    "/listings/apartment2.jpg",
    "/listings/apartment3.jpg",
  ],
  amenities: [
    "In-unit laundry",
    "Dishwasher",
    "Central AC",
    "High-speed internet",
    "Furnished",
  ],
  owner: {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "/avatars/01.png",
    listingsCount: 5,
    memberSince: "2023",
  },
};

export default function ListingDetailsPage() {
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video">
                <Image
                  src={mockListing.images[activeImage]}
                  alt={mockListing.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <div className="p-4 flex gap-2 overflow-x-auto">
                {mockListing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 ${activeImage === index ? "ring-2 ring-blue-500" : ""
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${mockListing.title} - Image ${index + 1}`}
                      fill
                      className="object-cover rounded-md"
                    />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Listing Details */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{mockListing.title}</CardTitle>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {mockListing.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Property Type</p>
                  <p className="font-medium">{mockListing.propertyType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Rent</p>
                  <p className="font-medium flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {mockListing.rentPrice}/month
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Lease Duration</p>
                  <p className="font-medium">{mockListing.leaseDuration}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Availability</p>
                  <p className="font-medium flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {mockListing.availTimeStart.toLocaleDateString()} -{" "}
                    {mockListing.availTimeEnd.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Description</h3>
                <p className="text-muted-foreground">{mockListing.description}</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Amenities</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {mockListing.amenities.map((amenity, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Owner Info */}
          <Card>
            <CardHeader>
              <CardTitle>Listed by</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={mockListing.owner.avatar} />
                  <AvatarFallback>{mockListing.owner.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{mockListing.owner.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Member since {mockListing.owner.memberSince}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Listings</p>
                  <p className="font-medium">{mockListing.owner.listingsCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Response rate</p>
                  <p className="font-medium">100%</p>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
              <Button className="w-full" variant="outline">
                View Profile
              </Button>
            </CardContent>
          </Card>

          {/* Availability Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={mockListing.availTimeStart}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 