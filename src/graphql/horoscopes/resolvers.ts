import { Context } from "../../context";
import {
  GenerateReportUseCase,
  HoroscopesHelper,
  HoroscopeSign,
  Report
} from "@ournet/horoscopes-domain";

export default {
  Query: {
    horoscopes_reportById: (
      _: any,
      { id }: { id: string },
      context: Context
    ) => {
      return context.data.horoReportRep.getById(id);
    },

    horoscopes_reportsByIds: (
      _: any,
      args: { ids: string[] },
      context: Context
    ) => {
      if (!args.ids.length) return [];
      return context.data.horoReportRep.getByIds(args.ids);
    },

    horoscopes_phraseById: (_: any, args: { id: string }, context: Context) => {
      return context.data.horoPhraseRep.getById(args.id);
    },

    horoscopes_phraseList: async (
      _: any,
      args: { params: { lang: string; limit: number; offset?: number } },
      context: Context
    ) => {
      const list = await context.data.horoPhraseRep.list(args.params);
      const offset = args.params.offset || 0;
      return list.map((it, i) => ({ iid: i + offset + 1, ...it }));
    },

    horoscopes_generateReports: async (
      _: any,
      args: { params: { lang: string; period: string } },
      context: Context
    ) => {
      const list: Report[] = [];
      const generate = new GenerateReportUseCase(
        context.data.horoPhraseRep,
        context.data.horoReportRep
      );
      for (const sign of [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
      ] as HoroscopeSign[]) {
        const report = await generate
          .execute({
            lang: args.params.lang,
            period: args.params.period,
            sign
          })
          .catch((error) => {
            if (!error.message.includes("E11000")) throw error;
            return context.data.horoReportRep.getById(
              HoroscopesHelper.createReportId(
                args.params.period,
                args.params.lang,
                sign
              )
            );
          });
        if (report) list.push(report);
      }

      return list;
    }
  },
  HoroscopeReport: {
    phrases: (report: Report, _: any, context: Context) => {
      return context.data.horoPhraseRep.getByIds(report.phrasesIds);
    }
  }
};
