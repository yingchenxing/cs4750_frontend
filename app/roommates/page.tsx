'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Filter, MessageSquare, Loader2 } from 'lucide-react'
import {
  getAllProfiles,
  handlePreferencesError,
  type UserPreferencesWithProfile,
} from '../services/preferences'
import { toast } from 'sonner'

export default function RoommatesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [profiles, setProfiles] = useState<UserPreferencesWithProfile[]>([])
  const [filters, setFilters] = useState({
    gender: 'all',
    cleanlinessLevel: 'all',
    pets: false,
    smokingHabits: false,
  })

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setIsLoading(true)
        const data = await getAllProfiles()
        setProfiles(data)
      } catch (error) {
        const { message } = handlePreferencesError(error)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfiles()
  }, [])

  // Filter roommates based on search query and filters
  const filteredRoommates = profiles.filter((profile) => {
    const matchesSearch = profile.user.username
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    const matchesGender =
      filters.gender === 'all' ||
      profile.gender.toLowerCase() === filters.gender.toLowerCase()

    const matchesCleanliness =
      filters.cleanlinessLevel === 'all' ||
      profile.cleanlinessLevel === filters.cleanlinessLevel

    const matchesPets = !filters.pets || profile.pets === filters.pets

    const matchesSmoking =
      !filters.smokingHabits || profile.smokingHabits === filters.smokingHabits

    return (
      matchesSearch &&
      matchesGender &&
      matchesCleanliness &&
      matchesPets &&
      matchesSmoking
    )
  })

  const handleStartChat = (userId: number) => {
    router.push(`/messages/${userId}`)
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading profiles...</p>
        </div>
      </div>
    )
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
              <CardDescription>Filter roommate profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by username..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={filters.gender}
                  onValueChange={(value) =>
                    setFilters({ ...filters, gender: value })
                  }>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cleanliness">Cleanliness Level</Label>
                <Select
                  value={filters.cleanlinessLevel}
                  onValueChange={(value) =>
                    setFilters({ ...filters, cleanlinessLevel: value })
                  }>
                  <SelectTrigger id="cleanliness">
                    <SelectValue placeholder="Select cleanliness level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Very Clean">Very Clean</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Relaxed">Relaxed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pets"
                    checked={filters.pets}
                    onCheckedChange={(checked) =>
                      setFilters({ ...filters, pets: checked as boolean })
                    }
                  />
                  <Label htmlFor="pets">Has Pets</Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smoking"
                    checked={filters.smokingHabits}
                    onCheckedChange={(checked) =>
                      setFilters({
                        ...filters,
                        smokingHabits: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="smoking">Smoker</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  setFilters({
                    gender: 'all',
                    cleanlinessLevel: 'all',
                    pets: false,
                    smokingHabits: false,
                  })
                }>
                Reset Filters
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Roommate Listings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Roommate Profiles</h1>
            <p className="text-sm text-muted-foreground">
              {filteredRoommates.length} profiles found
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredRoommates.map((profile) => (
              <Card key={profile.userId}>
                <CardHeader className="flex flex-row items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={profile.user.profilePicture}
                      alt={profile.user.username}
                    />
                    <AvatarFallback>
                      {profile.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{profile.user.username}</CardTitle>
                    <CardDescription>
                      {profile.age} years old • {profile.gender}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{profile.bio}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Cleanliness:</span>{' '}
                      {profile.cleanlinessLevel}
                    </div>
                    <div>
                      <span className="font-medium">Pets:</span>{' '}
                      {profile.pets ? 'Yes' : 'No'}
                    </div>
                    <div>
                      <span className="font-medium">Smoking:</span>{' '}
                      {profile.smokingHabits ? 'Yes' : 'No'}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleStartChat(profile.userId)}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message {profile.user.username}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredRoommates.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Search className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">
                No roommate profiles found
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filters to find more profiles.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
