import React, { useCallback, useEffect, useState } from 'react';
import CarnivalScene from './babylon';
import './index.css';
import { useSearchParams } from 'react-router-dom';


export const Carnival: React.FC = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const ref = useCallback((node: any) => {
    if (node) {
      setCanvas(node);
    }
  }, []);
  const [search, setSearch] = useSearchParams();

  useEffect(() => {
    if (canvas) {
      const viewY = search.get('vy');
      const mode = search.get('mode');
      const fov = search.get('fov');
      const instance = new CarnivalScene(canvas, {
        viewY: viewY ? parseFloat(viewY) : null,
        mode,
        fov,
      });
    }
  }, [canvas]);

  return (
    <div className='carnival'>
      <div className='tips'>
        {
          search.get('withTile') && (
            <h1>嘉年华</h1>
          )
        }
        {
          search.get('mode') === 'free' && (
            <div>
              1. 按下wasd移动相机
              <br />
              2. 按住鼠标左键并移动，来移动视角
            </div>
          )
        }
      </div>
      <canvas
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          touchAction: 'none',
        }}
      ></canvas>
    </div>
  );
};

