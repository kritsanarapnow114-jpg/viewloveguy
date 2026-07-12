import { DogPomBear, DogPomFat } from "./icons/Dog";

/** Decorative strip: two bear-face poms chase each other past a fat pom having dinner. */
export function DogChaseStrip() {
  return (
    <div
      style={{
        position: "relative",
        height: 84,
        borderRadius: 18,
        background: "linear-gradient(180deg,#faf6ff,#f0e9fb)",
        border: "1px solid #ece2f7",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 6, height: 1, background: "#e0d3f0" }} />

      <div className="dog-run" style={{ width: 58, animationDuration: "5.2s" }}>
        <DogPomBear />
      </div>
      <div className="dog-run" style={{ width: 50, animationDuration: "5.2s", animationDelay: "-2.6s", opacity: 0.85 }}>
        <DogPomBear />
      </div>

      <div className="dog-chew" style={{ position: "absolute", right: 14, bottom: 6, width: 66 }}>
        <DogPomFat />
      </div>
    </div>
  );
}
