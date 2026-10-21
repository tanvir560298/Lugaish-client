// Checks DOM text against composited CSS background colours. Decorative text,
// disabled controls and canvas content are excluded; screenshots cover artwork.
export const scanTextContrast = () => {
  const parse = color => color.match(/[\d.]+/g)?.map(Number) || [0, 0, 0, 0];
  const composite = (foreground, background) => {
    const alpha = foreground[3] ?? 1;
    return [0, 1, 2].map(index => foreground[index] * alpha + background[index] * (1 - alpha)).concat(1);
  };
  const backgroundFor = element => {
    if (!element) return [255, 255, 255, 1];
    const color = parse(getComputedStyle(element).backgroundColor);
    return (color[3] ?? 1) === 1 ? color : composite(color, backgroundFor(element.parentElement));
  };
  const luminance = color => color.slice(0, 3).map(value => {
    value /= 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
  return [...document.querySelectorAll('body *')].flatMap(element => {
    if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'NOSCRIPT'].includes(element.tagName)
      || element.closest('svg,canvas,[aria-hidden=true],[disabled]')) return [];
    const style = getComputedStyle(element);
    if (!element.getClientRects().length || style.visibility === 'hidden') return [];
    let text = [...element.childNodes].filter(node => node.nodeType === 3).map(node => node.textContent.trim()).join(' ').trim();
    let foregroundStyle = style;
    if (element.matches('input:not([type=checkbox]):not([type=radio]):not([type=range]),textarea')) {
      text = element.value || element.placeholder || '';
      if (!element.value && element.placeholder) foregroundStyle = getComputedStyle(element, '::placeholder');
    }
    if (!text) return [];
    const background = backgroundFor(element);
    const foreground = composite(parse(foregroundStyle.color), background);
    let opacity = Number(foregroundStyle === style ? 1 : foregroundStyle.opacity);
    for (let parent = element; parent; parent = parent.parentElement) opacity *= Number(getComputedStyle(parent).opacity);
    const actual = composite([...foreground.slice(0, 3), opacity], background);
    const values = [luminance(actual), luminance(background)].sort((a, b) => b - a);
    const ratio = (values[0] + 0.05) / (values[1] + 0.05);
    const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && Number(style.fontWeight) >= 700);
    const target = large ? 3 : 4.5;
    return ratio < target ? [{ text: text.slice(0, 85), tag: element.tagName, cls: element.className,
      color: foregroundStyle.color, bg: background.slice(0, 3).map(Math.round), ratio: +ratio.toFixed(2), target }] : [];
  });
};
