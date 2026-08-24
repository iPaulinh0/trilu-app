import type { HomeSnapshot } from "./types";

export interface HomeRepository {
  getHomeSnapshot(dateKey: string): Promise<HomeSnapshot>;
}
