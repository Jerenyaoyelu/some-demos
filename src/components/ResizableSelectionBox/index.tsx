import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import './index.css';
import { getPositionStatus } from './helper';
import { OffsetType, useRsbConext } from './context';

interface BoxOffset {
  top: number;
  left: number;
}

interface BoxProp {
  boxBorder?: number;
  color?: string;
}

export const Box: React.FC<BoxProp> = ({ boxBorder, color }) => {
  const {
    grabs: [isGrabbing, setIsGrabbing],
    cursors: [cursorOffsets, setCursorOffset],
    borders: [border, setBorder],
    wrapInfos: [wrapInfo, _]
  } = useRsbConext();
  const [c, setC] = useState<string>(color || 'red');
  const boxRef = useRef<HTMLDivElement>(null);
  const [isOnBorder, setIsOnBorder] = useState<boolean>(false);
  const lastOffsetRef = useRef<BoxOffset>({
    top: 0,
    left: 0
  })
  const lastCursorPos = useRef<OffsetType>({
    x: 0,
    y: 0
  })

  useEffect(() => {
    if (boxBorder) {
      setBorder(boxBorder);
    }
  }, [boxBorder])

  const cursor = isGrabbing ? 'grabbing' : isOnBorder ? 'grab' : 'auto'
  const handleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const pos = getPositionStatus(e, border);
    setIsGrabbing(pos.isOnBorder);
    setIsOnBorder(pos.isOnBorder);
    const { x, y } = e.currentTarget.getBoundingClientRect();
    lastCursorPos.current = { x, y };
    lastOffsetRef.current = {
      top: y - wrapInfo.y,
      left: x - wrapInfo.x
    }
    console.log('box', x, y, y - wrapInfo.y);
  }

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isOnBorder) return;
    const pos = getPositionStatus(e, border);
    setIsOnBorder(pos.isOnBorder);
  }

  const handleUp = (e: React.PointerEvent<HTMLDivElement>) => {
    lastCursorPos.current = { x: 0, y: 0 };
    const { x, y } = e.currentTarget.getBoundingClientRect();
    lastOffsetRef.current = {
      top: y - wrapInfo.y,
      left: x - wrapInfo.x
    }
    if (!isOnBorder) return;
    const pos = getPositionStatus(e, border);
    setIsOnBorder(pos.isOnBorder);
  }

  useEffect(() => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const { x, y, height, width } = wrapInfo;
    const disX = x - lastCursorPos.current.x;
    const disY = y - lastCursorPos.current.y;
    const newLeft = lastOffsetRef.current.left + disX;
    const newTop = lastOffsetRef.current.top + disY;

    console.log(x - lastCursorPos.current.x, x, lastCursorPos.current.x, disX, newLeft, newLeft - x, width, rect.width);

    if (newTop - y >= 0 && newTop - y <= height - rect.height) {
      boxRef.current.style.top = newTop + 'px';
    }
    if (newLeft - x >= 0 && newLeft - x <= width - rect.width) {
      boxRef.current.style.left = newLeft + 'px';
    }
  }, [cursorOffsets])

  return (
    <div
      className='box-wrap'
      ref={boxRef}
      style={{
        border: `${border}px solid ${c}`,
        cursor: cursor,
        userSelect: 'all'
      }}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerLeave={handleUp}
      onPointerUp={handleUp}
    >
    </div>
  )
}
