export type Province = {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
};

export type Ward = {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
};

export interface ProvinceDetail extends Province {
  wards: Ward[];
}

export type Address = {
  id: string;
  recipientName: string;
  recipientPhone: string;
  provinceCode: number;
  provinceName: string;
  wardCode: number;
  wardName: string;
  addressDetail: string;
  fullAddress: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AddressesResponse = {
  data: Address[];
};

export type CreateAddressInput = {
  recipientName: string;
  recipientPhone: string;
  provinceCode: number;
  provinceName: string;
  wardCode: number;
  wardName: string;
  addressDetail: string;
  isDefault?: boolean;
};

export type UpdateAddressInput = Partial<CreateAddressInput>;
