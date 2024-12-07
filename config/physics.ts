type Physics_Config = {
    timeStep: number | 'vary' | undefined,
    interpolate: boolean
}

export const PHYSICS_CONFIG : Physics_Config = {
    timeStep: "vary" as const,
    interpolate: true,
  };