import { cssVar, type RadiusKey, radius } from "../tokens/index.ts";
import styles from "./RadiusScale.module.scss";

export function RadiusScale() {
  const keys = Object.keys(radius) as RadiusKey[];

  return (
    <div className={styles.grid}>
      {keys.map((key) => {
        const varName = cssVar("radius", key);
        return (
          <div className={styles.item} key={key}>
            <div className={styles.box} style={{ borderRadius: `var(${varName})` }} />
            <span className={styles.name}>{key}</span>
            <span className={styles.value}>{radius[key]}px</span>
            <code className={styles.value}>{varName}</code>
          </div>
        );
      })}
    </div>
  );
}
