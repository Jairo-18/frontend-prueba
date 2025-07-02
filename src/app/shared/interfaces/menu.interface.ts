export interface MenuInterface {
  module: string;
  icon: string;
  order: number;
  items: ItemInterface[];
}

export interface ItemInterface {
  name: string;
  route?: string;
  icon: string;
  order: number;
  subItems?: SubItemInterface[];
  isOpen?: boolean;
}

export interface SubItemInterface {
  name: string;
  icon: string;
  route: string;
}

export interface MenuItemSelectedInterface {
  moduleName: string;
  itemRoute: string;
}
