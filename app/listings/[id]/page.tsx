"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { MessageSquare, Share2, Bookmark, MapPin, DollarSign, Calendar as CalendarIcon } from "lucide-react";
import Image from "next/image";
import { Listing, getListingById } from "../../services/listings";

export default function ListingDetailsPage() {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params?.id;
      if (!listingId || Array.isArray(listingId)) {
        setError("Invalid listing ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getListingById(listingId);
        setListing(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching listing:', error);
        setError('Failed to load listing details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error || 'Listing not found'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image */}
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video">
                <Image
                  src={listing.image}
                  alt={listing.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Listing Details */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{listing.title}</CardTitle>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {listing.location}
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
                  <p className="font-medium">{listing.propertyType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Rent</p>
                  <p className="font-medium flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {listing.rentPrice}/month
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Lease Duration</p>
                  <p className="font-medium">{listing.leaseDuration} months</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Availability</p>
                  <p className="font-medium flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {new Date(listing.availTimeStart).toLocaleDateString()} -{" "}
                    {new Date(listing.availTimeEnd).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Description</h3>
                <p className="text-muted-foreground">{listing.description}</p>
              </div>

              {listing.isSublease && listing.subleaseReason && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Sublease Reason</h3>
                  <p className="text-muted-foreground">{listing.subleaseReason}</p>
                </div>
              )}
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
                  <AvatarImage src={listing.user.profilePicture} />
                  <AvatarFallback>{listing.user.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{listing.user.username}</p>
                  <p className="text-sm text-muted-foreground">{listing.user.email}</p>
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
                selected={new Date(listing.availTimeStart)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 