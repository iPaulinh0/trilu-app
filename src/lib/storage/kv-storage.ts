/**
 * Minimal key-value persistence contract. Implementations live outside this
 * module (web localStorage today, React Native AsyncStorage later) so
 * feature code never touches a platform storage API directly.
 */
export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
