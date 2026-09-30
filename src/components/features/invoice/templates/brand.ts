import { darkenTo, mix, readableOn } from '../../../../utils/color';

/** Shades derived from the invoice's brand colour, each tuned for one job on the printed page. */
export interface BrandTones {
    /** The colour exactly as picked: bars, blocks, highlights. */
    fill: string;
    /** Text drawn on `fill` (near-black or white, whichever reads better). */
    onFill: string;
    /** True for pale colours (lime, yellow) that need dark text on them. */
    isLight: boolean;
    /** The colour as small text on white paper, darkened until it passes 4.5:1. */
    text: string;
    /** For rules, borders and shapes on white: darkened until it passes 3:1. */
    graphic: string;
    /** A dark version for large backgrounds that carry white text (7:1). */
    deep: string;
    /** Secondary text on `deep`, e.g. an address inside a dark header. */
    onDeepMuted: string;
    /** A very light wash for panels and zebra rows. */
    tint: string;
    /** A soft border that belongs with `tint`. */
    line: string;
}

/**
 * Tones for the chosen colour, or null when the user hasn't picked one. Templates fall back to their own
 * hand-tuned palette on null, so the "Default" swatch leaves every design exactly as it was.
 * `color` must already be normalised (the invoice context guarantees it).
 */
export const getBrandTones = (color: string | undefined): BrandTones | null => {
    if (!color) return null;
    const deep = darkenTo(color, 7);
    const onFill = readableOn(color);
    return {
        fill: color,
        onFill,
        isLight: onFill !== '#ffffff',
        text: darkenTo(color, 4.5),
        graphic: darkenTo(color, 3),
        deep,
        onDeepMuted: mix(deep, '#ffffff', 0.72),
        tint: mix(color, '#ffffff', 0.92),
        line: mix(color, '#ffffff', 0.78),
    };
};
