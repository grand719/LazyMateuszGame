class Log {
  private static instance: Log;
  private constructor() {}

  info(TAG: string, ...Args: any[]) {
    console.info(TAG + ": ", ...Args);
  }

  debug(TAG: string, ...Args: any[]) {
    console.debug(TAG + ": ", ...Args);
  }

  error(TAG: string, ...Args: any[]) {
    console.error(TAG + ": ", ...Args);
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new Log();

    return this.instance;
  }
}

export default Log.getInstance();
