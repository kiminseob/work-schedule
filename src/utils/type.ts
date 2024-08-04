type Type =
  | "String"
  | "Number"
  | "Boolean"
  | "Null"
  | "Undefined"
  | "Object"
  | "Array"
  | "Date"
  | "RegExp"
  | "Function";

export const getType = (target: any) => {
  return Object.prototype.toString.call(target).slice(8, -1) as Type;
};

export const isObject = <T extends any>(
  target: any
): target is Record<string, T> => {
  return getType(target) === "Object";
};

export const isArray = (target: any): target is [] => {
  return getType(target) === "Array";
};
