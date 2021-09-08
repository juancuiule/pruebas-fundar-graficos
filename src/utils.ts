export const hexOpacity = (opacity: number) => {
  return Math.round(opacity * 255).toString(16).toUpperCase()
}

export function calcTranslation(
  targetDistance: number,
  point0: { x: number; y: number },
  point1: { x: number; y: number }
) {
  var x1_x0 = point1.x - point0.x,
    y1_y0 = point1.y - point0.y,
    x2_x0,
    y2_y0;
  if (targetDistance === 0) {
    x2_x0 = y2_y0 = 0;
  } else if (y1_y0 === 0 || Math.abs(x1_x0 / y1_y0) > 1) {
    y2_y0 = -targetDistance;
    x2_x0 = (targetDistance * y1_y0) / x1_x0;
  } else {
    x2_x0 = targetDistance;
    y2_y0 = (targetDistance * -x1_x0) / y1_y0;
  }
  return {
    dx: x2_x0,
    dy: y2_y0
  };
}
