export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  avatarUrl?: string | null;
  createdAt: Date | string;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
}

export interface ProductFileDTO {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface ProductImageDTO {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
}

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  type: 'EBOOK' | 'EXCEL_TEMPLATE' | 'BUSINESS_SYSTEM' | 'COURSE' | 'OTHER';
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  totalSales: number;
  images: ProductImageDTO[];
  files?: ProductFileDTO[];
  categories?: CategoryDTO[];
  createdAt: Date | string;
}

export interface OrderItemDTO {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  product?: Partial<ProductDTO>;
}

export interface OrderDTO {
  id: string;
  orderNumber: string;
  userId: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone?: string | null;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: 'PENDING' | 'PAYMENT_INITIATED' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  paymentProvider: 'CHAPA' | 'TELEBIRR' | 'BANK_TRANSFER';
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  items: OrderItemDTO[];
  createdAt: Date | string;
}
