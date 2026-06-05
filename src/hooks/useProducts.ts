import { useState, useEffect, useCallback, useMemo } from 'react';
import { productAPI } from '@/lib/api';
import { sortProducts, filterProducts, defaultFilters, type Filters, type SortOption, type Product } from '@/data/products';

export const useProducts = (categoryFilter?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    ...defaultFilters,
    category: categoryFilter && categoryFilter !== "all" ? (categoryFilter as any) : null,
  });
  const [sort, setSort] = useState<SortOption>('relevant');

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        
        if (filters.category) params.append('category', filters.category);
        if (filters.style) params.append('style', filters.style);
        if (filters.metal) params.append('metal', filters.metal);
        if (filters.shape) params.append('shape', filters.shape);
        if (filters.cut) params.append('cut', filters.cut);
        if (filters.clarity) params.append('clarity', filters.clarity);
        if (filters.color) params.append('color', filters.color);
        if (filters.diamondType) params.append('diamondType', filters.diamondType);
        if (filters.priceRange[0] > 0) params.append('minPrice', filters.priceRange[0].toString());
        if (filters.priceRange[1] < 500000) params.append('maxPrice', filters.priceRange[1].toString());
        if (filters.caratRange[0] > 0.5) params.append('minCarat', filters.caratRange[0].toString());
        if (filters.caratRange[1] < 5.0) params.append('maxCarat', filters.caratRange[1].toString());
        if (filters.search) params.append('search', filters.search);
        if (sort && sort !== 'relevant') params.append('sort', sort);

        const queryString = params.toString();
        try {
          const response = await productAPI.getAll(queryString ? `?${queryString}` : '');
          
          if (response.success && response.products) {
            setProducts(response.products);
          } else {
            setProducts([]);
          }
        } catch (apiError) {
          console.error('API fetch failed:', apiError);
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters.category, filters.style, filters.metal, filters.shape, filters.cut, filters.clarity, filters.color, filters.diamondType, filters.priceRange, filters.caratRange, filters.search, sort, refreshTrigger]);

  // Apply filtering and sorting
  const filtered = useMemo(() => {
    const filtered = filterProducts(products, filters);
    return sortProducts(filtered, sort);
  }, [products, filters, sort]);

  const updateFilters = useCallback((newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ ...defaultFilters, category: filters.category });
  }, [filters.category]);

  return {
    products: filtered,
    loading,
    error,
    filters,
    setFilters: updateFilters,
    clearFilters,
    sort,
    setSort,
    allProductsCount: products.length,
    refresh
  };
};
