import { Hotel, HotelFilters, HotelListResponse } from '../types/hotel.types';

// Datos de ejemplo (mock data) - En producción, esto vendría de una API real
const MOCK_HOTELS: Hotel[] = [
  {
    id: '1',
    name: 'Hotel Gran Paraíso',
    description: 'Lujoso hotel con vista al mar, piscina infinita y spa de clase mundial.',
    location: 'Cancún, México',
    pricePerNight: 2500,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    amenities: ['WiFi', 'Piscina', 'Spa', 'Restaurante', 'Gym'],
    availableRooms: 15,
  },
  {
    id: '2',
    name: 'Hotel Plaza Centro',
    description: 'Hotel céntrico perfecto para negocios y turismo, cerca de las principales atracciones.',
    location: 'Ciudad de México, México',
    pricePerNight: 1200,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
    amenities: ['WiFi', 'Desayuno incluido', 'Estacionamiento', 'Centro de negocios'],
    availableRooms: 8,
  },
  {
    id: '3',
    name: 'Resort Playa Azul',
    description: 'Resort todo incluido con acceso directo a la playa y actividades acuáticas.',
    location: 'Puerto Vallarta, México',
    pricePerNight: 3200,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
    amenities: ['WiFi', 'Todo incluido', 'Playa privada', 'Deportes acuáticos', 'Kids Club'],
    availableRooms: 22,
  },
  {
    id: '4',
    name: 'Hotel Colonial',
    description: 'Encantador hotel boutique en el corazón del centro histórico.',
    location: 'Guanajuato, México',
    pricePerNight: 900,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
    amenities: ['WiFi', 'Terraza', 'Bar', 'Desayuno'],
    availableRooms: 5,
  },
  {
    id: '5',
    name: 'Hotel Montaña Verde',
    description: 'Refugio ecológico rodeado de naturaleza, ideal para desconectarse.',
    location: 'San Cristóbal de las Casas, México',
    pricePerNight: 1500,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c',
    amenities: ['WiFi', 'Senderismo', 'Restaurante orgánico', 'Fogatas'],
    availableRooms: 10,
  },
  {
    id: '6',
    name: 'Hotel Business Tower',
    description: 'Hotel moderno diseñado para ejecutivos con todas las comodidades.',
    location: 'Monterrey, México',
    pricePerNight: 1800,
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
    amenities: ['WiFi', 'Gym', 'Salas de reuniones', 'Concierge'],
    availableRooms: 12,
  },
];

/**
 * Obtiene una lista de hoteles de forma asíncrona
 * @param filters - Filtros opcionales para la búsqueda de hoteles
 * @returns Promise con la lista de hoteles y metadata de paginación
 */
export const GetHotelListAsync = async (
  filters?: HotelFilters
): Promise<HotelListResponse> => {
  // Simular llamada a API con delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    let filteredHotels = [...MOCK_HOTELS];

    // Aplicar filtros si existen
    if (filters) {
      if (filters.location) {
        filteredHotels = filteredHotels.filter(hotel =>
          hotel.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      if (filters.minPrice !== undefined) {
        filteredHotels = filteredHotels.filter(
          hotel => hotel.pricePerNight >= filters.minPrice!
        );
      }

      if (filters.maxPrice !== undefined) {
        filteredHotels = filteredHotels.filter(
          hotel => hotel.pricePerNight <= filters.maxPrice!
        );
      }

      if (filters.minRating !== undefined) {
        filteredHotels = filteredHotels.filter(
          hotel => hotel.rating >= filters.minRating!
        );
      }

      if (filters.guests !== undefined && filters.guests > 0) {
        filteredHotels = filteredHotels.filter(
          hotel => hotel.availableRooms >= Math.ceil(filters.guests! / 2)
        );
      }
    }

    // Simular respuesta de API
    const response: HotelListResponse = {
      hotels: filteredHotels,
      total: filteredHotels.length,
      page: 1,
      pageSize: filteredHotels.length,
    };

    return response;
  } catch (error) {
    console.error('Error en GetHotelListAsync:', error);
    throw new Error('No se pudieron obtener los hoteles. Por favor, intenta de nuevo.');
  }
};

/**
 * Obtiene los detalles de un hotel específico
 * @param hotelId - ID del hotel a buscar
 * @returns Promise con los datos del hotel o null si no se encuentra
 */
export const GetHotelByIdAsync = async (hotelId: string): Promise<Hotel | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const hotel = MOCK_HOTELS.find(h => h.id === hotelId);
    return hotel || null;
  } catch (error) {
    console.error('Error en GetHotelByIdAsync:', error);
    throw new Error('No se pudo obtener el hotel. Por favor, intenta de nuevo.');
  }
};
