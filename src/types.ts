/**
 * 维度键类型定义
 * 定义了雪花图的五个维度：价值、未来、过去、健康、分红
 */
export type DimKey = "VALUE" | "FUTURE" | "PAST" | "HEALTH" | "DIVIDEND";

/**
 * 维度数据类型
 * 定义了每个维度的详细数据结构
 */
export type DimData = {
  /** 维度分数值，范围为0到7 */
  value: number;
  /** 区域状态数组，长度为6，表示每个子区域是否激活 */
  sections: boolean[];
  /** 维度描述文本 */
  description: string;
};

/**
 * 维度数据映射类型
 * 将维度键映射到对应的维度数据
 */
export type DimDataMap = Record<DimKey, DimData>;
