"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, DollarSign, Building, Bookmark } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import axios from 'axios';

interface SavedListing {
  savedId: number;
  savedAt: string;
  listing: {
    listing_id: number;
    title: string;
    description: string;
    property_type: string;
    location: string;
    rent_price: number;
    lease_duration: number;
    avail_time_start: string;
    avail_time_end: string;
    image: string;
    User: {
      user_id: number;
      username: string;
      email: string;
      phone_number: string;
      profile_picture: string;
    };
    HouseListing?: {
      house_listing_id: number;
    };
    SubleaseListing?: {
      sublease_listing_id: number;
      sublease_reason: string;
    };
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cs4750.onrender.com';

export default function SavedListingsPage() {
  const { user } = useAuth();
  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedListings = async () => {
      if (!user?.userId) {
        setError("Please log in to view saved listings");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/saved-listings/user/${user.userId}`, {
          withCredentials: true,
        });
        setSavedListings(response.data);
      } catch (err) {
        setError("Failed to fetch saved listings. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedListings();
  }, [user?.userId]);

  if (!user) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
            <p className="text-muted-foreground mb-4">You need to be logged in to view your saved listings.</p>
            <Button asChild>
              <Link href="/auth/login">Log In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-lg">Loading saved listings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Saved Listings</h1>
          <div className="flex items-center space-x-2">
            <Button asChild>
              <Link href="/listings">
                Browse More Listings
              </Link>
            </Button>
          </div>
        </div>

        {savedListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedListings.map((saved) => (
              <Card key={saved.savedId} className="overflow-hidden">
                <div className="aspect-video w-full bg-muted">
                  {saved.listing.image ? (
                    <img
                      src={saved.listing.image}
                      alt={saved.listing.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Building className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-1">{saved.listing.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {saved.listing.location}
                    </CardDescription>
                    <div className="text-xs text-muted-foreground">
                      Saved on {new Date(saved.savedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">{saved.listing.description}</p>
                  {saved.listing.SubleaseListing?.sublease_reason && (
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <span className="font-medium">Sublease Reason: </span>
                      <span className="ml-1 line-clamp-1">{saved.listing.SubleaseListing.sublease_reason}</span>
                    </div>
                  )}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <DollarSign className="mr-1 h-4 w-4" />
                      <span>${saved.listing.rent_price}/month</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>{saved.listing.lease_duration} months</span>
                    </div>
                    <div className="flex items-center">
                      <Building className="mr-1 h-4 w-4" />
                      <span>{saved.listing.property_type}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/listings/${saved.listing.listing_id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <Bookmark className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No saved listings found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {error || "You haven't saved any listings yet."}
            </p>
            {!error && (
              <Button className="mt-4" asChild>
                <Link href="/listings">Browse Listings</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 