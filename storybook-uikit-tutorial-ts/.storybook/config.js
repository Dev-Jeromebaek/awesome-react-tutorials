import { configure, addParameters } from "@storybook/react";

// automatically import all files ending in *.stories.js
configure(require.context("../src", true, /\.stories\.(js|mdx|tsx)$/), module);

// 
addParameters({
  viewport: {
    viewports: newViewports, // newViewports would be an ViewportMap. (see below for examples)
    defaultViewport: "someDefault"
  }
});