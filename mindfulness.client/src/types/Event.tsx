interface Event {
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    description: string;
    userId: string;
    contentId?: number;
}

export type { Event };