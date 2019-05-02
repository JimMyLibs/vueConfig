export interface FetchOptions {
  apiType?: string;
  method?: string;
  headers?: any;
  body?: any;
  isConsole?: boolean;
  apiInfo?: object;
  [propName: string]: any;
}

export interface ConfOptions extends FetchOptions {
  isLoading?: boolean;
  isTip?: boolean
}
