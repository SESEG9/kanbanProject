export interface IGlobalSettings {
  id: number;
  cancelTime?: number | null;
}

export type NewGlobalSettings = Omit<IGlobalSettings, 'id'> & { id: null };
