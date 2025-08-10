import { Item } from '../types/Item';

const STORAGE_KEY = 'findit_lost_items';

export const loadItems = (): Item[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load items from storage:', error);
    return [];
  }
};

export const saveItems = (items: Item[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save items to storage:', error);
  }
};