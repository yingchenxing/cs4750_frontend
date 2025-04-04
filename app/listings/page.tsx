"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, MapPin, Calendar, DollarSign, Home, Building, Heart } from "lucide-react";

// Mock data for listings
const mockListings = [
  {
    id: 1,
    title: "Cozy Studio Apartment Near Campus",
    description: "A comfortable studio apartment within walking distance to the university. Perfect for a single student.",
    propertyType: "Apartment",
    location: "123 University Ave, College Town",
    rentPrice: 1200,
    leaseDuration: 12,
    availTimeStart: "2023-08-01",
    availTimeEnd: "2024-07-31",
    isSublease: false,
    isHouse: false,
    image: "/listings/apartment1.jpg",
  },
  {
    id: 2,
    title: "2BR/1BA Apartment - Sublease Available",
    description: "Looking for someone to take over my lease for the summer semester. Fully furnished with all utilities included.",
    propertyType: "Apartment",
    location: "456 College Blvd, College Town",
    rentPrice: 800,
    leaseDuration: 3,
    availTimeStart: "2023-06-01",
    availTimeEnd: "2023-08-31",
    isSublease: true,
    isHouse: false,
    subleaseReason: "Summer internship in another city",
    image: "/listings/apartment2.jpg",
  },
  {
    id: 3,
    title: "3BR/2BA House with Backyard",
    description: "Spacious house with a large backyard. Perfect for a group of friends. Close to campus and shopping.",
    propertyType: "House",
    location: "789 Student St, College Town",
    rentPrice: 1800,
    leaseDuration: 12,
    availTimeStart: "2023-08-15",
    availTimeEnd: "2024-08-14",
    isSublease: false,
    isHouse: true,
    image: "/listings/house1.jpg",
  },
  {
    id: 4,
    title: "1BR/1BA Apartment - Quiet Neighborhood",
    description: "Quiet apartment in a residential neighborhood. Close to public transportation and grocery stores.",
    propertyType: "Apartment",
    location: "321 Peaceful Ln, College Town",
    rentPrice: 950,
    leaseDuration: 12,
    availTimeStart: "2023-09-01",
    availTimeEnd: "2024-08-31",
    isSublease: false,
    isHouse: false,
    image: "/listings/apartment3.jpg",
  },
];

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    propertyType: "all",
    minPrice: "",
    maxPrice: "",
    leaseDuration: "all",
    listingType: "all",
  });

  // Filter listings based on search query and filters
  const filteredListings = mockListings.filter((listing) => {
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

    const matchesListingType =
      filters.listingType === "all" ||
      (filters.listingType === "sublease" && listing.isSublease) ||
      (filters.listingType === "house" && listing.isHouse) ||
      (filters.listingType === "apartment" && !listing.isHouse && !listing.isSublease);

    return (
      matchesSearch &&
      matchesPropertyType &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesLeaseDuration &&
      matchesListingType
    );
  });

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
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="listingType">Listing Type</Label>
                <Select
                  value={filters.listingType}
                  onValueChange={(value) =>
                    setFilters({ ...filters, listingType: value })
                  }
                >
                  <SelectTrigger id="listingType">
                    <SelectValue placeholder="Select listing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="apartment">Regular Apartment</SelectItem>
                    <SelectItem value="sublease">Sublease</SelectItem>
                    <SelectItem value="house">House</SelectItem>
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

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Listings</TabsTrigger>
              <TabsTrigger value="apartments">Apartments</TabsTrigger>
              <TabsTrigger value="subleases">Subleases</TabsTrigger>
              <TabsTrigger value="houses">Houses</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 pt-4">
              <div className="grid gap-6 md:grid-cols-2">
                {filteredListings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden">
                    <div className="aspect-video w-full bg-muted">
                      {/* Image would go here */}
                      <div className="flex h-full items-center justify-center">
                        {listing.isHouse ? (
                          <Home className="h-12 w-12 text-muted-foreground" />
                        ) : (
                          <Building className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
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
                        {listing.isSublease && (
                          <div className="flex items-center text-amber-600">
                            <span>Sublease</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link href={`/listings/${listing.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="apartments" className="space-y-4 pt-4">
              <div className="grid gap-6 md:grid-cols-2">
                {filteredListings
                  .filter((listing) => !listing.isHouse && !listing.isSublease)
                  .map((listing) => (
                    <Card key={listing.id} className="overflow-hidden">
                      <div className="aspect-video w-full bg-muted">
                        {/* Image would go here */}
                        <div className="flex h-full items-center justify-center">
                          <Building className="h-12 w-12 text-muted-foreground" />
                        </div>
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
                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <DollarSign className="mr-1 h-4 w-4" />
                            <span>${listing.rentPrice}/month</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>{listing.leaseDuration} months</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" asChild>
                          <Link href={`/listings/${listing.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="subleases" className="space-y-4 pt-4">
              <div className="grid gap-6 md:grid-cols-2">
                {filteredListings
                  .filter((listing) => listing.isSublease)
                  .map((listing) => (
                    <Card key={listing.id} className="overflow-hidden">
                      <div className="aspect-video w-full bg-muted">
                        {/* Image would go here */}
                        <div className="flex h-full items-center justify-center">
                          <Building className="h-12 w-12 text-muted-foreground" />
                        </div>
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
                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <DollarSign className="mr-1 h-4 w-4" />
                            <span>${listing.rentPrice}/month</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>{listing.leaseDuration} months</span>
                          </div>
                          <div className="col-span-2 text-amber-600">
                            Sublease Reason: {listing.subleaseReason}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" asChild>
                          <Link href={`/listings/${listing.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="houses" className="space-y-4 pt-4">
              <div className="grid gap-6 md:grid-cols-2">
                {filteredListings
                  .filter((listing) => listing.isHouse)
                  .map((listing) => (
                    <Card key={listing.id} className="overflow-hidden">
                      <div className="aspect-video w-full bg-muted">
                        {/* Image would go here */}
                        <div className="flex h-full items-center justify-center">
                          <Home className="h-12 w-12 text-muted-foreground" />
                        </div>
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
                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <DollarSign className="mr-1 h-4 w-4" />
                            <span>${listing.rentPrice}/month</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>{listing.leaseDuration} months</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" asChild>
                          <Link href={`/listings/${listing.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>

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