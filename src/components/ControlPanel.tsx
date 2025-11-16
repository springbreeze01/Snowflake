import React from "react";
import { InputNumber, Row, Col, Radio, Button, Space } from "antd";
import type { DimDataMap, DimKey } from "../types";

const DIM_ORDER: DimKey[] = ["VALUE", "FUTURE", "PAST", "HEALTH", "DIVIDEND"];

/**
 * ControlPanel组件的属性接口
 */
export interface ControlPanelProps {
  /**
   * 维度数据映射，包含五个维度的评分数据
   */
  data: DimDataMap;
  /**
   * 设置维度数据的回调函数
   * @param d - 新的维度数据映射
   */
  setData: (d: DimDataMap) => void;
  /**
   * 重置所有维度数据的回调函数
   */
  reset: () => void;
  /**
   * 选择维度高亮的回调函数
   * @param index - 选择的维度索引，null表示取消选择
   */
  onSelectDim: (index: number | null) => void;
  /**
   * 当前选择的维度索引，null表示没有选择
   */
  currentSelection: number | null;
}

export default function ControlPanel({
  data,
  setData,
  reset,
  onSelectDim,
  currentSelection,
}: ControlPanelProps) {
  const onChangeValue = (key: DimKey, v: number | null) => {
    if (v === null) return;
    setData({
      ...data,
      [key]: { ...data[key], value: Math.max(0, Math.min(7, Math.round(v))) },
    });
  };

  return (
    <div
      style={{
        width: 420,
        padding: 18,
        borderRadius: 12,
        background: "#1e293b",
        color: "#fff",
        boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
      }}
    >
      <h3 style={{ color: "#fff" }}>调整维度分数</h3>

      {DIM_ORDER.map((k) => (
        <div
          key={k}
          style={{
            marginBottom: 12,
            background: "#263445",
            padding: 10,
            borderRadius: 8,
          }}
        >
          <Row align="middle">
            <Col span={12} style={{ color: "#fff" }}>
              {k}
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <InputNumber
                min={0}
                max={7}
                value={data[k].value}
                onChange={(v) => onChangeValue(k, v)}
              />
            </Col>
          </Row>
        </div>
      ))}

      <div style={{ marginTop: 12 }}>
        <h4 style={{ color: "#fff" }}>选择高亮区域 (Radio -{">"} 切为 TOC)</h4>
        <Radio.Group
          value={currentSelection === null ? "NONE" : currentSelection}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "NONE") onSelectDim(null);
            else onSelectDim(Number(val));
          }}
        >
          <Space wrap>
            <Radio.Button value={"NONE"}>NONE</Radio.Button>
            {DIM_ORDER.map((k, i) => (
              <Radio.Button key={k} value={i}>
                {k}
              </Radio.Button>
            ))}
          </Space>
        </Radio.Group>
      </div>

      <div style={{ marginTop: 16 }}>
        <Button type="primary" danger onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
