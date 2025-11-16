// SnowflakeCanvas 组件
import React, { useEffect, useRef } from "react";
import { message } from "antd";
import type { DimDataMap, DimKey } from "./SnowflakeChart"; // 或从 types 导入
import { calculateControlPoints } from "../utils/bezier";
import { scoreToColor } from "../utils/color";

const DIMENSIONS: DimKey[] = ["VALUE", "FUTURE", "PAST", "HEALTH", "DIVIDEND"];

/**
 * SnowflakeCanvas组件的属性接口
 */
export interface SnowflakeCanvasProps {
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
   * 悬停的维度索引，null表示没有悬停
   */
  hoverIndex: number | null;
  /**
   * 悬停状态变化的回调函数
   * @param index - 悬停的维度索引，null表示取消悬停
   */
  onHoverChange: (index: number | null) => void;
  /**
   * 工具提示变化的回调函数
   * @param tooltip - 工具提示信息，包含位置和HTML内容，null表示隐藏工具提示
   */
  onTooltipChange: (
    tooltip: { x: number; y: number; html: string } | null
  ) => void;
  /**
   * 扇形区域点击的回调函数
   * @param idx - 点击的扇形区域索引
   */
  onSectorClick?: (idx: number) => void;
}

export default function SnowflakeCanvas({
  data,
  mode,
  highlightIndex,
  hoverIndex,
  onHoverChange,
  onTooltipChange,
  onSectorClick,
}: SnowflakeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectorPathsRef = useRef<Path2D[]>([]); // 避免频繁 setState 影响性能

  // 主绘制函数
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const DPR = window.devicePixelRatio || 1;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.scale(DPR, DPR);

    ctx.clearRect(0, 0, W, H);
    const centerX = W / 2;
    const centerY = H / 2;
    const maxR = Math.min(W, H) * 0.36;

    // 背景
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#2b3946");
    grad.addColorStop(1, "#4b5563");
    ctx.fillStyle = grad;
    roundRect(ctx, 0, 0, W, H, 16);
    ctx.fill();

    // 计算点
    const points: [number, number][] = DIMENSIONS.map((k, i) => {
      const angle = (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2;
      const r = (data[k].value / 7) * maxR;
      return [centerX + Math.cos(angle) * r, centerY + Math.sin(angle) * r];
    });

    const cps = calculateControlPoints(points, 0.35);

    // 绘制环和标签
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxR * (i / 4), 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.textAlign = "center";
    ctx.font = "14px Arial";
    DIMENSIONS.forEach((k, i) => {
      const angle = (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2;
      const x = centerX + Math.cos(angle) * (maxR + 28);
      const y = centerY + Math.sin(angle) * (maxR + 28);
      ctx.fillText(k, x, y);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle) * maxR,
        centerY + Math.sin(angle) * maxR
      );
      ctx.stroke();
    });
    ctx.restore();

    // 完整平滑路径
    const fullPath = new Path2D();
    fullPath.moveTo(points[0][0], points[0][1]);
    for (let i = 0; i < points.length; i++) {
      const p2 = points[(i + 1) % points.length];
      const cp2 = cps[i].cp2;
      const cp1next = cps[(i + 1) % cps.length].cp1;
      fullPath.bezierCurveTo(
        cp2[0],
        cp2[1],
        cp1next[0],
        cp1next[1],
        p2[0],
        p2[1]
      );
    }
    fullPath.closePath();

    // 构建每个扇区的路径用于点击测试和渲染
    const sectorPs: Path2D[] = [];
    for (let i = 0; i < points.length; i++) {
      const path = new Path2D();
      path.moveTo(centerX, centerY);
      path.lineTo(...points[i]);
      const cp2 = cps[i].cp2;
      const cp1next = cps[(i + 1) % cps.length].cp1;
      path.bezierCurveTo(
        cp2[0],
        cp2[1],
        cp1next[0],
        cp1next[1],
        ...points[(i + 1) % points.length]
      );
      path.closePath();
      sectorPs.push(path);
    }
    sectorPathsRef.current = sectorPs;

    // 填充颜色
    const total = DIMENSIONS.reduce((s, k) => s + data[k].value, 0);
    const normalized = total / (7 * DIMENSIONS.length);
    const fillColor = scoreToColor(normalized);

    // 根据模式渲染
    if (mode === "TOC" && highlightIndex !== null) {
      // 遮罩非高亮部分
      for (let i = 0; i < sectorPs.length; i++) {
        if (i === highlightIndex) continue;
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = "#000";
        ctx.fill(sectorPs[i]);
        ctx.restore();
      }
      // 高亮部分带有缩放和阴影
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(1.05, 1.05);
      ctx.translate(-centerX, -centerY);
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 18;
      ctx.fillStyle = fillColor;
      ctx.fill(sectorPs[highlightIndex]);
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 2;
      ctx.stroke(sectorPs[highlightIndex]);
      ctx.restore();
    } else {
      // 公司模式或无高亮
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = fillColor;
      ctx.fill(fullPath);
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.lineWidth = 2;
      ctx.stroke(fullPath);
      ctx.restore();
    }

    // 浅色轮廓
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    sectorPs.forEach((p) => ctx.stroke(p));
    ctx.restore();

    // 公司模式下的悬停效果
    if (mode === "COMPANY" && hoverIndex !== null) {
      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fill(sectorPs[hoverIndex]);
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.lineWidth = 2;
      ctx.stroke(sectorPs[hoverIndex]);
      ctx.restore();
    }

    // 中心点
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // 当属性改变时重新绘制
  useEffect(() => {
    draw();
  }, [data, mode, highlightIndex, hoverIndex]);

  // 鼠标事件处理程序
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let found: number | null = null;
      const ctx = canvas.getContext("2d")!;
      for (let i = 0; i < sectorPathsRef.current.length; i++) {
        if (ctx.isPointInPath(sectorPathsRef.current[i], x, y)) {
          found = i;
          break;
        }
      }

      onHoverChange(found);

      if (found !== null) {
        const key = DIMENSIONS[found];
        const d = data[key];
        const html = `<strong>${key}</strong><div>${d.description}</div>
                      <div>Value: ${d.value}</div>
                      <div>Sections: ${d.sections
                        .map(
                          (s, i) =>
                            `<span style="display:inline-block;padding:2px 6px;margin:2px;background:${
                              s ? "#22c55e" : "#374151"
                            };color:#fff;border-radius:4px;font-size:12px">${
                              i + 1
                            }:${s ? "✓" : "✗"}</span>`
                        )
                        .join("")}</div>`;
        onTooltipChange({ x: e.clientX, y: e.clientY, html });
      } else {
        onTooltipChange(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ctx = canvas.getContext("2d")!;
      for (let i = 0; i < sectorPathsRef.current.length; i++) {
        if (ctx.isPointInPath(sectorPathsRef.current[i], x, y)) {
          message.info(`Clicked sector index: ${i}`);
          onSectorClick?.(i);
          return;
        }
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [data, onSectorClick, onHoverChange, onTooltipChange]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 14,
        display: "block",
      }}
    />
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
