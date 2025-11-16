// 在 HSL 空间插值： 0->红 (h ~ 0), 120 -> 绿色 (h ~ 120)
// 比例 0到1
export function scoreToColor(ratio: number) {
  const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const r = clamp(ratio, 0, 1);
  const h = (1 - r) * 0 + r * 120; // 0到120
  const s = 85; // saturation
  const l = 50; // lightness
  return `hsl(${h}deg ${s}% ${l}%)`;
}
