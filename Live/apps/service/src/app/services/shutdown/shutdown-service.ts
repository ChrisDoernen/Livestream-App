import { Shutdown } from "@live/entities";
import { inject, injectable } from "inversify";
import { Logger } from "../logging/logger";
import { Scheduler } from "../scheduling/scheduler";

/**
 * Base class for machine shutdown
 */
@injectable()
export abstract class ShutdownService {

  private _shutdown: Shutdown = null;
  private _shutdownJobId: string;

  constructor(
    @inject("Logger") protected logger: Logger,
    @inject("Scheduler") private readonly _scheduler: Scheduler) {
  }

  public setShutdown(shutdown: Shutdown): void {
    this.logger.debug(`Receiving new shutdown: ${JSON.stringify(shutdown)}.`);

    if (this._shutdown) {
      this.cancelShutdown();
    }

    if (shutdown.shutdownTime) {
      this._shutdownJobId = this._scheduler.schedule(new Date(shutdown.shutdownTime), this.shutdown.bind(this));
      this._shutdown = shutdown;
    } else {
      this.executeShutdown();
    }
  }

  public getShutdown(): Shutdown {
    return this._shutdown;
  }

  private shutdown(): void {
    this._shutdown = null;
    this.executeShutdown();
  }

  protected abstract executeShutdown(): void;

  public cancelShutdown(): void {
    if (!this._shutdown) {
      this.logger.warn("Can not cancel shutdown, no shutdown existing.");
    }

    this._scheduler.cancelJob(this._shutdownJobId);
    this._shutdown = null;
    this.logger.debug("Shutdown canceled.");
  }
}