// Re-export shared types for convenience
export type {
  ApiResponse,
  UserDTO,
  CategoryDTO,
  ProductDTO,
  ProductImageDTO,
  ProductFileDTO,
  OrderDTO,
  OrderItemDTO,
} from '@bright-ideas/shared';

// Frontend-specific types

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    type: string;
    status: string;
    primaryImage: string | null;
  };
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  addedAt: string;
  product: ProductSummary;
}

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  type: string;
  averageRating: number;
  totalReviews: number;
  totalSales: number;
  isFeatured: boolean;
  images: Array<{ id: string; url: string; isPrimary: boolean }>;
  categories: Array<{ id: string; name: string; slug: string }>;
}

export interface ReviewDTO {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVisible: boolean;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminDashboardData {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalCustomers: number;
  customersChange: number;
  totalProducts: number;
  activeProducts: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    slug: string;
    totalSales: number;
    price: number;
  }>;
}

export interface DownloadableFile {
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  productName: string;
  productSlug: string;
  productImage: string | null;
  orderId: string;
  orderNumber: string;
  purchasedAt: string;
}
