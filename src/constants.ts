import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'b1',
    name: 'A5 Wagyu Ribeye',
    price: 850,
    category: 'Beef',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=60',
    allergens: [],
    isVegetarian: false,
    description: 'Premium Japanese A5 Wagyu with intense marbling.'
  },
  {
    id: 'b2',
    name: 'Angus Striploin',
    price: 450,
    category: 'Beef',
    image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=800&auto=format&fit=crop&q=60',
    allergens: [],
    isVegetarian: false,
    description: 'Grain-fed Black Angus beef, tender and flavorful.'
  },
  {
    id: 'p1',
    name: 'Kurobuta Pork Belly',
    price: 280,
    category: 'Pork',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop&q=60',
    allergens: [],
    isVegetarian: false,
    description: 'Premium black pork belly slices.'
  },
  {
    id: 's1',
    name: 'Tiger Prawns',
    price: 350,
    category: 'Seafood',
    image: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=800&auto=format&fit=crop&q=60',
    allergens: ['Shrimp'],
    isVegetarian: false,
    description: 'Fresh giant tiger prawns.'
  },
  {
    id: 's2',
    name: 'Hokkaido Scallops',
    price: 520,
    category: 'Seafood',
    image: 'https://images.unsplash.com/photo-1599458252573-56ae36390329?w=800&auto=format&fit=crop&q=60',
    allergens: ['Shellfish'],
    isVegetarian: false,
    description: 'Sweet and succulent scallops from Hokkaido.'
  },
  {
    id: 'v1',
    name: 'Enoki Mushrooms',
    price: 60,
    category: 'Veggies',
    image: 'https://images.unsplash.com/photo-1581264692575-0d2568019579?w=800&auto=format&fit=crop&q=60',
    allergens: [],
    isVegetarian: true,
    description: 'Fresh and crunchy enoki mushrooms.'
  },
  {
    id: 'v2',
    name: 'Assorted Veggie Platter',
    price: 180,
    category: 'Veggies',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=60',
    allergens: [],
    isVegetarian: true,
    description: 'Cabbage, corn, carrots, and morning glory.'
  },
  {
    id: 'a1',
    name: 'Gyoza',
    price: 120,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=60',
    allergens: ['Gluten'],
    isVegetarian: false,
    description: 'Pan-fried Japanese dumplings.'
  }
];

export const STARTER_SET: MenuItem[] = [
  MENU_ITEMS[0], // A5 Wagyu
  MENU_ITEMS[2], // Kurobuta
  MENU_ITEMS[6], // Veggie Platter
];
