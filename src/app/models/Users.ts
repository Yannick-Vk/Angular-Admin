import {DateTime} from 'luxon';

export interface User {
    id: string;
    username: string;
    email: string;
    expiry: string;
}
