import { ObjectType } from "../../objects/Object";

type ValidityReturnType = [boolean, Error | null];

export function isObjectValid(
  objectType: string,
  ...args: string[] | number[]
): ValidityReturnType {
  switch (objectType) {
    case ObjectType.Illustration:
      return isValidIllustation(args[0] as string);
    case ObjectType.Circle:
      return isValidCircle(...(args as number[]));
    default:
      return [false, new Error("Unknown object")];
  }

  function isValidIllustation(path: string): ValidityReturnType {
    const isValid = path.startsWith("M") && path.endsWith("Z");
    return [isValid, isValid ? null : new Error("Invalid Illustration path")];
  }
  function isValidCircle(...sides: number[]): ValidityReturnType {
    const isValid = sides.every((side) => side === sides[0]);
    return [
      isValid,
      isValid ? null : new Error("Circle width and height must be equal"),
    ];
  }
}

export function doesDarwAnything({
  width,
  height,
}: {
  width: number;
  height: number;
}): boolean {
  return width !== 0 && height !== 0;
}
