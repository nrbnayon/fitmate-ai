import { apiSlice } from "../features/apiSlice";
import type {
  ProductCategoriesResponse,
  ProductListResponse,
  ProductMutationPayload,
  SingleProductResponse,
} from "@/types/products";
import type { ApiResponse } from "@/types/auth.types";

export interface GetProductsParams {
  category?: string;
  page?: number;
  page_size?: number;
}

interface UpdateProductArgs {
  id: number;
  payload: ProductMutationPayload;
}

const buildProductFormData = (payload: ProductMutationPayload) => {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("brand", payload.brand);
  formData.append("shade", payload.shade);
  formData.append("category", payload.category);
  formData.append("colour_hex", payload.colour_hex);
  formData.append("price", payload.price);
  formData.append("description", payload.description);

  if (payload.image instanceof File) {
    formData.append("image", payload.image);
  }

  return formData;
};

export const productApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResponse, GetProductsParams>({
      query: ({ category, page = 1, page_size = 10 }) => ({
        url: "/products/create/",
        method: "GET",
        params: {
          category: category || undefined,
          page,
          page_size,
        },
      }),
      providesTags: (result) =>
        result?.data?.products
          ? [
              ...result.data.products.map((product) => ({
                type: "Product" as const,
                id: product.id,
              })),
              { type: "Product" as const, id: "LIST" },
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),

    getProductCategories: builder.query<ProductCategoriesResponse, void>({
      query: () => ({
        url: "/products/categories/",
        method: "GET",
      }),
      providesTags: [{ type: "ProductCategory", id: "LIST" }],
    }),

    getProductById: builder.query<SingleProductResponse, number>({
      query: (id) => ({
        url: `/products/products/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation<SingleProductResponse, ProductMutationPayload>({
      query: (payload) => ({
        url: "/products/create/",
        method: "POST",
        body: buildProductFormData(payload),
      }),
      invalidatesTags: [
        { type: "Product", id: "LIST" },
        { type: "ProductCategory", id: "LIST" },
      ],
    }),

    updateProduct: builder.mutation<SingleProductResponse, UpdateProductArgs>({
      query: ({ id, payload }) => ({
        url: `/products/products/${id}/`,
        method: "PUT",
        body: buildProductFormData(payload),
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
        { type: "ProductCategory", id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/products/products/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductCategoriesQuery,
  useGetProductByIdQuery,
  useLazyGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
