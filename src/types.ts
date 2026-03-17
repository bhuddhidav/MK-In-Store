export type Category = 'Beef' | 'Pork' | 'Seafood' | 'Veggies' | 'Appetizers';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  allergens: string[];
  isVegetarian: boolean;
  description: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
  timestamp: number;
}

export type RoomMode = 'Normal' | 'Party' | 'Romantic' | 'Chill';
export type EntertainmentMode = 'None' | 'Karaoke' | 'Gaming';

export interface RoomSettings {
  lighting: RoomMode;
  temperature: number;
  privacy: 'DND' | 'Ready';
  entertainment: EntertainmentMode;
}
