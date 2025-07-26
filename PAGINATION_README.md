# Estrategia de Paginación - Fast Tour API

## Descripción

Se ha implementado una estrategia de paginación completa para la API de Fast Tour que permite obtener elementos de forma paginada para viajes, hoteles, lugares y países.

## Estructura de Respuesta

La API devuelve una respuesta paginada con la siguiente estructura:

```typescript
interface PaginatedResponse<T> {
  page: number;           // Página actual
  items: T[];            // Elementos de la página actual
  count: number;         // Número total de páginas
  totalItems: number;    // Número total de elementos
  totalPages: number;    // Número total de páginas
  hasNext: boolean;      // Indica si hay página siguiente
  hasPrevious: boolean;  // Indica si hay página anterior
}
```

## Endpoints Disponibles

### Viajes (Trips)
- **GET** `/trips?page=1&limit=10`
- Parámetros adicionales: `name`, `minPrice`, `maxPrice`, `start`, `end`, `places`

### Hoteles (Hotels)
- **GET** `/hotels?page=1&limit=10`
- Parámetros adicionales: `name`, `placeId`

### Lugares (Places)
- **GET** `/places?page=1&limit=10`
- Parámetros adicionales: `name`, `countryId`

### Países (Countries)
- **GET** `/countries?page=1&limit=10`
- Parámetros adicionales: `name`

### Usuarios (Users)
- **GET** `/users/all?page=1&limit=10`
- Parámetros adicionales: `firstName`, `lastName`, `email`, `roleId`

## Parámetros de Paginación

- `page`: Número de página (mínimo: 1, por defecto: 1)
- `limit`: Elementos por página (mínimo: 1, máximo: 100, por defecto: 10)

## Ejemplo de Uso

### Backend (API)

```typescript
// Obtener viajes paginados
const response = await tripService.findPaginated(1, 10, { name: "París" });

// Respuesta:
{
  page: 1,
  items: [...], // Array de viajes
  count: 5,
  totalItems: 50,
  totalPages: 5,
  hasNext: true,
  hasPrevious: false
}
```

### Frontend

```typescript
// Usar el servicio paginado
const tripsData = await TripService.getTripsPaginated(1, 10);

// Usar el componente de paginación
<Pagination
  data={tripsData}
  onPageChange={(page, pageSize) => {
    // Manejar cambio de página
  }}
  loading={loading}
  showSizeChanger={true}
  showQuickJumper={true}
  showTotal={true}
/>
```

## Implementación Técnica

### Backend

1. **BaseService**: Clase abstracta que implementa la lógica común de paginación
2. **Servicios específicos**: Extienden BaseService y implementan filtros específicos
3. **Rutas actualizadas**: Manejan parámetros de paginación
4. **Esquemas de validación**: Incluyen validación para parámetros de paginación

### Frontend

1. **Modelos**: Interfaz `PaginatedResponse<T>` para tipado
2. **Servicios**: Métodos `getXxxPaginated()` en cada servicio
3. **Componente**: `Pagination` reutilizable con Ant Design
4. **Ejemplos**: `TripsPaginated.tsx` y `UsersPaginated.tsx` muestran implementación completa

## Filtros Disponibles

### Viajes
- `name`: Búsqueda por nombre (LIKE)
- `minPrice` / `maxPrice`: Rango de precios
- `start` / `end`: Rango de fechas
- `places`: IDs de lugares separados por coma

### Hoteles
- `name`: Búsqueda por nombre (LIKE)
- `placeId`: ID del lugar

### Lugares
- `name`: Búsqueda por nombre (LIKE)
- `countryId`: ID del país

### Países
- `name`: Búsqueda por nombre (LIKE)

### Usuarios
- `firstName`: Búsqueda por nombre (LIKE)
- `lastName`: Búsqueda por apellido (LIKE)
- `email`: Búsqueda por email (LIKE)
- `roleId`: Filtro por ID de rol

## Ventajas de la Implementación

1. **Escalabilidad**: Maneja grandes volúmenes de datos eficientemente
2. **Flexibilidad**: Permite filtros combinados con paginación
3. **Reutilización**: Código común en BaseService
4. **Tipado**: TypeScript completo en frontend y backend
5. **UX**: Componente de paginación intuitivo
6. **Validación**: Esquemas Joi para parámetros

## Consideraciones

- El límite máximo por página es 100 para evitar sobrecarga
- Los filtros se aplican antes de la paginación
- La respuesta incluye metadatos útiles para la UI
- Compatible con la implementación existente 