const isLiteralObject = (object) => object && (typeof (object) === 'object') && !Array.isArray(object);
const isStyle = (object) => isLiteralObject(object);
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
const renameProps = (style) => {
    // stores the style's entries __only_if__ the modification is needed:
    let styleArrLazy = null;
    for (const [propName, propIndex] of Object.keys(style).map((propName, propIndex) => [propName, propIndex])) {
        if (propName.startsWith('--'))
            continue; // ignores css variable
        if ((propName !== 'fallbacks') && !(propName in shorts))
            continue; // not in list => ignore
        /*
            initialize styleArrLazy (if was not initialized).
            
            convert LiteralObject to Array, so the prop order preserved.
            the order of the prop is guaranteed to be __preserved__
            so to rename the prop, just search with known `propIndex`.
        */
        if (!styleArrLazy)
            styleArrLazy = Object.entries(style);
        if (propName === 'fallbacks') {
            const fallbacks = styleArrLazy[propIndex][1];
            if (Array.isArray(fallbacks)) {
                styleArrLazy[propIndex][1] = fallbacks.map((item) => isStyle(item) ? renameProps(item) : item);
            }
            else if (isStyle(fallbacks)) {
                styleArrLazy[propIndex][1] = renameProps(fallbacks);
            } // if
        }
        else {
            // set the expanded propName:
            styleArrLazy[propIndex][0] = shorts[propName];
        } // if
    } // for
    if (styleArrLazy)
        return Object.fromEntries(styleArrLazy); // has changed => return the modified
    return style; // no changes => return the original
};
const onProcessStyle = (style, rule, sheet) => {
    return renameProps(style);
};
const onChangeValue = (propValue, propName, rule) => {
    if (propName.startsWith('--'))
        return propValue; // ignores css variable
    if (!(propName in shorts))
        return propValue; // not in list => ignore
    rule.prop(shorts[propName], propValue); // add the modified name
    return null; // delete the original name
};
export default function pluginShort() {
    return {
        onProcessStyle,
        onChangeValue,
    };
}
