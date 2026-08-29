export interface Province {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
}

export interface Ward {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
}

export interface ProvinceDetail extends Province {
  wards: Ward[];
}
