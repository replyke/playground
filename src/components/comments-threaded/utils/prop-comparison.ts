import { isDevelopment } from "@replyke/react-js";

export function shallowEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) return true;

  if (!obj1 || !obj2 || typeof obj1 !== "object" || typeof obj2 !== "object") {
    return false;
  }

  const o1 = obj1 as Record<string, unknown>;
  const o2 = obj2 as Record<string, unknown>;
  const keys1 = Object.keys(o1);
  const keys2 = Object.keys(o2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!(key in o2) || o1[key] !== o2[key]) return false;
  }

  return true;
}

export function deepEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return obj1 === obj2;
  if (typeof obj1 !== typeof obj2) return false;
  if (typeof obj1 !== "object") return obj1 === obj2;

  const o1 = obj1 as Record<string, unknown>;
  const o2 = obj2 as Record<string, unknown>;

  if (Array.isArray(o1) !== Array.isArray(o2)) return false;

  const keys1 = Object.keys(o1);
  const keys2 = Object.keys(o2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!(key in o2)) return false;
    if (!deepEqual(o1[key], o2[key])) return false;
  }

  return true;
}

export function warnPropChanges(
  componentName: string,
  prevProps: Record<string, unknown>,
  nextProps: Record<string, unknown>,
  propNames: string[]
): void {
  if (!isDevelopment()) return;

  for (const propName of propNames) {
    const prevValue = prevProps[propName];
    const nextValue = nextProps[propName];

    if (prevValue !== nextValue && !deepEqual(prevValue, nextValue)) {
      console.warn(
        `[${componentName}] Prop '${propName}' changed but has the same content. ` +
          `Consider memoizing this prop to prevent unnecessary re-renders.`,
        { prevValue, nextValue }
      );
    }
  }
}
