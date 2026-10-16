import React from 'react';

interface FigureProps {
  type: string;
  params?: Record<string, number>;
  className?: string;
}

export const MathFigure: React.FC<FigureProps> = ({ type, params = {}, className = '' }) => {
  switch (type) {
    case 'triangle':
      return <TriangleFigure params={params} className={className} />;
    case 'tales':
      return <TalesFigure params={params} className={className} />;
    case 'ladder':
      return <LadderFigure params={params} className={className} />;
    case 'shadow':
      return <ShadowFigure params={params} className={className} />;
    case 'ramp':
      return <RampFigure params={params} className={className} />;
    default:
      return null;
  }
};

const TriangleFigure: React.FC<{ params: Record<string, number>; className: string }> = ({ params, className }) => {
  const { a = 10, b = 6, c = 8, m, n, h } = params;
  const hasMetrics = m !== undefined && n !== undefined;
  
  // Scale to fit viewBox
  const scale = 200 / Math.max(a || 10, b || 6, c || 8);
  const w = (c || 8) * scale;
  const ht = (b || 6) * scale;
  
  const ox = 50, oy = 250;
  const Ax = ox, Ay = oy;
  const Bx = ox + w, By = oy;
  const Cx = ox, Cy = oy - ht;
  
  return (
    <svg viewBox="0 0 350 300" className={`math-figure ${className}`} role="img" aria-label="Triângulo retângulo">
      {/* Triangle */}
      <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="none" stroke="currentColor" strokeWidth="2" />
      
      {/* Right angle symbol */}
      <polyline points={`${Ax + 15},${Ay} ${Ax + 15},${Ay - 15} ${Ax},${Ay - 15}`} fill="none" stroke="currentColor" strokeWidth="1.5" />
      
      {/* Height (dashed) if metrics */}
      {hasMetrics && (
        <>
          {(() => {
            const mVal = m || 0;
            const hv = h || Math.sqrt(mVal * (n || 0));
            const Hx = Ax + (mVal / (a || 10)) * w;
            const Hy = Ay - hv * scale * 0.8;
            return (
              <>
                <line x1={Hx} y1={Ay} x2={Hx} y2={Hy} stroke="currentColor" strokeWidth="1.5" strokeDasharray="5,3" />
                <text x={Hx + 8} y={(Ay + Hy) / 2} fontSize="14" fontWeight="bold" fill="currentColor">h</text>
                <text x={Ax + (mVal / (a || 10)) * w / 2} y={Ay + 20} fontSize="13" fontWeight="bold" fill="currentColor" textAnchor="middle">m</text>
                <text x={(Hx + Bx) / 2} y={By + 20} fontSize="13" fontWeight="bold" fill="currentColor" textAnchor="middle">n</text>
              </>
            );
          })()}
        </>
      )}
      
      {/* Labels */}
      <text x={(Ax + Bx) / 2} y={Ay + 25} fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="middle">
        {hasMetrics ? `a = ${a}` : `a = ${a}`}
      </text>
      <text x={Ax - 20} y={(Ay + Cy) / 2} fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="middle">
        {hasMetrics ? `b` : `b = ${b}`}
      </text>
      <text x={(Bx + Cx) / 2 + 15} y={(By + Cy) / 2} fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="middle">
        {hasMetrics ? `c` : `c = ${c}`}
      </text>
      
      {/* Vertices */}
      <text x={Ax - 10} y={Ay + 15} fontSize="13" fill="currentColor">A</text>
      <text x={Bx + 5} y={By + 15} fontSize="13" fill="currentColor">B</text>
      <text x={Cx - 10} y={Cy - 5} fontSize="13" fill="currentColor">C</text>
    </svg>
  );
};

const TalesFigure: React.FC<{ params: Record<string, number>; className: string }> = ({ params, className }) => {
  const { a = 4, b = 6, c = 8, d = 12 } = params;
  
  const total = a + b;
  const scale = 180 / Math.max(total, c + d || 20);
  
  // Two transversals cut by parallel lines
  const x1 = 80, x2 = 250;
  const y1 = 50, y2 = 150, y3 = 250;
  
  const seg1 = a * scale;
  const seg2 = b * scale;
  
  return (
    <svg viewBox="0 0 350 300" className={`math-figure ${className}`} role="img" aria-label="Teorema de Tales">
      {/* Parallel lines */}
      <line x1="30" y1={y1} x2="320" y2={y1} stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <line x1="30" y1={y2} x2="320" y2={y2} stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <line x1="30" y1={y3} x2="320" y2={y3} stroke="currentColor" strokeWidth="2" opacity="0.5" />
      
      {/* Transversal 1 */}
      <line x1={x1} y1={y1} x2={x1} y2={y3} stroke="currentColor" strokeWidth="2.5" />
      
      {/* Transversal 2 */}
      <line x1={x2} y1={y1} x2={x2} y2={y3} stroke="currentColor" strokeWidth="2.5" />
      
      {/* Segment markers on transversal 1 */}
      <text x={x1 - 25} y={(y1 + y2) / 2 + 5} fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="middle">{a}</text>
      <text x={x1 - 25} y={(y2 + y3) / 2 + 5} fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="middle">{b}</text>
      
      {/* Segment markers on transversal 2 */}
      <text x={x2 + 25} y={(y1 + y2) / 2 + 5} fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="middle">{c}</text>
      <text x={x2 + 25} y={(y2 + y3) / 2 + 5} fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="middle">{d === 0 ? '?' : d}</text>
      
      {/* Brackets */}
      <line x1={x1 - 10} y1={y1} x2={x1 - 10} y2={y2} stroke="currentColor" strokeWidth="1" />
      <line x1={x1 - 10} y1={y2} x2={x1 - 10} y2={y3} stroke="currentColor" strokeWidth="1" />
      <line x1={x2 + 10} y1={y1} x2={x2 + 10} y2={y2} stroke="currentColor" strokeWidth="1" />
      <line x1={x2 + 10} y1={y2} x2={x2 + 10} y2={y3} stroke="currentColor" strokeWidth="1" />
      
      {/* Parallel marks */}
      <text x="15" y={y1 + 5} fontSize="12" fill="currentColor">r₁</text>
      <text x="15" y={y2 + 5} fontSize="12" fill="currentColor">r₂</text>
      <text x="15" y={y3 + 5} fontSize="12" fill="currentColor">r₃</text>
    </svg>
  );
};

