export type EnhancedCelestialsEventId = "enhancedcelestials.name.blood_moon" | "enhancedcelestials.name.super_blood_moon" | "enhancedcelestials.name.blue_moon" | "enhancedcelestials.name.super_blue_moon" | "enhancedcelestials.name.harvest_moon" | "enhancedcelestials.name.super_harvest_moon";
export type MoonType = "blood_moon" | "blue_moon" | "harvest_moon";
export type EnhancedCelestialsContext = {
    isLunarEventActive: boolean;
    moonType: MoonType | null;
    isSuperMoon: boolean;
    eventId: EnhancedCelestialsEventId | null;
}