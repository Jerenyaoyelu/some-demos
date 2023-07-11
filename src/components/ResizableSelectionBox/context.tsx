import React, { useCallback, useContext, useEffect, useRef } from "react";
import { useState } from "react";

interface RsbCtxProp {
  isGrabbing: boolean;
  setIsGrabbing: (v: boolean) => void;
  border: number;
  setBorder: (v: number) => void;
  cursorOffsets: OffsetType;
  setCursorOffset: (v: OffsetType) => void;
  wrapInfo: WrapInfoType;
  setWrapInfo: (v: WrapInfoType) => void;
}

type WrapInfoType = OffsetType & BoxSize;

export const RsbConext = React.createContext<RsbCtxProp>({
  isGrabbing: false,
  setIsGrabbing: (v) => { },
  border: 2,
  setBorder: (v) => { },
  cursorOffsets: { x: 0, y: 0 },
  setCursorOffset: (v) => { },
  wrapInfo: { x: 0, y: 0, width: 0, height: 0 },
  setWrapInfo: (v) => { },
});

export interface OffsetType {
  x: number;
  y: number;
}

interface BoxSize {
  width: number;
  height: number;
}

export const RsbConextProvider = (props: any) => {
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);
  const [border, setBorder] = useState<number>(2);
  const [cursorOffsets, setCursorOffset] = useState<OffsetType>({ x: 0, y: 0 })
  const [wrap, setWrap] = useState<HTMLDivElement | null>(null);
  const bcRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      setWrap(node);
    }
  }, [])

  const [wrapInfo, setWrapInfo] = useState<WrapInfoType>({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (wrap) {
      const handler = () => {
        const { x, y } = wrap.getBoundingClientRect();
        setWrapInfo({
          ...wrapInfo,
          x, y,
        })
      }
      wrap.addEventListener('DOMSubtreeModified', handler);
      return () => {
        wrap.removeEventListener('DOMSubtreeModified', handler);
      }
    }
  }, [wrap])

  useEffect(() => {
    if (props.children && wrap) {
      const width = wrap.offsetWidth;
      const height = wrap.offsetHeight;
      console.log('hw', width, height);


      setWrapInfo({
        ...wrapInfo,
        width, height,
      })
    }
  }, [props.children, wrap])

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    if (isGrabbing && wrap) {
      setCursorOffset({
        x: clientX,
        y: clientY
      })
    }
  }

  useEffect(() => { })

  const handleUp = () => {
    console.log('up');

    setIsGrabbing(false);
  }

  return (
    <RsbConext.Provider
      value={{
        isGrabbing,
        setIsGrabbing,
        border,
        setBorder,
        cursorOffsets,
        setCursorOffset,
        wrapInfo,
        setWrapInfo
      }}
    >
      <div
        className={props.className}
        ref={bcRef}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        style={{
          userSelect: 'none',
        }}
      >
        {props.children}
      </div>
    </RsbConext.Provider>
  )
}

export const useRsbConext = () => {
  const {
    isGrabbing,
    setIsGrabbing,
    border,
    setBorder,
    cursorOffsets,
    setCursorOffset,
    wrapInfo,
    setWrapInfo
  } = useContext(RsbConext);

  const grabs: contextValueItem<boolean> = [isGrabbing, setIsGrabbing];
  const borders: contextValueItem<number> = [border, setBorder];
  const cursors: contextValueItem<OffsetType> = [cursorOffsets, setCursorOffset];
  const wrapInfos: contextValueItem<WrapInfoType> = [wrapInfo, setWrapInfo];
  return {
    grabs, borders, cursors, wrapInfos
  };
}

type contextValueItem<T> = [T, (v: T) => void]