import { CatSitting, type CatAccessory } from "./icons/Cat";
import { DogPomFat } from "./icons/Dog";

/** Decorative cat + dog duo that sits at the bottom of a page. */
export function PageMascots({ accessory = "none" }: { accessory?: CatAccessory }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 18, marginTop: 24, paddingBottom: 4, opacity: 0.92 }}>
      <span className="cat-wiggle" style={{ width: 42, height: 55, display: "block" }}>
        <CatSitting accessory={accessory} />
      </span>
      <span className="dog-chew" style={{ width: 58, height: 36, display: "block" }}>
        <DogPomFat />
      </span>
    </div>
  );
}
