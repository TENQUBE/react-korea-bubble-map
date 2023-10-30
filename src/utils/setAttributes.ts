import { BaseType } from "d3";

export function setAttributes(
  element: d3.Selection<BaseType, unknown, any, any>,
  attrs: Record<string, string>
) {
  Object.keys(attrs).forEach((key) => element.attr(key, attrs[key]));
}
