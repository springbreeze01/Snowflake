// SnowflakeTooltip 组件
import React from "react";

/**
 * SnowflakeTooltip组件的属性接口
 */
export interface TooltipProps {
  /**
   * 工具提示信息，包含位置和HTML内容，null表示隐藏工具提示
   */
  tooltip: { x: number; y: number; html: string } | null;
}

export default function SnowflakeTooltip({ tooltip }: TooltipProps) {
  if (!tooltip) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: tooltip.x + 12,
        top: tooltip.y + 12,
        background: "rgba(20,20,25,0.95)",
        color: "#fff",
        padding: 12,
        borderRadius: 8,
        zIndex: 9999,
        maxWidth: 320,
        boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
        pointerEvents: "none",
        fontSize: "14px",
        lineHeight: 1.4,
      }}
      dangerouslySetInnerHTML={{ __html: tooltip.html }}
    />
  );
}
