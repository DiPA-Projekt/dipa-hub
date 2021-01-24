export interface NavItem {
  id?: number;
  name: string;
  disabled?: boolean;
  icon: string;
  route?: string;
  url?: string;
  file?: string;
  children?: NavItem[];
}
