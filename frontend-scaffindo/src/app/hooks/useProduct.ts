'use client'

import { useCallback, useEffect, useState } from "react";
import { Certificate, Product } from "../type/types";
import axios from "axios";

export function useProduct() {
    const [products, setProducts] = useState<Product[]>([]);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                setProducts([]);
                return;
            }

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=100`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let productData: Product[] = [];
            
            if (Array.isArray(res.data)) {
                console.log("res.data berhasil")
                productData = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
                console.log("res.data.data berhasil")
                productData = res.data.data;
            } else if (Array.isArray(res.data?.certificates)) {
                console.log("res.data.certificates berhasil")
                productData = res.data.certificates;
            }

            setProducts(productData);
            localStorage.setItem("certificate", JSON.stringify(productData));
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch products");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchProductById = useCallback(async (id: string) => {
        try { 
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("access_token");
            
            if (!token) {
                setError("No authentication token found");
                return;
            }

            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setProduct(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch product by ID");
            setProduct(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProduct = useCallback(
  async (id: string, updateData: Partial<Product> | FormData) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("No authentication token found");
        return;
      }

      const headers: any = {
        Authorization: `Bearer ${token}`,
      };

      // ❌ jangan set Content-Type manual kalau FormData
      if (!(updateData instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        updateData,
        { headers }
      );

      setProduct(res.data);
      setProducts((prev) =>
        prev.map((u) => (u.id === id ? res.data : u))
      );

      return res.data;
    } catch (err: any) {
      console.error("Update product failed:", err.response || err);
      setError(err.response?.data?.message || "Failed to update product");
      throw err;
    } finally {
      setLoading(false);
    }
  },
  []
);

    
    const createProduct = useCallback(async (createProductDTO: any) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                return;
            }

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, createProductDTO,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return res.data;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create product");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteProduct = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            
            if (!token) {
                setError("No authentication token found");
                return;
            }

            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Delete response:", res.data);
            setProducts((prev) => prev.filter((u) => u.id !== id));

            return res.data;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete product");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        products,
        product,
        loading,
        error,
        fetchProducts,
        fetchProductById,
        updateProduct,
        createProduct,
        deleteProduct
    };
}