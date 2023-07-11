export const getPositionStatus = (
  e: React.PointerEvent<HTMLDivElement>,
  b: number
) => {
  const { x, y, width, height } = e.currentTarget.getBoundingClientRect();
  const { clientX, clientY } = e;
  const isOnTop = clientY - y <= b && clientY - y >= 0;
  const isOnLeft = clientX - x <= b && clientX - x >= 0;
  const isOnBottom = height - (clientY - y) <= b && height - (clientY - y) >= 0;
  const isOnRight = width - (clientX - x) <= b && width - (clientX - x) >= 0;
  const isOnBorder = isOnTop || isOnBottom || isOnLeft || isOnRight;
  return {
    isOnTop,
    isOnLeft,
    isOnBottom,
    isOnRight,
    isOnBorder,
  };
};
