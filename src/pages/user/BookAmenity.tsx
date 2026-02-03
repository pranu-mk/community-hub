import { useState } from "react";
import { BackButton } from "@/components/layout/user/BackButton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";
import {
  CalendarIcon,
  Building,
  Dumbbell,
  Home,
  PartyPopper,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const amenities = [
  { id: "community-hall", name: "Community Hall", icon: Building },
  { id: "club-house", name: "Club House", icon: PartyPopper },
  { id: "gym", name: "Gym", icon: Dumbbell },
  { id: "guest-room", name: "Guest Room", icon: Home },
];

const timeSlots = [
  { id: "morning", label: "Morning", time: "6:00 AM - 12:00 PM" },
  { id: "evening", label: "Evening", time: "4:00 PM - 10:00 PM" },
  { id: "full-day", label: "Full Day", time: "6:00 AM - 10:00 PM" },
];

// Mock booked dates (in real app, this would come from backend)
const initialBookedDates: {
  date: Date;
  amenityId: string;
  slot: string;
}[] = [
  { date: new Date(2026, 1, 5), amenityId: "community-hall", slot: "morning" },
  { date: new Date(2026, 1, 5), amenityId: "community-hall", slot: "evening" },
  { date: new Date(2026, 1, 10), amenityId: "gym", slot: "full-day" },
  { date: new Date(2026, 1, 15), amenityId: "club-house", slot: "evening" },
];

interface Booking {
  id: string;
  amenityId: string;
  amenityName: string;
  date: Date;
  slot: string;
  slotTime: string;
  status: string;
}

const BookAmenity = () => {
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedDates, setBookedDates] = useState(initialBookedDates);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const { toast } = useToast();

  const isSlotBooked = (date: Date | undefined, slot: string) => {
    if (!date || !selectedAmenity) return false;
    return bookedDates.some(
      (b) =>
        isSameDay(b.date, date) &&
        b.amenityId === selectedAmenity &&
        (b.slot === slot || b.slot === "full-day" || slot === "full-day")
    );
  };

  const isDateFullyBooked = (date: Date) => {
    if (!selectedAmenity) return false;
    const bookingsForDate = bookedDates.filter(
      (b) => isSameDay(b.date, date) && b.amenityId === selectedAmenity
    );
    return (
      bookingsForDate.some((b) => b.slot === "full-day") ||
      (bookingsForDate.some((b) => b.slot === "morning") &&
        bookingsForDate.some((b) => b.slot === "evening"))
    );
  };

  const handleBooking = () => {
    if (!selectedAmenity || !selectedDate || !selectedSlot) {
      toast({
        title: "Incomplete Selection",
        description: "Please select amenity, date, and time slot.",
        variant: "destructive",
      });
      return;
    }

    const amenity = amenities.find((a) => a.id === selectedAmenity);
    const slot = timeSlots.find((s) => s.id === selectedSlot);

    if (!amenity || !slot) return;

    // Add to booked dates
    setBookedDates((prev) => [
      ...prev,
      { date: selectedDate, amenityId: selectedAmenity, slot: selectedSlot },
    ]);

    // Add to my bookings
    const newBooking: Booking = {
      id: Date.now().toString(),
      amenityId: selectedAmenity,
      amenityName: amenity.name,
      date: selectedDate,
      slot: slot.label,
      slotTime: slot.time,
      status: "Booked",
    };
    setMyBookings((prev) => [newBooking, ...prev]);

    toast({
      title: "Booking Confirmed!",
      description: `${amenity.name} booked for ${format(selectedDate, "PPP")} (${slot.label})`,
    });

    // Reset selection
    setSelectedSlot("");
    setSelectedDate(undefined);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton />
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Book Amenity
        </h1>
        <p className="text-muted-foreground">
          Reserve society amenities for your personal use.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Select Amenity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
            <label className="form-label">Select Amenity</label>
            <div className="grid grid-cols-2 gap-3">
              {amenities.map((amenity) => (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => {
                    setSelectedAmenity(amenity.id);
                    setSelectedDate(undefined);
                    setSelectedSlot("");
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedAmenity === amenity.id
                      ? "border-primary bg-primary/5 dark:bg-primary/10"
                      : "border-border dark:border-gray-700 hover:border-primary/30"
                  }`}
                >
                  <amenity.icon
                    className={`w-6 h-6 mb-2 mx-auto ${
                      selectedAmenity === amenity.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium block text-center ${
                      selectedAmenity === amenity.id
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {amenity.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Select Date */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
            <label className="form-label">Select Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12",
                    !selectedDate && "text-muted-foreground"
                  )}
                  disabled={!selectedAmenity}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedSlot("");
                  }}
                  disabled={(date) =>
                    date < new Date() || isDateFullyBooked(date)
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {selectedAmenity && (
              <p className="text-xs text-muted-foreground mt-2">
                Dates that are fully booked are disabled
              </p>
            )}
          </div>

          {/* Select Time Slot */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
            <label className="form-label">Select Time Slot</label>
            <div className="space-y-3">
              {timeSlots.map((slot) => {
                const booked = isSlotBooked(selectedDate, slot.id);
                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!selectedDate || booked}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      booked
                        ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 cursor-not-allowed opacity-60"
                        : selectedSlot === slot.id
                          ? "border-primary bg-primary/5 dark:bg-primary/10"
                          : "border-border dark:border-gray-700 hover:border-primary/30 disabled:opacity-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-foreground">
                          {slot.label}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {slot.time}
                        </p>
                      </div>
                      {booked ? (
                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                          Already Booked
                        </span>
                      ) : selectedSlot === slot.id ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Booking Summary & Actions */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
            <h3 className="font-display font-semibold text-lg text-foreground mb-4">
              Booking Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border dark:border-gray-700">
                <span className="text-muted-foreground">Amenity</span>
                <span className="font-medium text-foreground">
                  {amenities.find((a) => a.id === selectedAmenity)?.name || "-"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border dark:border-gray-700">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">
                  {selectedDate ? format(selectedDate, "PPP") : "-"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Time Slot</span>
                <span className="font-medium text-foreground">
                  {timeSlots.find((s) => s.id === selectedSlot)?.label || "-"}
                </span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedAmenity || !selectedDate || !selectedSlot}
              className="btn-primary w-full mt-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Booking
            </button>
          </div>

          {/* My Bookings */}
          {myBookings.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
              <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                My Bookings
              </h3>
              <div className="space-y-3">
                {myBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-3 rounded-xl bg-muted/50 dark:bg-gray-700/50"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-foreground text-sm">
                        {booking.amenityName}
                      </span>
                      <span className="status-resolved text-xs">
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(booking.date, "PPP")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.slot} ({booking.slotTime})
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAmenity;
