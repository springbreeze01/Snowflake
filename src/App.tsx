import React, { useState } from "react";
import { Layout, Radio, Button } from "antd";

import SnowflakeChart from "./components/SnowflakeChart";
import type { DimDataMap } from "./types";
import ControlPanel from "./components/ControlPanel";

const { Content } = Layout;

const DEFAULT: DimDataMap = {
  VALUE: {
    value: 3,
    sections: [true, false, true, false, true, false],
    description:
      "Does the company pay a good, reliable and sustainable dividend?",
  },
  FUTURE: {
    value: 7,
    sections: [true, true, true, true, true, true],
    description:
      "How is the company forecast to perform in the next 1-3 years?",
  },
  PAST: {
    value: 5,
    sections: [false, true, false, true, false, true],
    description:
      "Does the company have strong financial health and manageable debt?",
  },
  HEALTH: {
    value: 7,
    sections: [true, true, false, false, true, false],
    description: "How has the company performed over the past 5 years?",
  },
  DIVIDEND: {
    value: 1,
    sections: [false, false, false, false, false, false],
    description:
      "Is the company undervalued compared to its peers, industry and forecasted cash flows?",
  },
};

type Mode = "COMPANY" | "TOC";

export default function App() {
  const [data, setData] = useState<DimDataMap>(DEFAULT);
  const [mode, setMode] = useState<Mode>("COMPANY");
  const [highlightSection, setHighlightSection] = useState<number | null>(null); // 0..4 or null

  const resetAll = () => {
    setData(DEFAULT);
    setMode("COMPANY");
    setHighlightSection(null);
  };

  const onSelectDim = (index: number | null) => {
    if (index === null) {
      setMode("COMPANY");
      setHighlightSection(null);
    } else {
      setMode("TOC");
      setHighlightSection(index);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#0f172a", padding: 24 }}>
      <Content style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <ControlPanel
          data={data}
          setData={setData}
          reset={resetAll}
          onSelectDim={onSelectDim}
          currentSelection={highlightSection}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ width: 520, height: 520 }}>
            <SnowflakeChart
              data={data}
              mode={mode}
              highlightIndex={highlightSection}
              onSectorClick={(idx) => {
                // 点击扇形触发 message（组件内部也会触发）
                // 此处是可选的 — SnowflakeChart 已经调用了 message。
                console.log("sector clicked", idx);
              }}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
}
