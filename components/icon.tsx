import type { SVGProps } from "react";
const paths = {
  school: "M3 10 12 5l9 5-9 5-9-5Zm3 2v6c4 3 8 3 12 0v-6M21 10v7",
  home: "m3 10 9-7 9 7v10H3V10Zm6 10v-7h6v7",
  classes: "M3 5h7l2 3h9v12H3V5Z",
  users: "M16 21v-3a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v3m17 0v-3a4 4 0 0 0-3-4M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-7a4 4 0 0 1 0 7",
  book: "M12 5v16m0-16C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1Z",
  task: "M9 4H5v17h14V4h-4M9 2h6v5H9V2Zm-1 9h8m-8 5h5",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  logout: "M9 4H3v16h6m5-13 5 5-5 5M8 12h11",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
  lock: "M5 10h14v11H5V10Zm3 0V6a4 4 0 0 1 8 0v4",
  search: "M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 6 6",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v6l4 2",
  settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2",
  copy: "M9 9h11v11H9V9Zm-5 7H3V4h12v1",
  edit: "m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14v6Z",
  trash: "M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7",
} as const;
export type IconName = keyof typeof paths;
export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>;
}
