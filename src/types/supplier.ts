export interface Supplier {
  id: string;
  name: string;
  contactName?: string | null;
  phone?: string | null;
  email?: string | null;
  provinceCode?: number | null;
  provinceName?: string | null;
  wardCode?: number | null;
  wardName?: string | null;
  addressDetail?: string | null;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierInput {
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  provinceCode?: number;
  wardCode?: number;
  addressDetail?: string;
  note?: string;
}

export type UpdateSupplierInput = Partial<CreateSupplierInput>;

export interface QuerySuppliersParams {
  search?: string;
  page?: number;
  limit?: number;
}
