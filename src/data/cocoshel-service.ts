const cocoshel = require("cocoshel-mongo-storage");

export default class CocoshelService {
  private subscriber: any;
  constructor(mongoConnectionString: string) {
    this.subscriber = new cocoshel.Subscriber(
      cocoshel.db(cocoshel.connect(mongoConnectionString))
    );
  }

  unsubscribe(input: { id: string }): Promise<any> {
    return this.subscriber.unsubscribe(input);
  }
}
