
export interface AdPackageFeatures {
  features: string[];
  maxImages: number;
  protectContact: boolean;
}

export interface AdPackage {
  adTypeId: string;
  createDate: string;
  active: boolean;
  defaultPackage: boolean;
  adTypeName: string;
  monthlyPrice: number;
  threeMonthPrice: number;
  features: AdPackageFeatures;
}

export interface AdPackagesResponse {
  response: AdPackage[];
  errorMessageApi: any | null;
}
