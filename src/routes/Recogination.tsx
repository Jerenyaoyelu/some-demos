import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import tesseractScheduler, { RectProp } from '../tesseract';
import './Recogination.css';
import { BoxRectProp, MoveableBox } from '../components/MovableBox';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export const Recogination: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [logs, setLogs] = useState<any>([]);
  const logsRef = useRef<any[]>([]);
  const [textList, setTextList] = useState<string[]>([]);
  const imgInfoRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const mbMapRef = useRef<{ [propName: string]: RectProp }>({});
  const [mbList, setMbList] = useState<string[]>([]);
  const [imgIns, setIms] = useState<HTMLImageElement | null>(null);
  const imgRef = useCallback((node: HTMLImageElement) => {
    if (node) {
      setIms(node);
    }
  }, [])

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await convertImageFileToBase64(file);
    setUrl(base64);
  }

  useEffect(() => {
    if (imgIns && url) {
      const { x, y } = imgIns.getBoundingClientRect()!
      imgInfoRef.current = { x, y };
    }
  }, [imgIns, url])

  const handleReco = async () => {
    if (url) {
      await tesseractScheduler.setWorkers('eng+chi_sim', {
        workerNums: 2,
        logger: (m) => {
          logsRef.current = [...logsRef.current, m];
          setLogs(logsRef.current);
        }
      })
      tesseractScheduler.setRectangles(Object.values(mbMapRef.current));
      const res = await tesseractScheduler.recognize(url) as Tesseract.RecognizeResult[];
      let list: string[] = [];
      res.forEach((result) => {
        list = [...list, ...result.data.text.split('\n')]
      })
      setTextList(list);
      // 清除logs
      logsRef.current = [];
    }
  }

  const handleMbChange = _.debounce((data: BoxRectProp, key: string) => {
    console.log(imgInfoRef.current.x, imgInfoRef.current.y, data.x, data.y);
    mbMapRef.current[key] = {
      left: data.x - imgInfoRef.current.x,
      top: data.y - imgInfoRef.current.y,
      width: data.width,
      height: data.height
    }
    console.log('changed box', key, mbMapRef.current[key]);
  }, 300)

  useEffect(() => {
    const el = document.getElementById('log-tree');
    if (!el) return;
    const handler = () => {
      el.scrollTop = el.scrollHeight - el.clientHeight;
    }
    el.addEventListener('DOMSubtreeModified', handler);
    return () => {
      el?.removeEventListener('DOMSubtreeModified', handler);
    }
  }, [])

  return (
    <div>
      <input type="file" accept='image/*' onChange={handleOnChange} />
      <div className='content'>
        <div
          className='img-area'
          ref={imgRef}
        >
          {url && <img src={url} alt="" />}
          {
            mbList.map((n) => {
              return (
                <MoveableBox
                  key={n}
                  onChange={(data) => {
                    handleMbChange(data, n);
                  }}
                  onDelete={() => {
                    const list = mbList.filter((id) => id !== n);
                    delete mbMapRef.current[n];
                    setMbList(list);
                    console.log(n, mbMapRef.current);
                  }}
                />
              )
            })
          }
        </div>
        <div>
          <button onClick={() => {
            const id = uuidv4();
            const newList = mbList.slice();
            newList.push(id);
            setMbList(newList);
            mbMapRef.current[id] = {
              left: 50,
              top: 50,
              width: 200,
              height: 100
            }
          }} style={{ marginBottom: '8px' }}>添加文字识别区域</button>
          <button onClick={handleReco}>开始识别</button>
        </div>
        {!!textList.length && <div className='text-area'>
          {
            textList.map((t, i) => {
              return (
                <div key={i}>{t}</div>
              )
            })
          }
        </div>}
      </div>
      <div className='logsWrap' id="log-tree">
        {
          logs.map((lg: any, index: number) => {
            return (
              <div key={index}>
                {lg.status}: {(lg.progress * 100).toFixed(1) + '%'}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export function convertImageFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result?.toString();
      if (base64String) {
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert image to base64 string'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
  });
}