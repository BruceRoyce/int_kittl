import { type ObjectData, ObjectType } from "./engine/objects/Object";

let id = 0;
const getId = (): number => {
  id++;
  return id;
};

/**
 * create some circle objects
 */
const createCircles = (): ObjectData[] => {
  const circles: ObjectData[] = [];
  let row = 40;
  while (row >= 0) {
    let column = 120;
    while (column >= row * 3) {
      circles.push({
        id: getId(),
        type: ObjectType.Circle,
        top: row * 10,
        left: column * 10,
        width: 10,
        height: 10,
        color: "#000000", // black
      });
      column--;
    }
    row--;
  }
  return circles;
};

/**
 * create some circle objects
 */
const createIllustration = (): ObjectData[] => {
  const circles: ObjectData[] = [];
  let row = 6;
  while (row >= 0) {
    let column = 11;
    while (column > (row - 1) * 2) {
      circles.push({
        id: getId(),
        type: ObjectType.Illustration,
        top: 25 + row * 50,
        left: 25 + column * 100,
        width: 50,
        height: 50,
        color: "#f1c40f", // yellow
      });
      column--;
    }
    row--;
  }
  return circles;
};

export const getInitialObjects = (): ObjectData[] => {
  // this resets global id - could be a problem if we have multiple identical ids
  id = 0;
  return [
    {
      id: getId(),
      type: ObjectType.Circle,
      top: 0,
      left: 0,
      width: 400,
      height: 400,
      color: "#f1c40f", // yellow
    },
    {
      id: getId(),
      type: ObjectType.Circle,
      top: 0,
      left: 400,
      width: 400,
      height: 400,
      color: "#3498db", // blue
    },
    ...createCircles(),
    ...createIllustration(),
  ];
};
