"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, DollarSign, Building, PenSquare, Trash2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import axios from 'axios';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Listing {
  listingId: number;
  userId: number;
  title: string;
  description: string;
  propertyType: string;
  location: string;
  rentPrice: number;
  leaseDuration: number;
  availTimeStart: string;
  availTimeEnd: string;
  image: string;
  isSublease: boolean;
  subleaseReason?: string;
  user: {
    userId: number;
    username: string;
    email: string;
    phoneNumber: string;
    profilePicture: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cs4750.onrender.com';

export default function MyListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchMyListings = async () => {
    if (!user?.userId) {
      setError("Please log in to view your listings");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/listings/publisher/${user.userId}`, {
        withCredentials: true,
      });
      setListings(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch your listings. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [user?.userId]);

  const handleDelete = async (listingId: number) => {
    try {
      setDeletingId(listingId);
      await axios.delete(`${API_BASE_URL}/api/listings/${listingId}`, {
        withCredentials: true,
      });
      toast.success("Listing deleted successfully");
      // Refresh the listings
      fetchMyListings();
    } catch (err: any) {
      console.error('Error deleting listing:', err);
      if (err.response?.status === 404) {
        toast.error("Listing not found");
      } else {
        toast.error("Failed to delete listing. Please try again.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
            <p className="text-muted-foreground mb-4">You need to be logged in to view your listings.</p>
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
            <p className="mt-4 text-lg">Loading your listings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Listings</h1>
          <div className="flex items-center space-x-2">
            <Button asChild>
              <Link href="/listings/create">
                Create New Listing
              </Link>
            </Button>
          </div>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.listingId} className="overflow-hidden">
                <div className="aspect-video w-full bg-muted">
                  {listing.image ? (
                    <img
                      src={listing.image}
                      alt={listing.title}
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
                    <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {listing.location}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">{listing.description}</p>
                  {listing.isSublease && listing.subleaseReason && (
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <span className="font-medium">Sublease Reason: </span>
                      <span className="ml-1 line-clamp-1">{listing.subleaseReason}</span>
                    </div>
                  )}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <DollarSign className="mr-1 h-4 w-4" />
                      <span>${listing.rentPrice}/month</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>{listing.leaseDuration} months</span>
                    </div>
                    <div className="flex items-center">
                      <Building className="mr-1 h-4 w-4" />
                      <span>{listing.propertyType}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Listing
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your listing.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(listing.listingId)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deletingId === listing.listingId ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <PenSquare className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No listings found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {error || "You haven't created any listings yet."}
            </p>
            {!error && (
              <Button className="mt-4" asChild>
                <Link href="/listings/create">Create Your First Listing</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 