import { cssVar, pxToRem, type SpacingKey, spacing } from "../tokens/index.ts";
import sharedStyles from "./foundations.module.scss";
import styles from "./SpacingScale.module.scss";

export function SpacingScale() {
  const keys = Object.keys(spacing) as SpacingKey[];

  return (
    <table className={sharedStyles.table}>
      <thead>
        <tr>
          <th>Token</th>
          <th>Px</th>
          <th>Rem</th>
          <th>CSS variable</th>
          <th>Preview</th>
        </tr>
      </thead>
      <tbody>
        {keys.map((key) => {
          const px = spacing[key];
          const varName = cssVar("space", key);
          return (
            <tr key={key}>
              <td>
                <code>{key}</code>
              </td>
              <td>{px}px</td>
              <td>{pxToRem(px)}</td>
              <td>
                <code>{varName}</code>
              </td>
              <td>
                <div className={styles.bar} style={{ width: `var(${varName})` }} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
