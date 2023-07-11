import { useRef } from "react";
import Moveable from "react-moveable";
import './index.css';
import { CloseCircleOutlined } from "@ant-design/icons";

export interface BoxRectProp {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface MBProp {
  onChange?: (data: BoxRectProp) => void;
  onDelete?: () => void;
}

export const MoveableBox: React.FC<MBProp> = ({ onDelete, onChange }) => {
  const boxRef = useRef<HTMLDivElement>(null);

  const getRects = () => {
    const { x, y, width, height } = boxRef.current?.getBoundingClientRect()!;
    onChange?.({
      x, y, width, height
    })
  }

  return (
    <>
      <div
        ref={boxRef}
        className="box"
      >
        <CloseCircleOutlined onClick={() => {
          onDelete?.()
        }} className="delete" />
      </div>
      <Moveable
        target={boxRef}
        resizable={true}
        keepRatio={false}
        snappable={true}
        draggable={true}
        throttleResize={1}
        bounds={{ left: 0, top: 0, bottom: 0, right: 0, position: "css" }}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        onResizeStart={e => {
          e.setFixedDirection([0, 0]);
        }}
        onDrag={e => {
          e.target.style.transform = e.transform;
          getRects();
        }}
        onBeforeResize={e => {
          e.setFixedDirection([0, 0]);
        }}
        onResize={e => {
          e.target.style.cssText += `width: ${e.width}px; height: ${e.height}px`;
          e.target.style.transform = e.drag.transform;
          getRects();
        }}
      />
    </>
  )
}