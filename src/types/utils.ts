/**
 * extract element type from array
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;
