import { Context } from "../../context";
import { HolidaysGetParams } from "../../data/holiday-repository";

export default {
  Query: {
    publicHolidays: (_: any, args: HolidaysGetParams, context: Context) => {
      return context.data.holidayRep.get(args);
    }
  }
};
