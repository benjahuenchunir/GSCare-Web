export interface Review {
  id: number;
  rating: number;
  review: string;
  Usuario: {
    id: number;
    nombre: string;
  };
}
