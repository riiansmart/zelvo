/**
 * Fetches task categories so users can tag items within Zelvo.
 */

import api from './api';
import { Category } from '../types/category.types';

// Fetch all available task categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    console.log('Fetching categories (public endpoint)');
    
    const response = await api.get('/categories');
    
    console.log('Categories API response:', response);
    console.log('Categories response.data:', response.data);
    
    // Unwrap ApiResponse to get the actual list of categories
    const categories = response.data.data;
    console.log('Extracted categories:', categories);
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};