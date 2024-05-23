import React from 'react';

export function Section({className = '', children}) {
  return <section className={`section-width ${className}`}>{children}</section>;
}
