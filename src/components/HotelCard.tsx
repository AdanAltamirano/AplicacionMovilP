import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Hotel } from '../types/hotel.types';

interface HotelCardProps {
  hotel: Hotel;
  onPress?: (hotel: Hotel) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(hotel)}
      activeOpacity={0.7}>
      <Image
        source={{ uri: hotel.imageUrl }}
        style={styles.image}
        defaultSource={require('react-native/Libraries/NewAppScreen/components/logo.png')}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {hotel.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {hotel.rating}</Text>
          </View>
        </View>

        <Text style={styles.location} numberOfLines={1}>
          📍 {hotel.location}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {hotel.description}
        </Text>

        <View style={styles.amenitiesContainer}>
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityTag}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
          {hotel.amenities.length > 3 && (
            <Text style={styles.moreAmenities}>+{hotel.amenities.length - 3}</Text>
          )}
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>Desde</Text>
            <Text style={styles.price}>
              ${hotel.pricePerNight.toLocaleString('es-MX')}
              <Text style={styles.priceUnit}> / noche</Text>
            </Text>
          </View>
          <Text style={styles.availability}>
            {hotel.availableRooms} habitaciones disponibles
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 12,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    alignItems: 'center',
  },
  amenityTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  amenityText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  moreAmenities: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2e7d32',
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
  availability: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});
