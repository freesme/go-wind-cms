import { breakpointsTailwind, useBreakpoints } from '@vueuse/user';

export function useIsMobile() {
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isMobile = breakpoints.smaller('md');
  return { isMobile };
}
