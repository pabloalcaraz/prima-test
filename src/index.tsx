import "@fontsource-variable/inter";
import "./styles/tokens.css";
import "./styles/global.scss";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Tab, TabList, TabPanel, Tabs, type TabsVariant } from "./index.ts";
import styles from "./playground.module.scss";

const tabs = ["Emails", "Files", "Edits", "Downloads", "Documents"];

function InboxDemo({ variant }: { variant: TabsVariant }) {
  return (
    <Tabs variant={variant} defaultValue="Emails">
      <TabList aria-label={`Inbox, ${variant} variant`}>
        {tabs.map((tab) => (
          <Tab
            key={tab}
            value={tab}
            badge={tab === "Files" ? { label: "Warning", variant: "negative" } : undefined}
          >
            {tab}
          </Tab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel key={tab} value={tab} className={styles.panel}>
          {`${tab} content`}
        </TabPanel>
      ))}
    </Tabs>
  );
}

function Playground() {
  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Tabs Design System</h1>
      {(["pill", "underline"] as const).map((variant) => (
        <section key={variant} className={styles.block}>
          <h2 className={styles.title}>{variant === "pill" ? "Pill" : "Underline"}</h2>
          <InboxDemo variant={variant} />
        </section>
      ))}
    </main>
  );
}

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root element in index.html");

createRoot(container).render(
  <StrictMode>
    <Playground />
  </StrictMode>,
);
