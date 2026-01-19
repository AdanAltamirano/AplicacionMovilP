# Uso de GetHotelListAsync

Este documento explica cómo se utiliza la función `GetHotelListAsync` en la aplicación.

## ¿Qué es GetHotelListAsync?

`GetHotelListAsync` es una función asíncrona que obtiene una lista de hoteles desde el servicio (actualmente usando datos mock). Se encuentra en `src/services/hotelService.ts`.

## Firma de la función

```typescript
export const GetHotelListAsync = async (
  filters?: HotelFilters
): Promise<HotelListResponse>
```

### Parámetros

- `filters` (opcional): Objeto con filtros para la búsqueda
  - `location?: string` - Ubicación del hotel
  - `checkIn?: string` - Fecha de entrada (formato: YYYY-MM-DD)
  - `checkOut?: string` - Fecha de salida (formato: YYYY-MM-DD)
  - `guests?: number` - Número de huéspedes
  - `minPrice?: number` - Precio mínimo por noche
  - `maxPrice?: number` - Precio máximo por noche
  - `minRating?: number` - Calificación mínima

### Retorno

Retorna una `Promise` con un objeto `HotelListResponse`:
```typescript
{
  hotels: Hotel[];      // Array de hoteles
  total: number;        // Total de hoteles encontrados
  page: number;         // Página actual
  pageSize: number;     // Tamaño de la página
}
```

## ¿Dónde se utiliza?

### 1. En HotelListScreen.tsx (líneas 26-35)

Se utiliza en el efecto inicial para cargar los hoteles al montar el componente:

```typescript
useEffect(() => {
  loadHotels();
}, []);
```

### 2. En la función loadHotels (líneas 40-54)

Carga los hoteles con o sin filtros:

```typescript
const loadHotels = async (customFilters?: HotelFilters) => {
  setLoading(true);
  try {
    const response = await GetHotelListAsync(customFilters || filters);
    setHotels(response.hotels);
  } catch (error) {
    Alert.alert('Error', 'No se pudieron cargar los hoteles.');
  } finally {
    setLoading(false);
  }
};
```

### 3. En onRefresh (líneas 59-70)

Se utiliza cuando el usuario hace "pull to refresh":

```typescript
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
```

### 4. En handleSearch (líneas 75-82)

Se utiliza cuando el usuario busca hoteles por ubicación:

```typescript
const handleSearch = () => {
  const newFilters: HotelFilters = {
    ...filters,
    location: searchLocation.trim() || undefined,
  };
  setFilters(newFilters);
  loadHotels(newFilters);
};
```

## Ejemplos de uso

### Ejemplo 1: Obtener todos los hoteles

```typescript
import { GetHotelListAsync } from './services/hotelService';

const getAllHotels = async () => {
  const response = await GetHotelListAsync();
  console.log(`Se encontraron ${response.total} hoteles`);
  console.log(response.hotels);
};
```

### Ejemplo 2: Buscar hoteles por ubicación

```typescript
const searchByLocation = async () => {
  const response = await GetHotelListAsync({
    location: 'Cancún'
  });
  console.log(`Hoteles en Cancún: ${response.total}`);
};
```

### Ejemplo 3: Buscar con múltiples filtros

```typescript
const searchWithFilters = async () => {
  const response = await GetHotelListAsync({
    location: 'Ciudad de México',
    minPrice: 1000,
    maxPrice: 2000,
    minRating: 4.5,
    guests: 2
  });
  console.log(`Encontrados ${response.total} hoteles`);
};
```

### Ejemplo 4: Manejo de errores

```typescript
const searchWithErrorHandling = async () => {
  try {
    const response = await GetHotelListAsync({
      location: 'Guadalajara'
    });
    return response.hotels;
  } catch (error) {
    console.error('Error al buscar hoteles:', error);
    // Mostrar mensaje al usuario
    Alert.alert('Error', 'No se pudieron cargar los hoteles');
    return [];
  }
};
```

## Flujo de trabajo típico

1. **Carga inicial**: Al abrir la app, se llama a `GetHotelListAsync()` sin filtros
2. **Búsqueda**: Usuario ingresa ubicación → se llama con filtro de `location`
3. **Actualización**: Usuario hace pull-to-refresh → se vuelve a llamar con los filtros actuales
4. **Filtrado**: Usuario aplica filtros → se llama con los nuevos filtros

## Notas importantes

- La función simula un delay de 1 segundo para imitar una llamada real a API
- Actualmente usa datos mock (MOCK_HOTELS) definidos en el mismo archivo
- En producción, esto se conectaría a una API REST real
- Los filtros se aplican localmente en el array de datos mock
- La función siempre retorna un objeto con la estructura `HotelListResponse`

## Próximos pasos (para producción)

Para conectar con una API real, modificar en `hotelService.ts`:

```typescript
export const GetHotelListAsync = async (
  filters?: HotelFilters
): Promise<HotelListResponse> => {
  try {
    const response = await fetch('https://api.tudominio.com/hotels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN'
      },
      body: JSON.stringify(filters)
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en GetHotelListAsync:', error);
    throw error;
  }
};
```
