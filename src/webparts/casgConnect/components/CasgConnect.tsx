import * as React from "react";
import type { ICasgConnectProps } from "./ICasgConnectProps";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./CasgConnect.module.scss";
import { HashRouter } from "react-router-dom";
import Routers from "./Routers/Routers";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import Navbar from "./Navbar/Navbar";
import "primereact/resources/themes/tailwind-light/theme.css";

export let Envcontext = React.createContext(null);
export default class CasgConnect extends React.Component<
  ICasgConnectProps,
  {}
> {
  public render(): React.ReactElement<ICasgConnectProps> {
    const { context } = this.props;

    return (
      <FluentProvider
        theme={webLightTheme}
        className={`${styles.casgConnect} container-fluid`}
      >
        <Envcontext.Provider value={context}>
          <HashRouter>
            <div className={styles.pageWrapper}>
              <Navbar />
              <Routers />
            </div>
          </HashRouter>
        </Envcontext.Provider>
      </FluentProvider>
    );
  }
}