const LadderFigure: React.FC<{ params: Record<string, number>; className: string }> = ({ params, className }) => {
  const { a = 13, b = 5, c = 12 } = params;
  
  const scale = 180 / Math.max(a, b, c);
  const w = b * scale;
  const h = c * scale;
  
  const ox = 60, oy = 260;
  
  return (
    <svg viewBox="0 0 350 300" className={`math-figure ${className}`} role="img" aria-label="Escada na parede">
      {/* Wall */}
      <line x1={ox} y1={oy} x2={ox} y2={oy - h} stroke="currentColor" strokeWidth="3" />
      {/* Ground */}
      <line x1={ox} y1={oy} x2={ox + w + 30} y2={oy} stroke="currentColor" strokeWidth="3" />
      {/* Ladder */}
      <line x1={ox} y1={oy - h} x2={ox + w} y2={oy} stroke="currentColor" strokeWidth="2.5" strokeDasharray="8,4" />
      
      {/* Right angle */}
      <polyline points={`${ox + 12},${oy} ${ox + 12},${oy - 12} ${ox},${oy - 12}`} fill="none" stroke="currentColor" strokeWidth="1.5" />
      
      {/* Labels */}
      <text x={ox + w / 2 + 10} y={oy - h / 2} fontSize="14" fontWeight="bold" fill="currentColor" transform={`rotate(-${Math.atan2(h, w) * 180 / Math.PI}, ${ox + w / 2}, ${oy - h / 2})`}>
        a = {a}
      </text>
      <text x={ox - 25} y={oy - h / 2} fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="middle">{c || '?'}</text>
      <text x={ox + w / 2} y={oy + 25} fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="middle">{b || '?'}</text>
    </svg>
  );
};

const ShadowFigure: React.FC<{ params: Record<string, number>; className: string }> = ({ params, className }) => {
  const { h1 = 6, s1 = 4, s2 = 10, h2 = 15 } = params;
  
  const scale = 15;
  
  return (
    <svg viewBox="0 0 400 280" className={`math-figure ${className}`} role="img" aria-label="Sombras">
      {/* Post */}
      <line x1="80" y1="220" x2="80" y2={220 - h1 * scale} stroke="currentColor" strokeWidth="3" />
      <line x1="80" y1="220" x2={80 + s1 * scale} y2="220" stroke="currentColor" strokeWidth="2" strokeDasharray="4,3" />
      
      {/* Tree */}
      <line x1="250" y1="220" x2="250" y2={220 - h2 * scale} stroke="currentColor" strokeWidth="3" />
      <line x1="250" y1="220" x2={250 + s2 * scale} y2="220" stroke="currentColor" strokeWidth="2" strokeDasharray="4,3" />
      
      {/* Sun rays */}
      <line x1="80" y1={220 - h1 * scale} x2={80 + s1 * scale} y2="220" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="250" y1={220 - h2 * scale} x2={250 + s2 * scale} y2="220" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      
      {/* Labels */}
      <text x="65" y={220 - h1 * scale / 2} fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="end">{h1} m</text>
      <text x={80 + s1 * scale / 2} y="245" fontSize="13" fontWeight="bold" fill="currentColor" textAnchor="middle">{s1} m</text>
      <text x="235" y={220 - h2 * scale / 2} fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="end">{h2 === 0 ? '?' : h2 + ' m'}</text>
      <text x={250 + s2 * scale / 2} y="245" fontSize="13" fontWeight="bold" fill="currentColor" textAnchor="middle">{s2} m</text>
      
      {/* Ground line */}
      <line x1="40" y1="220" x2="380" y2="220" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
};

const RampFigure: React.FC<{ params: Record<string, number>; className: string }> = ({ params, className }) => {
  const { total = 10, base = 6, x = 4, h = 4 } = params;
  
  const scale = 25;
  
  return (
    <svg viewBox="0 0 350 280" className={`math-figure ${className}`} role="img" aria-label="Rampa">
      {/* Ramp */}
      <line x1="60" y1="230" x2={60 + base * scale} y2={230 - (base * total / base) * scale * 0.5} stroke="currentColor" strokeWidth="2.5" />
      
      {/* Ground */}
      <line x1="40" y1="230" x2="320" y2="230" stroke="currentColor" strokeWidth="2" />
      
      {/* Vertical at x */}
      <line x1={60 + x * scale} y1="230" x2={60 + x * scale} y2={230 - h * scale * 0.5} stroke="currentColor" strokeWidth="1.5" strokeDasharray="5,3" />
      
      {/* Labels */}
      <text x={60 + base * scale / 2} y="255" fontSize="13" fontWeight="bold" fill="currentColor" textAnchor="middle">{base} m</text>
      <text x={60 + x * scale / 2} y="255" fontSize="13" fontWeight="bold" fill="currentColor" textAnchor="middle">{x} m</text>
      <text x={60 + x * scale + 15} y={230 - h * scale * 0.25} fontSize="14" fontWeight="bold" fill="currentColor">{h === 0 ? '?' : h + ' m'}</text>
    </svg>
  );
};

export default MathFigure;
