
export interface AdPackage {
  adTypeId: string;
  createDate: string;
  active: boolean;
  defaultPackage: boolean;
  adTypeName: string;
  monthlyPrice: number;
  threeMonthPrice: number;
  features: {
    features: string[];
    maxImages: number;
    protectContact: boolean;
  };
}

export interface AdPackagesResponse {
  response: AdPackage[];
  errorMessageApi: string | null;
}
