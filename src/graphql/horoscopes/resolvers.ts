
import { Context } from '../../context';
import { RandomPhrasesQueryParams } from '@ournet/horoscopes-domain';

export default {
    Query: {
        horoscopes_reportById: (_: any, args: { id: string }, context: Context) => {
            return context.data.horoReportRep.getById(args.id);
        },

        horoscopes_reportsByIds: (_: any, args: { ids: string[] }, context: Context) => {
            return context.data.horoReportRep.getByIds(args.ids);
        },
        horoscopes_phraseById: (_: any, args: { id: string }, context: Context) => {
            return context.data.horoPhraseRep.getById(args.id);
        },
        horoscopes_randomPhrases: (_: any, args: { params: RandomPhrasesQueryParams }, context: Context) => {
            return context.data.horoPhraseRep.random(args.params);
        },
    }
}
