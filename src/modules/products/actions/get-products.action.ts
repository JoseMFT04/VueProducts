import { tesloApi } from '@/api/tesloApi';
import type { Product } from '../interfaces/product.interfaces';
import { getProductsImageAction } from './get-product-image.action';

export const getProductsAction = async (page: number = 1, limit = 12) => {
  try {
    const { data } = await tesloApi.get<Product[]>(
      `/products?limit=${limit}&offset=${(page - 1) * limit}`,
    );

    return data.map((product) => ({
      ...product,
      images: product.images.map(getProductsImageAction),
    }));
  } catch (error) {
    console.log(error);
    throw new Error('Error getting errors');
  }
};
