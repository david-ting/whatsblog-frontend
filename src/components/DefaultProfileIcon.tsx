import React from "react";

const DefaultProfileIcon: React.FC<{ name: string; size: number }> = ({
  name,
  size,
}) => {
  return (
    <div
      className="default-profile-icon"
      style={{
        width: size + "px",
        height: size + "px",
        lineHeight: size + "px",
        fontSize: size * 0.55 + "px",
      }}
    >
      {name[0].toUpperCase()}
    </div>
  );
};

export default DefaultProfileIcon;
