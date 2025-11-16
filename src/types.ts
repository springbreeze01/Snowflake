export type DimKey = "VALUE" | "FUTURE" | "PAST" | "HEALTH" | "DIVIDEND";

export type DimData = {
  value: number; // 0到7
  sections: boolean[]; // 长度6
  description: string;
};

export type DimDataMap = Record<DimKey, DimData>;
