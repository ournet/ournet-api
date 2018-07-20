
import { Data } from '../../data';

export default {
    Query: {
        publicHolidays: (_: any, args: { country: string, lang: string, start?: number, end?: number }) => {
            return Data.holidays(args);
        }
    }
}
