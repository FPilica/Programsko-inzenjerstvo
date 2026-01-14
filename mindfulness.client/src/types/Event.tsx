interface Event {
    eventId: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    organizerId: string;
    contentId?: number;
}

export type { Event };