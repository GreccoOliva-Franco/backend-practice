export class ObjectUtils {
  static pick<Obj>(obj: Obj, keys: (keyof Obj)[]) {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => (keys as string[]).includes(key)),
    );
  }

  // static omit<Obj>(obj: Obj, keys)
}
