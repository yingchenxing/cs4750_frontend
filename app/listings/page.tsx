"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, MapPin, Calendar, DollarSign, Home, Building, Heart } from "lucide-react";
import { getListings, Listing } from "@/app/services/listings";

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    propertyType: "all",
    minPrice: "",
    maxPrice: "",
    leaseDuration: "all",
    listingType: "all",
    isSublease: "all",
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings();
        setListings(data);
      } catch (err) {
        setError("Failed to fetch listings. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Filter listings based on search query and filters
  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPropertyType =
      filters.propertyType === "all" || listing.propertyType === filters.propertyType;

    const matchesMinPrice =
      !filters.minPrice || listing.rentPrice >= parseInt(filters.minPrice);

    const matchesMaxPrice =
      !filters.maxPrice || listing.rentPrice <= parseInt(filters.maxPrice);

    const matchesLeaseDuration =
      filters.leaseDuration === "all" ||
      listing.leaseDuration.toString() === filters.leaseDuration;

    const matchesSublease = filters.isSublease === "all" ||
      (filters.isSublease === "sublease" && listing.subleaseReason) ||
      (filters.isSublease === "regular" && !listing.subleaseReason);

    return (
      matchesSearch &&
      matchesPropertyType &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesLeaseDuration &&
      matchesSublease
    );
  });

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-lg">Loading listings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center justify-center">
          <div className="text-center text-red-500">
            <p className="text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-[1fr_3fr]">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </CardTitle>
              <CardDescription>Filter housing listings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by title, location..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select
                  value={filters.propertyType}
                  onValueChange={(value) =>
                    setFilters({ ...filters, propertyType: value })
                  }
                >
                  <SelectTrigger id="propertyType">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="loft">Loft</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="cabin">Cabin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, minPrice: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, maxPrice: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="leaseDuration">Lease Duration (months)</Label>
                <Select
                  value={filters.leaseDuration}
                  onValueChange={(value) =>
                    setFilters({ ...filters, leaseDuration: value })
                  }
                >
                  <SelectTrigger id="leaseDuration">
                    <SelectValue placeholder="Select lease duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="listingType">Listing Type</Label>
                <Select
                  value={filters.isSublease}
                  onValueChange={(value) =>
                    setFilters({ ...filters, isSublease: value })
                  }
                >
                  <SelectTrigger id="listingType">
                    <SelectValue placeholder="Select listing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="regular">Regular Listings</SelectItem>
                    <SelectItem value="sublease">Subleases</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  setFilters({
                    propertyType: "all",
                    minPrice: "",
                    maxPrice: "",
                    leaseDuration: "all",
                    listingType: "all",
                    isSublease: "all",
                  })
                }
              >
                Reset Filters
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Listings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Housing Listings</h1>
            <div className="flex items-center space-x-2">
              <Button asChild>
                <Link href="/listings/create">
                  Create Listing
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredListings.map((listing) => (
              <Card key={listing.listing_id} className="overflow-hidden">
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
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{listing.title}</CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {listing.location}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">{listing.description}</p>
                  {listing.subleaseReason && (
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <span className="font-medium">Sublease Reason: </span>
                      <span className="ml-1">{listing.subleaseReason}</span>
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
                  <Button className="w-full" asChild>
                    <Link href={`/listings/${listing.listing_id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Search className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No listings found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filters to find more listings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 