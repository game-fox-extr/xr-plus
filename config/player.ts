type PlayerControls = {
  maxVelLimit: number;
  fallingGravityScale: number;
  jumpVel: number;
  camFollowMult: number;
  mode: string;
};

export const PLAYER_CONTROLS_CONFIG: PlayerControls = {
  maxVelLimit: 2.5,
  fallingGravityScale: 2.5,
  jumpVel: 3,
  camFollowMult: 1000,
  mode: "PointToMove" as const,
};
