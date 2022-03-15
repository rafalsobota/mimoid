export type APIPlace = {
  profiles: {
    [uid: string]: {
      name: string,
    }
  }
  positions: {
    [uid: string]: APIPosition
  }
}

export type APIPosition = {
  start: APITimeSpacePoint,
  end: APITimeSpacePoint,
}

export type APITimeSpacePoint = { x: number, y: number, z: number, t: number };
