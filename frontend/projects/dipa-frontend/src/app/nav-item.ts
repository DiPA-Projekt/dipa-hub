export interface NavItem {
  id?: number;
  name: string;
  disabled?: boolean;
  icon: string;
  isRoute?: boolean;
  url?: string;
  isFile?: boolean;
  children?: NavItem[];
}
