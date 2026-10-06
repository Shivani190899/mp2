export interface Pokemon {
  id: number;
  name: string;
  image: string | null;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  stats: {
    name: string;
    value: number;
  }[];
}