export interface SelectItem {
  id: string | number;
  label: string;
}

export interface ErrorSelectProps {
  error?: boolean;
  helpertext?: string;
}
