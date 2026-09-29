import "@fontsource-variable/inter";
import "./styles/tokens.css";
import "./styles/global.scss";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Tab, TabList, TabPanel, Tabs, type TabsVariant } from "./index.ts";
import styles from "./playground.module.scss";

const skeletonIds = ["a", "b", "c", "d", "e", "f"];

function InboxDemo({ variant }: { variant: TabsVariant }) {
  return (
    <Tabs variant={variant} defaultValue="emails">
      <TabList aria-label={`Inbox (${variant})`}>
        <Tab value="emails">Emails</Tab>
        <Tab value="files" badge={{ label: "Warning", variant: "negative" }}>
          Files
        </Tab>
        <Tab value="edits">Edits</Tab>
        <Tab value="downloads">Downloads</Tab>
        <Tab value="documents">Documents</Tab>
      </TabList>
      <TabPanel value="emails" className={styles.panel}>
        <div className={styles.rowList}>
          {skeletonIds.map((id) => (
            <div key={`row-${id}`} className={styles.skeletonRow} />
          ))}
        </div>
      </TabPanel>
      <TabPanel value="files" className={styles.panel}>
        <div className={styles.cardGrid}>
          {skeletonIds.map((id) => (
            <div key={`card-${id}`} className={styles.skeletonCard} />
          ))}
        </div>
      </TabPanel>
      <TabPanel value="edits" className={styles.panel}>
        <p className={styles.placeholder}>Edits panel</p>
      </TabPanel>
      <TabPanel value="downloads" className={styles.panel}>
        <p className={styles.placeholder}>Downloads panel</p>
      </TabPanel>
      <TabPanel value="documents" className={styles.panel}>
        <p className={styles.placeholder}>Documents panel</p>
      </TabPanel>
    </Tabs>
  );
}

function Playground() {
  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <h1 className={styles.heading}>Switching tabs</h1>
        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Pill</h2>
          <InboxDemo variant="pill" />
        </section>
        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Underline</h2>
          <InboxDemo variant="underline" />
        </section>
      </main>
    </div>
  );
}

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <StrictMode>
    <Playground />
  </StrictMode>,
);
