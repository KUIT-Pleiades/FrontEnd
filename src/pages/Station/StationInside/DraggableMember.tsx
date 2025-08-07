import React, { useState } from "react";
import { useDrag } from "@use-gesture/react";
import messageBtn from "../../../assets/btnImg/messageBtn.svg";
import s from "./StationInside.module.scss";

interface DraggableMemberProps {
  member: {
    userId: string;
    userName: string;
    character: string;
    todayReport: boolean;
  };
  position: { x: number; y: number };
  onPositionChange: (userId: string, x: number, y: number) => void;
  onMemberClick: () => void;
  onDragStateChange: (isDragging: boolean) => void;
}

const DraggableMember: React.FC<DraggableMemberProps> = ({
  member,
  position,
  onPositionChange,
  onMemberClick,
  onDragStateChange,
}) => {
  const [localPosition, setLocalPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);

  const bind = useDrag(
    ({ down, movement: [mx, my], tap, event }) => {
      event?.preventDefault();
      
      if (tap && member.todayReport) {
        onMemberClick();
        return;
      }

      if (down) {
        setIsDragging(true);
        onDragStateChange(true);
        
        const newX = position.x + (mx / window.innerWidth) * 100;
        const newY = position.y + (my / window.innerHeight) * 100;
        
        const clampedX = Math.max(0, Math.min(70, newX));
        const clampedY = Math.max(10, Math.min(80, newY));
        
        setLocalPosition({ x: clampedX, y: clampedY });
      } else {
        setIsDragging(false);
        onDragStateChange(false);
        onPositionChange(member.userId, localPosition.x, localPosition.y);
      }
    },
    {
      filterTaps: true,
      pointer: { touch: true },
      preventDefault: true,
    }
  );

  return (
    <div
      className={s.memberItem}
      style={{
        position: "fixed",
        left: `${localPosition.x}dvw`,
        top: `${localPosition.y}dvh`,
        width: "30dvw",
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
        zIndex: isDragging ? 200 : 1,
      }}
    >
      <img
        {...bind()}
        src={member.character}
        alt=""
        style={{
          width: "100%",
          userSelect: "none",
          WebkitUserDrag: "none",
          pointerEvents: "auto",
        }}
      />
      {member.todayReport && (
        <div
          className={s.messageIcon}
          style={{
            position: "absolute",
            left: `${20}dvw`,
            top: `${2}dvh`,
            zIndex: 100,
            pointerEvents: member.todayReport && !isDragging ? "auto" : "none",
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (!isDragging) {
              onMemberClick();
            }
          }}
        >
          <img
            src={messageBtn}
            alt="리포트"
            style={{
              height: "7dvw",
              userSelect: "none",
              WebkitUserDrag: "none",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DraggableMember;