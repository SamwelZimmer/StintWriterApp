export type Timestamp = {
    seconds: number;
    nanoseconds: number;
};

export interface Stint {
    id: string;
    title: string;
    endDate: Timestamp;
    startDate: Timestamp; 
    numberOfDays: number;
    entries: string[];
};

export type CategorisedStints = {
    upcoming: Stint[];
    active: Stint[];
    past: Stint[];
};

export type UserInfo = {
    authProvider: string;
    email: string;
    name: string;
    uid: string;
};