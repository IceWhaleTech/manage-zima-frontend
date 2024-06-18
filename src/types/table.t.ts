interface Items {
  [key: string]:any
}

export interface ZimaTableForm{
  operate: string;
  items: Items;
  loading: boolean;
}

export interface ZimaTable<T> {
  loading?: boolean;
  filter:{
    pageNo?:number
    pageSize?:number
    [key: string]:any
  }
  data:T[]
  total?:number
  form:ZimaTableForm;
}
