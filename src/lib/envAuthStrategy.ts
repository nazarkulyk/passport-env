import { Strategy } from 'passport';

const DEFAULT_STRATEGY_NAME = 'env-auth';

export interface ForwardAuthStrategyOptions {
  name?: string;
  envVariables: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DoneCallback = (error: Error, user?: Record<string, unknown>, info?: any) => void;

export interface VerifyEnvVariables {
  [key: string]: string;
}

export type VerifyFunction = (verifyEnvVariables: VerifyEnvVariables, done: DoneCallback) => void;

/**
 * ENV-Auth Passport Strategy for express authentication behind forward-auth.
 * @extends Strategy
 */
export class EnvAuthStrategy extends Strategy {
  private verify?: VerifyFunction;

  private envVariables: string[];

  /**
   * The ForwardAuthStrategy constructor.
   *
   * Optionally an `options` object can be passed to custom configure the Strategy.
   * options = {
   *  name: String - The name of the strategy, defaults to 'forward-auth'
   *  passReqToCallback: Boolean - When true `req` is the first argument to the
   *                                  verify callback, defaults to false
   * }
   *  @param {Object} options
   *  @param {Function} verify
   */
  constructor(options?: ForwardAuthStrategyOptions, verify?: VerifyFunction) {
    // Allows verify to be passed as the first parameter and options skipped
    let settings: ForwardAuthStrategyOptions = {
      envVariables: []
    };

    super();

    if (typeof options === 'function') {
      this.verify = options;
    } else {
      settings = options || settings;
      this.verify = verify;
    }

    this.name = settings.name || DEFAULT_STRATEGY_NAME;
    this.envVariables = settings.envVariables;
  }

  /**
   * Authenticate request. Always authenticates successfully by default
   * unless instructed otherwise through `verify` callback that was
   * passed to the constructor.
   *
   * @param {Object} req
   */
  public authenticate(): void {
    if (!this.verify) {
      return this.fail('No verify function was specified!');
    }

    const verified: DoneCallback = (error, user, info) => {
      console.log(error, user, info);
      if (error) {
        console.error('error on auth');
        return this.error(error);
      }

      if (!user) {
        console.error('fail on auth');
        return this.fail(info);
      }

      console.info('success on auth');
      return this.success(user, info);
    };

    const foundVariables = this.envVariables.map((key) => ({ key, value: process.env[key] })).reduce((result, { key, value }) => (value ? { ...result, [key]: value } : result), {});

    try {
      return this.verify(foundVariables, verified);
    } catch (e) {
      return this.error(e);
    }
  }
}
