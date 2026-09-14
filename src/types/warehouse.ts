export interface Warehouse {
  id: string;
  name: string;
  provinceCode?: number | null;
  provinceName?: string | null;
  wardCode?: number | null;
  wardName?: string | null;
  addressDetail?: string | null;
  isMain: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWarehouseInput {
  name: string;
  provinceCode?: number;
  provinceName?: string;
  wardCode?: number;
  wardName?: string;
  addressDetail?: string;
  isMain: boolean;
}

export type UpdateWarehouseInput = Partial<CreateWarehouseInput>;
