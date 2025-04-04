"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";

interface FormData {
  title: string;
  description: string;
  propertyType: string;
  location: string;
  rentPrice: string;
  leaseDuration: string;
  availTimeStart: Date;
  availTimeEnd: Date;
  isSublease: boolean;
  isHouse: boolean;
  subleaseReason: string;
  images: File[];
}

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    propertyType: "Apartment",
    location: "",
    rentPrice: "",
    leaseDuration: "12",
    availTimeStart: new Date(),
    availTimeEnd: new Date(),
    isSublease: false,
    isHouse: false,
    subleaseReason: "",
    images: [],
  });

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically upload images to a storage service
      // and then create the listing with the image URLs
      console.log("Form data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to the listings page
      router.push("/listings");
    } catch (error) {
      console.error("Error creating listing:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create New Listing</CardTitle>
          <CardDescription>Fill out the details for your housing listing</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Property Details</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Cozy Studio Apartment Near Campus"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the property, amenities, and neighborhood..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Full address"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="rentPrice">Monthly Rent ($)</Label>
                    <Input
                      id="rentPrice"
                      type="number"
                      min="0"
                      placeholder="e.g., 1200"
                      value={formData.rentPrice}
                      onChange={(e) => handleChange("rentPrice", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leaseDuration">Lease Duration (months)</Label>
                    <Select
                      value={formData.leaseDuration}
                      onValueChange={(value) => handleChange("leaseDuration", value)}
                    >
                      <SelectTrigger id="leaseDuration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Available From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.availTimeStart && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.availTimeStart ? (
                            format(formData.availTimeStart, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.availTimeStart}
                          onSelect={(date: Date | undefined) => date && handleChange("availTimeStart", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Available Until</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.availTimeEnd && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.availTimeEnd ? (
                            format(formData.availTimeEnd, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.availTimeEnd}
                          onSelect={(date: Date | undefined) => date && handleChange("availTimeEnd", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleChange("propertyType", value)}
                  >
                    <SelectTrigger id="propertyType">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="House">House</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isSublease"
                    checked={formData.isSublease}
                    onCheckedChange={(checked: boolean) => handleChange("isSublease", checked)}
                  />
                  <Label htmlFor="isSublease">This is a sublease</Label>
                </div>

                {formData.isSublease && (
                  <div className="space-y-2">
                    <Label htmlFor="subleaseReason">Reason for Sublease</Label>
                    <Textarea
                      id="subleaseReason"
                      placeholder="Why are you subleasing this property?"
                      value={formData.subleaseReason}
                      onChange={(e) => handleChange("subleaseReason", e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isHouse"
                    checked={formData.isHouse}
                    onCheckedChange={(checked: boolean) => handleChange("isHouse", checked)}
                  />
                  <Label htmlFor="isHouse">This is a house</Label>
                </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-4">
                <div className="space-y-2">
                  <Label>Property Images</Label>
                  <div className="grid gap-4 md:grid-cols-3">
                    {formData.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-video overflow-hidden rounded-lg border bg-muted"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Property image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }))
                          }
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    <label
                      htmlFor="images"
                      className="flex aspect-video cursor-pointer items-center justify-center rounded-lg border border-dashed bg-muted hover:bg-muted/80"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Upload Image
                        </span>
                      </div>
                      <input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Listing"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 