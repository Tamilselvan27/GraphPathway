import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./CasgConnect.module.scss";
import { HashRouter } from "react-router-dom";
import Routers from "./Routers/Routers";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import Navbar from "./Navbar/Navbar";
import "primereact/resources/themes/tailwind-light/theme.css";
export let Envcontext = React.createContext(null);
export default class CasgConnect extends React.Component {
    render() {
        const { context } = this.props;
        return (React.createElement(FluentProvider, { theme: webLightTheme, className: `${styles.casgConnect} container-fluid` },
            React.createElement(Envcontext.Provider, { value: context },
                React.createElement(HashRouter, null,
                    React.createElement("div", { className: styles.pageWrapper },
                        React.createElement(Navbar, null),
                        React.createElement(Routers, null))))));
    }
}
//# sourceMappingURL=CasgConnect.js.map