const shorts = {
    foreg: 'color',
    backg: 'background',
    'backgClip': 'backgroundClip',
    anim: 'animation',
    transf: 'transform',
    'gapX': 'columnGap',
    'gapY': 'rowGap',
    'gapInline': 'columnGap',
    'gapBlock': 'rowGap',
};
const onProcessStyle = (style, rule, sheet) => {
    // convert LiteralObject to Array, so the prop order preserved:
    let styleArrLazy = null;
    for (const [propName, index] of Object.keys(style).map((key, index) => [key, index])) {
        if (propName in shorts) {
            // initialize styleArrLazy:
            if (!styleArrLazy)
                styleArrLazy = Object.entries(style);
            // set the expanded propName:
            styleArrLazy[index][0] = shorts[propName];
        } // if
    } // for
    if (styleArrLazy)
        return Object.fromEntries(styleArrLazy); // return the modified
    return style; // return the original
};
export default function pluginShort() {
    return {
        onProcessStyle,
    };
}
