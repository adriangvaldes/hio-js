export interface TokenResponse {
  token: string;
  expiresIn: number;
}

export interface ActiveRoom {
  roomId: string;
  customerName: string;
  clientCount: number;
}
