import dayjs from 'dayjs/esm';

export interface IInvoice {
  id: number;
  hotelAddress?: string | null;
  customerAddress?: string | null;
  discount?: number | null;
  price?: number | null;
  duration?: number | null;
  billingDate?: dayjs.Dayjs | null;
  cancled?: boolean | null;
}

export type NewInvoice = Omit<IInvoice, 'id'> & { id: null };
