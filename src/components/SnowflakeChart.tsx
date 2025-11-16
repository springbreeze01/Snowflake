// SnowflakeChart.tsx (容器组件)
import React, { useState } from "react";
import SnowflakeCanvas from "./SnowflakeCanvas";
import SnowflakeTooltip from "./SnowflakeTooltip";

const DIMENSIONS = ["VALUE", "FUTURE", "PAST", "HEALTH", "DIVIDEND"] as const;

export type DimKey = (typeof DIMENSIONS)[number];
export interface DimData {
  value: number; // 0到7
  description: string;
  sections: boolean[]; // 例如：[true, false, true]
}

export type DimDataMap = Record<DimKey, DimData>;

/**
 * SnowflakeChart组件的属性接口
 */
export interface SnowflakeChartProps {
  /**
   * 维度数据映射，包含五个维度的评分数据
   */
  data: DimDataMap;
  /**
   * 显示模式：COMPANY（公司模式）或TOC（目录模式）
   */
  mode: "COMPANY" | "TOC";
  /**
   * 高亮的维度索引，null表示没有高亮
   */
  highlightIndex: number | null;
  /**
   * 扇形区域点击的回调函数
   * @param idx - 点击的扇形区域索引
   */
  onSectorClick?: (idx: number) => void;
}

export default function SnowflakeChart({
  data,
  mode,
  highlightIndex,
  onSectorClick,
}: SnowflakeChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    html: string;
  } | null>(null);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <SnowflakeCanvas
        data={data}
        mode={mode}
        highlightIndex={highlightIndex}
        hoverIndex={hoverIndex}
        onHoverChange={setHoverIndex}
        onTooltipChange={setTooltip}
        onSectorClick={onSectorClick}
      />
      <SnowflakeTooltip tooltip={tooltip} />
    </div>
  );
}
