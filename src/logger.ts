export interface ILogger {
  error(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
}

export const logger: ILogger = {
  error: function (message?: any, ...optionalParams: any[]): void {
    logger.error(message, ...optionalParams);
  },
  info: function (message?: any, ...optionalParams: any[]): void {
    logger.info(message, ...optionalParams);
  },
  warn: function (message?: any, ...optionalParams: any[]): void {
    logger.warn(message, ...optionalParams);
  }
};
