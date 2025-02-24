export interface Message {
  id: string;
  description: string;
  comment: string;
  timestamp: number;
  amount: number;
}

export type UpdateMessage = {
  type: 'initial';
  data: Message[];
} | {
  type: 'update';
  data: Message;
}
