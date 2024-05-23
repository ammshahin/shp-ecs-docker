import React from 'react';

export function Layout({className = '', children}) {
  return <div className={`page-width ${className}`}>{children}</div>;
}
