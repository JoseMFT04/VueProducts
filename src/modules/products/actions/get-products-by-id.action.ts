import { tesloApi } from '@/api/tesloApi';
import type { Product } from '../interfaces/product.interfaces';
import { getProductsImageAction } from './get-product-image.action';

export const getProductById = async (productId: string): Promise<Product> => {
  if (productId === 'create') {
    return {
      id: '',
      title: '',
      slug: '',
      description: '',
      price: 0,
      stock: 0,
      images: [],
      tags: [],
      sizes: [],
      gender: '' as any,
      user: {} as any,
    };
  }
  try {
    const { data } = await tesloApi.get<Product>(`/products/${productId}`);

    return {
      ...data,
      images: data.images.map(getProductsImageAction),
    };
  } catch (error) {
    throw new Error(`Error getting product by id ${productId}`);
  }
};
