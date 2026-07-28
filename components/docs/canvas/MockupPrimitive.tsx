import type { CSSProperties } from 'react';

// 4px 类型色条（节点顶部）
export function ColorBar({ color }: { color: string }) {
  return <div style={{ height: 4, background: color, borderRadius: '8px 8px 0 0' }} aria-hidden />;
}

// 连接端口圆点（左右 Handle 的静态还原）
export function HandleDot({ side }: { side: 'left' | 'right' }) {
  const style: CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    [side]: -5,
    width: 10,
    height: 10,
    borderRadius: '50%',
    border: '2px solid var(--border-bright)',
    background: 'var(--bg-elevated)',
  };
  return <div style={style} aria-hidden />;
}

// 点状画布背景（复刻 ReactFlow BackgroundVariant.Dots，用官网 --bg-subtle 色点）
export function DotsBackground() {
  const style: CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(var(--bg-subtle) 1px, transparent 1px)',
    backgroundSize: '16px 16px',
    opacity: 0.6,
  };
  return <div style={style} aria-hidden />;
}
