export interface DocumentExists {
  exists(documnetId: string): Promise<boolean>;
}
