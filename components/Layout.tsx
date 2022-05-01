import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};
// bg color: #202225
const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <div className="layout">{props.children}</div>
    <style jsx global>{`
      html {
        box-sizing: border-box;
      }

      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }

      a {
        color: #b7bec9;
      }

      * {
        color: white;
      }

      body {
        background-color: #202225;
        margin: 0;
        padding: 0;
        font-size: 16px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
          "Segoe UI Symbol";
      }

      input,
      textarea {
        font-size: 16px;
      }

      button {
        cursor: pointer;
        background-color: #353840;
      }
    `}</style>
  </div>
);

export default Layout;
