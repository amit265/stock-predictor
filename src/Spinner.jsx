import React from "react";

const Spinner = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.7)",
        zIndex: 9999,
      }}
    >
      <div className="spinner" />
    </div>
  );
};

export default Spinner;
