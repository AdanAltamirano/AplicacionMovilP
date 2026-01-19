export interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  rating: number;
  imageUrl: string;
  amenities: string[];
  availableRooms: number;
}

export interface HotelFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

export interface HotelListResponse {
  hotels: Hotel[];
  total: number;
  page: number;
  pageSize: number;
}
