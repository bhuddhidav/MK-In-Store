export type Language = 'en' | 'th';

export type Category = 'Soup' | 'Meat' | 'Vegetable' | 'Appetizer' | 'Seasonal' | 'Rice/Noodle' | 'Dessert' | 'All';
export type MenuType = 'Included' | 'Add-on';

export interface MenuItem {
  id: string;
  name: string;
  nameTh: string;
  price: number | string;
  category: Category;
  type: MenuType;
  image: string;
  allergens: string[];
  isVegetarian: boolean;
  description: string;
  descriptionTh: string;
  isNew?: boolean;
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
