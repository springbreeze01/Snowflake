// 参考常见平滑多点曲线控制点算法
export function calculateControlPoints(
  points: [number, number][],
  tension = 0.35
) {
  const n = points.length;
  const cp: { cp1: [number, number]; cp2: [number, number] }[] = [];

  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];

    // 从上一个点到下一个点的向量
    const dx = (p2[0] - p0[0]) * tension;
    const dy = (p2[1] - p0[1]) * tension;

    // p1的控制点，cp1在p1之前，cp2在p1之后
    const cp1x = p1[0] - dx;
    const cp1y = p1[1] - dy;
    const cp2x = p1[0] + dx;
    const cp2y = p1[1] + dy;

    cp.push({
      cp1: [cp1x, cp1y],
      cp2: [cp2x, cp2y],
    });
  }

  return cp;
}
