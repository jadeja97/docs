export interface JumpScroll {
  container?: Element | null;
  element?: Element | null;
}

/**
 * jump to the element position instead of scrolling or relying on `scrollIntoView`
 *
 * @param options - Options for jump scroll
 * @param options.container - scroll container (dom element)
 * @param options.element - item in scroll container (dom element)
 */
export const jumpScroll = ({ container, element }: JumpScroll) => {
  //
  if (!container || !element) {
    return;
  }

  // get co-ordinates and dimentions
  const containerMeta = container.getBoundingClientRect();
  const elMeta = element.getBoundingClientRect();

  const offsetTop = elMeta.top - containerMeta.top;
  const offsetBottom = elMeta.bottom - containerMeta.bottom;

  if (offsetTop < 0 || offsetBottom > 0) {
    container.scrollTop += offsetTop;
  }

  /* the below method is not useful. */
  // when `scrollIntoView` starts, it would pause the main document scroll.

  // const isAbove = elMeta.top < containerMeta.top;
  // const isBelow = elMeta.bottom > containerMeta.bottom;

  // if (isAbove || isBelow) {
  // 	lastElement.scrollIntoView({
  // 		block: "center",
  // 		behavior: "smooth",
  // 	});
  // }
};
