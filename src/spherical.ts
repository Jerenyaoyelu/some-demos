export interface IPoint {
  lat: number; // 纬度
  lon: number; // 经度
}

export function getSphericalDistance(
  a: IPoint,
  b: IPoint,
  rad: number = 6371000
) {
  const wa = convert(a.lat);
  const ja = convert(a.lon);
  const wb = convert(b.lat);
  const jb = convert(b.lon);

  const aob = Math.acos(
    Math.cos(wa) * Math.cos(wb) * Math.cos(ja - jb) +
      Math.sin(wa) * Math.sin(wb)
  );
  return aob * rad;
}

function convert(d: number) {
  return (d * Math.PI) / 180;
}
