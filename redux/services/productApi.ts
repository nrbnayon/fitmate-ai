import { apiSlice } from "../features/apiSlice";
import type {
  CategoryMutationPayload,
  ProductCategoriesResponse,
  ProductListResponse,
  ProductMutationPayload,
  SingleCategoryResponse,
  SingleProductResponse,
} from "@/types/products";
import type {
  PaymentHistoryResponse,
} from "@/types/paymentHistory";
import type {
  OrderListResponse,
  SingleOrderResponse,
} from "@/types/orderManagement";
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

    getProductCategories: builder.query<ProductCategoriesResponse, { page?: number; page_size?: number }>({
      query: ({ page = 1, page_size = 10 } = {}) => ({
        url: "/products/categories/",
        method: "GET",
        params: { page, page_size },
      }),
      providesTags: (result) =>
        result?.data?.results?.categories
          ? [
              ...result.data.results.categories.map((cat) => ({
                type: "ProductCategory" as const,
                id: cat.id,
              })),
              { type: "ProductCategory" as const, id: "LIST" },
            ]
          : [{ type: "ProductCategory" as const, id: "LIST" }],
    }),

    createCategory: builder.mutation<SingleCategoryResponse, CategoryMutationPayload>({
      query: (payload) => ({
        url: "/products/categories/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "ProductCategory", id: "LIST" }],
    }),

    updateCategory: builder.mutation<SingleCategoryResponse, { id: number; payload: CategoryMutationPayload }>({
      query: ({ id, payload }) => ({
        url: `/products/categories/${id}/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ProductCategory", id },
        { type: "ProductCategory", id: "LIST" },
        { type: "Product" as const, id: "LIST" }, // Categories might affect product lists
      ],
    }),

    deleteCategory: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/products/categories/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ProductCategory", id },
        { type: "ProductCategory", id: "LIST" },
        { type: "Product" as const, id: "LIST" },
      ],
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

    getPaymentHistory: builder.query<PaymentHistoryResponse, { search?: string; page?: number; page_size?: number }>({
      query: ({ search, page = 1, page_size = 10 } = {}) => ({
        url: "/products/payment-history/",
        method: "GET",
        params: { search, page, page_size },
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map((item) => ({
                type: "PaymentHistory" as const,
                id: item.id,
              })),
              { type: "PaymentHistory" as const, id: "LIST" },
            ]
          : [{ type: "PaymentHistory" as const, id: "LIST" }],
    }),

    deletePaymentHistory: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/products/payment-history/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PaymentHistory", id },
        { type: "PaymentHistory", id: "LIST" },
      ],
    }),

    getOrders: builder.query<OrderListResponse, { page?: number; page_size?: number }>({
      query: ({ page = 1, page_size = 10 } = {}) => ({
        url: "/products/orders/",
        method: "GET",
        params: { page, page_size },
      }),
      providesTags: (result) =>
        result?.data?.orders
          ? [
              ...result.data.orders.map((order) => ({
                type: "Order" as const,
                id: order.id,
              })),
              { type: "Order" as const, id: "LIST" },
            ]
          : [{ type: "Order" as const, id: "LIST" }],
    }),

    getOrderById: builder.query<SingleOrderResponse, number>({
      query: (id) => ({
        url: `/products/orders/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),

    deleteOrder: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/products/orders/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
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
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetPaymentHistoryQuery,
  useDeletePaymentHistoryMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useDeleteOrderMutation,
} = productApi;
