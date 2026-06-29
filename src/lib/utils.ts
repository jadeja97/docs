import { isObj } from "@jadeja/ts/lib/types";

import type { NestedObject, Primitive } from "@jadeja/ts/types/data";

/**
 * get nested value of field from the object with dotted key
 *
 * @param document - nested object
 * @param field - dotted key for nested field
 */
export const getNestedValue = (
  document: NestedObject<Primitive>,
  field: string,
): Primitive | NestedObject<Primitive> => {
  //
  if (!field.includes(".")) {
    return document[field];
  }

  // oxlint-disable-next-line unicorn/no-array-reduce
  return field.split(".").reduce((doc: Primitive | NestedObject<Primitive>, key: string) => {
    //
    if (isObj(doc) && key in doc) {
      return doc[key];
    } else if (!isObj(doc)) {
      return doc;
    }
    return null;
  }, document);
};
