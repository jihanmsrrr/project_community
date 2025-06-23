// components/AuroraStyle.tsx
const AuroraStyle = () => {
    return (
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: -1,
          top: 0,
          left: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "60vw",
            height: "60vw",
            background: "radial-gradient(circle at 30% 30%, #60a5fa, transparent 70%)",
            top: "-20%",
            left: "-10%",
            filter: "blur(100px)",
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "60vw",
            height: "60vw",
            background: "radial-gradient(circle at 70% 70%, #a78bfa, transparent 70%)",
            bottom: "-20%",
            right: "-10%",
            filter: "blur(100px)",
            opacity: 0.7,
          }}
        />
      </div>
    );
  };
  
  export default AuroraStyle;
  