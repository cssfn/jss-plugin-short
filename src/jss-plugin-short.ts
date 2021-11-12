// jss:
import type {
    Plugin,
    JssStyle,

    Rule,
    StyleSheet,
}                           from 'jss'           // base technology of our cssfn components



const shorts: { [key: string]: string } = {
    foreg       : 'color',
    backg       : 'background',
    'backgClip' : 'backgroundClip',
    anim        : 'animation',
    transf      : 'transform',
    'gapX'      : 'columnGap',
    'gapY'      : 'rowGap',
    'gapInline' : 'columnGap',
    'gapBlock'  : 'rowGap',
};

const onProcessStyle = (style: JssStyle & { [key: string]: JssStyle[keyof JssStyle] }, rule: Rule, sheet?: StyleSheet): JssStyle => {
    // convert LiteralObject to Array, so the prop order preserved:
    let styleArrLazy : [string, any][]|null = null;
    
    for (const [propName, index] of Object.keys(style).map((key, index) => [key, index] as const)) {
        if (propName in shorts) {
            // initialize styleArrLazy:
            if (!styleArrLazy) styleArrLazy = Object.entries(style);
            
            // set the expanded propName:
            styleArrLazy[index][0] = shorts[propName];
        } // if
    } // for
    
    
    
    if (styleArrLazy) return Object.fromEntries(styleArrLazy); // return the modified
    return style; // return the original
};

export default function pluginShort(): Plugin { return {
    onProcessStyle,
}}