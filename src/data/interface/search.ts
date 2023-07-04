export interface SearchForm {
  searchFor?: string;
  category?: string;
  uploader?: string;
  sortBy?: string;
  pageId?: number;
  widthMin?: number;
  widthMax?: number;
  heightMin?: number;
  heightMax?: number;
  regexp?: 0 | 1;
  tags: string[];
}

export interface SearchHistory { 
  search_for: string;
}


export type RawSearchForm = Omit<SearchForm, "pageId">;
