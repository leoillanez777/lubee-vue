export interface Location {
  lat: number | null;
  lng: number | null;
}

export interface Address {
  geometry: { location: Location };
  formatted_address: string;
}