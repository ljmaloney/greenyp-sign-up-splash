
export interface ClassifiedCategory {
  categoryId: string;
  active: boolean;
  name: string;
  urlName: string;
  shortDescription: string;
  description: string | null;
}

export interface ClassifiedCategoriesResponse {
  response: ClassifiedCategory[];
  errorMessageApi: any | null;
}
