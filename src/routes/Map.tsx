import React, { useEffect, useState } from "react";
import { getSphericalDistance } from "../spherical";

const Key = 'd033e7198c38dbc509061ddb5258d7eb';

export const Map: React.FC = () => {
  const [v1, setV1] = useState<string>('');
  const [v2, setV2] = useState<string>('');
  const [d, setD] = useState<number>(0);
  const [addr, setAddr] = useState<string>('');
  const [ll, setLl] = useState<string>('');

  const search = () => {
    const address = encodeURI(addr)
    fetch(`https://restapi.amap.com/v3/geocode/geo?key=${Key}&address=${address}`).then(res => res.json()).then((res) => {
      console.log('result', res);
      setLl(res.geocodes[0].location)
    })
  }

  const compute = () => {
    const [lon1, lat1] = v1.split(',').map((item) => parseFloat(item));
    const [lon2, lat2] = v2.split(',').map((item) => parseFloat(item));
    const d = getSphericalDistance({ lon: lon1, lat: lat1 }, { lon: lon2, lat: lat2 })
    setD(d);
  }

  return (
    <>
      <div id="container">
      </div>
      <div>
        <input type="text" value={addr} onChange={(v) => setAddr(v.target.value)} />
        <button onClick={search}>地址解析</button>
        <div>经纬度：{ll}</div>
      </div>
      <div>
        <textarea value={v1} onChange={(v) => {
          setV1(v.target.value)
        }} />
        <textarea value={v2} onChange={(v) => {
          setV2(v.target.value)
        }} />
        <button onClick={compute}> 计算</button>
        <div>距离：{d.toFixed(2)}米</div>
      </div>
    </>
  )
}