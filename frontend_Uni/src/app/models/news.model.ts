export interface News {
  id: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export type NewsFormAction = {
  action: 'add' | 'edit';
  data: Omit<News, 'id'>;
};