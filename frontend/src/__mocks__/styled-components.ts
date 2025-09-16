import React from 'react';

type StyledComponent = (strings: TemplateStringsArray, ...values: any[]) => React.ForwardRefExoticComponent<any>;

const createStyledComponent = (tag: string): StyledComponent => {
  return (strings: TemplateStringsArray, ...values: any[]) => {
    return React.forwardRef<any, any>((props, ref) => 
      React.createElement(tag, { ...props, ref })
    );
  };
};

const styled = (tag: string) => createStyledComponent(tag);

// Add all HTML elements
const elements = ['div', 'button', 'header', 'main', 'span', 'h1', 'h3'] as const;
elements.forEach(element => {
  (styled as any)[element] = createStyledComponent(element);
});

export default styled;
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => children;
