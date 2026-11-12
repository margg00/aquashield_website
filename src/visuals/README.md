# Page-specific drawings

Put SVG drawings for a single page here as `<page>.js`, for example `product.js`.
Every exported function `fooSvg(t)` becomes `{{{fooSvg}}}` in templates. `t` is the locale text for the language being built.
Names already set in `build.js` win, so pick a new name. Run `node build.js` after any change.
