interface Event {
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    description: string;
    userId: string;
    contentId?: string;
}

export type { Event };