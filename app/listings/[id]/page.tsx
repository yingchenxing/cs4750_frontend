"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { MessageSquare, Share2, Bookmark, MapPin, DollarSign, Calendar as CalendarIcon, Star, Edit2, Trash2, Check } from "lucide-react";
import Image from "next/image";
import { Listing, getListingById } from "../../services/listings";
import { Review, getListingReviews, createReview, updateReview, deleteReview, handleReviewError } from "../../services/reviews";
import { SavedListing, checkIfListingSaved, saveListing, deleteSavedListing } from "../../services/savedListings";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ListingDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [savedListing, setSavedListing] = useState<SavedListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const listingId = params?.id;
      if (!listingId || Array.isArray(listingId)) {
        setError("Invalid listing ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [listingData, reviewsData] = await Promise.all([
          getListingById(listingId),
          getListingReviews(listingId),
        ]);

        // Check if the listing is saved by the current user
        if (user?.userId) {
          const savedData = await checkIfListingSaved(parseInt(listingId), user.userId);
          setIsSaved(!!savedData);
          setSavedListing(savedData);
        }

        setListing(listingData);
        setReviews(reviewsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load listing details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params?.id, user?.userId]);

  const handleReviewSubmit = async () => {
    if (!user?.userId || !listing) return;

    try {
      if (editingReview) {
        const updated = await updateReview(editingReview.reviewId, reviewForm);
        setReviews(reviews.map(r => r.reviewId === updated.reviewId ? updated : r));
        toast.success("Review updated successfully!");
      } else {
        const newReview = await createReview(listing.listingId, {
          userId: user.userId,
          ...reviewForm,
        });
        setReviews([newReview, ...reviews]);
        toast.success("Review posted successfully!");
      }
      setIsReviewDialogOpen(false);
      setReviewForm({ rating: 5, comment: "" });
      setEditingReview(null);
    } catch (error) {
      const { message } = handleReviewError(error);
      toast.error(message);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setReviewForm({
      rating: review.rating,
      comment: review.comment,
    });
    setIsReviewDialogOpen(true);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter(r => r.reviewId !== reviewId));
      toast.success("Review deleted successfully!");
    } catch (error) {
      const { message } = handleReviewError(error);
      toast.error(message);
    }
  };

  const handleSaveToggle = async () => {
    if (!user?.userId || !listing) {
      toast.error("Please log in to save listings");
      return;
    }

    try {
      if (isSaved && savedListing) {
        await deleteSavedListing(savedListing.savedId);
        setIsSaved(false);
        setSavedListing(null);
        toast.success("Listing removed from saved items");
      } else {
        const saved = await saveListing(user.userId, listing.listingId);
        setIsSaved(true);
        setSavedListing(saved);
        toast.success("Listing saved successfully");
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast.error("Failed to update saved status");
    }
  };

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setIsLinkCopied(true);
      toast.success("Link copied to clipboard!");

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsLinkCopied(false);
      }, 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

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

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  const userReview = user
    ? reviews.find(r => r.user.userId === user.userId)
    : null;

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
                    onClick={handleSaveToggle}
                  >
                    <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    className="relative"
                  >
                    {isLinkCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Share2 className="h-4 w-4" />
                    )}
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

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Reviews
                    <span className="text-sm font-normal text-muted-foreground">
                      ({reviews.length})
                    </span>
                  </CardTitle>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">
                        {averageRating.toFixed(1)} average rating
                      </span>
                    </div>
                  )}
                </div>
                {user && !userReview && (
                  <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>Write a Review</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingReview ? "Edit Review" : "Write a Review"}</DialogTitle>
                        <DialogDescription>
                          Share your experience with this listing
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`h-6 w-6 ${star <= reviewForm.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                    }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Comment</label>
                          <Textarea
                            value={reviewForm.comment}
                            onChange={(e) =>
                              setReviewForm({ ...reviewForm, comment: e.target.value })
                            }
                            placeholder="Write your review here..."
                            rows={4}
                          />
                        </div>
                        <Button
                          className="w-full"
                          onClick={handleReviewSubmit}
                          disabled={!reviewForm.comment.trim()}
                        >
                          {editingReview ? "Update Review" : "Post Review"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No reviews yet. Be the first to review this listing!
                </p>
              ) : (
                reviews.map((review) => (
                  <div key={review.reviewId} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.user.profilePicture} />
                          <AvatarFallback>
                            {review.user.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{review.user.username}</p>
                        </div>
                      </div>
                      {user?.userId === review.user.userId && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditReview(review)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteReview(review.reviewId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm">{review.comment}</p>
                  </div>
                ))
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
              <Button
                className="w-full"
                variant="outline"
                onClick={() => router.push(`/messages/${listing.user.userId}`)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
            </CardContent>
          </Card>

          {/* Availability Calendar */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="p-2">
                <Calendar
                  mode="single"
                  selected={new Date(listing.availTimeStart)}
                  className="rounded-md border p-3"
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex w-full justify-between",
                    head_cell: "w-9 font-normal text-[0.8rem] text-muted-foreground",
                    row: "flex w-full mt-2 justify-between",
                    cell: "text-center text-sm relative p-0 hover:bg-accent hover:text-accent-foreground rounded-md",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_hidden: "invisible"
                  }}
                />
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingReview ? "Edit Review" : "Write a Review"}</DialogTitle>
            <DialogDescription>
              Share your experience with this listing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${star <= reviewForm.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Comment</label>
              <Textarea
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
                placeholder="Write your review here..."
                rows={4}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleReviewSubmit}
              disabled={!reviewForm.comment.trim()}
            >
              {editingReview ? "Update Review" : "Post Review"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 