import React from "react";

export function Body({ className = "", children }) {
  return <div className={`checkout_page_body ${className}`}>{children}</div>;
}
