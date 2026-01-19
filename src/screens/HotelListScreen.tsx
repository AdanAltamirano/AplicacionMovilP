import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Hotel, HotelFilters } from '../types/hotel.types';
import { GetHotelListAsync } from '../services/hotelService';
import { HotelCard } from '../components/HotelCard';

export const HotelListScreen: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [filters, setFilters] = useState<HotelFilters>({});

  // Cargar hoteles al montar el componente
  useEffect(() => {
    loadHotels();
  }, []);

  /**
   * Carga la lista de hoteles usando GetHotelListAsync
   */
  const loadHotels = async (customFilters?: HotelFilters) => {
    setLoading(true);
    try {
      const response = await GetHotelListAsync(customFilters || filters);
      setHotels(response.hotels);
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudieron cargar los hoteles. Por favor, intenta de nuevo.',
        [{ text: 'OK' }]
      );
      console.error('Error al cargar hoteles:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el pull-to-refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await GetHotelListAsync(filters);
      setHotels(response.hotels);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la lista');
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Maneja la búsqueda por ubicación
   */
  const handleSearch = () => {
    const newFilters: HotelFilters = {
      ...filters,
      location: searchLocation.trim() || undefined,
    };
    setFilters(newFilters);
    loadHotels(newFilters);
  };

  /**
   * Limpia los filtros
   */
  const handleClearFilters = () => {
    setSearchLocation('');
    setFilters({});
    loadHotels({});
  };

  /**
   * Maneja el clic en una tarjeta de hotel
   */
  const handleHotelPress = (hotel: Hotel) => {
    Alert.alert(
      hotel.name,
      `${hotel.description}\n\nPrecio: $${hotel.pricePerNight.toLocaleString('es-MX')} / noche\n\nHabitaciones disponibles: ${hotel.availableRooms}`,
      [{ text: 'Cerrar' }]
    );
  };

  /**
   * Renderiza el header con búsqueda
   */
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Encuentra tu hotel ideal</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por ubicación..."
          value={searchLocation}
          onChangeText={setSearchLocation}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍 Buscar</Text>
        </TouchableOpacity>
      </View>
      {(searchLocation || Object.keys(filters).length > 0) && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
          <Text style={styles.clearButtonText}>Limpiar filtros</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.resultsCount}>
        {hotels.length} {hotels.length === 1 ? 'hotel encontrado' : 'hoteles encontrados'}
      </Text>
    </View>
  );

  /**
   * Renderiza el estado de carga
   */
  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Cargando hoteles...</Text>
      </View>
    );
  }

  /**
   * Renderiza el estado vacío
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No se encontraron hoteles</Text>
      <Text style={styles.emptySubtext}>
        Intenta cambiar los filtros de búsqueda
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={hotels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HotelCard hotel={item} onPress={handleHotelPress} />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          hotels.length === 0 ? styles.emptyListContainer : styles.listContainer
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1976d2']}
            tintColor="#1976d2"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchButton: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  clearButtonText: {
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
