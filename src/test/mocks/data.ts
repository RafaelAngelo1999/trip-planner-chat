// Mock data for flights
export const mockFlight = {
  id: 'flight-1',
  flight_number: 'LA3001',
  airline: 'LATAM',
  origin: 'CNF',
  destination: 'GRU',
  departure_time: '2024-12-15T06:00:00Z',
  arrival_time: '2024-12-15T07:20:00Z',
  price: 800,
  currency: 'BRL',
  duration: '01:20',
  available_seats: 150,
  total_seats: 180,
  aircraft: 'Airbus A320',
  stops: 0,
  baggage_included: true,
  meal_included: false,
  refundable: false,
  booking_class: 'economy',
};

export const mockFlightSearchParams = {
  origin: 'CNF',
  destination: 'GRU',
  departureDate: '2024-12-15',
  page: 1,
  limit: 10,
};

export const mockFlightItinerary = [
  mockFlight,
  {
    ...mockFlight,
    id: 'flight-2',
    flight_number: 'G31234',
    airline: 'Gol',
    departure_time: '2024-12-15T09:30:00Z',
    arrival_time: '2024-12-15T10:50:00Z',
    price: 1200,
    aircraft: 'Boeing 737-800',
    meal_included: true,
    refundable: true,
  },
];

// Mock data for hotels
export const mockHotel = {
  id: 'hotel-1',
  name: 'Hotel Test Plaza',
  location: 'São Paulo',
  rating: 4.5,
  price: 200,
  currency: 'BRL',
  amenities: ['WiFi', 'Pool', 'Breakfast'],
  image: '/mock-hotel.jpg',
};

export const mockHotelSearchParams = {
  location: 'São Paulo',
  checkIn: '2024-12-15',
  checkOut: '2024-12-17',
  guests: 2,
  rooms: 1,
};

// Mock data for user
export const mockUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: '/mock-avatar.jpg',
};

// Mock data for messages
export const mockMessage = {
  id: 'msg-1',
  content: 'Hello, this is a test message',
  role: 'human' as const,
  timestamp: new Date().toISOString(),
};

export const mockAIMessage = {
  id: 'msg-2',
  content: 'This is an AI response',
  role: 'ai' as const,
  timestamp: new Date().toISOString(),
};

// Mock data for thread
export const mockThread = {
  id: 'thread-1',
  title: 'Test Thread',
  messages: [mockMessage, mockAIMessage],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};