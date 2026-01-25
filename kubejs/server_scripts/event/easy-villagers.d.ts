export type EasyVillagersContext = {
  placedBlocks: Record<string, EasyVillagersPlacedBlockContext>;
  droppedItemsQueue: Internal.Entity[];
};

export type EasyVillagersBlockPosition = {
  dimension: string;
  x: number;
  y: number;
  z: number;
};

export type EasyVillagersBlockOwner = {
  uuid: string;
  type: string;
};

export type EasyVillagersPlacedBlockContext = {
  owner: EasyVillagersBlockOwner | null;
  blockId: string;
  placedAt: number;
  position: EasyVillagersBlockPosition;
};
