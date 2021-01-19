export interface NavItem {
  name: string;
  disabled?: boolean;
  icon: string;
  route?: string;
  url?: string;
  children?: NavItem[];
}
