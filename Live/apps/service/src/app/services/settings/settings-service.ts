import { injectable, inject } from "inversify";
import { Logger } from "../logging/logger";
import { SettingsEntity } from "@live/entities";
import { ISettingsProvider } from "./i-settings-provider";
import { SessionService } from "../sessions/session-service";

@injectable()
export class SettingsService {
  constructor(
    @inject("Logger") private _logger: Logger,
    @inject("ISettingsProvider") private _settingsProvider: ISettingsProvider,
    @inject("SessionService") private _sessionService: SessionService) {
  }

  public getSettings(): SettingsEntity {
    return this._settingsProvider.getSettings();
  }

  public async updateSettings(settings: SettingsEntity): Promise<SettingsEntity> {
    this._logger.info(`Received new settings: ${JSON.stringify(settings)}.`);
    this.validateSettings(settings);

    return await this._settingsProvider.updateSettings(settings);
  }

  private validateSettings(settings: SettingsEntity): void {
    try {
      this._sessionService.validateSessionExists(settings.defaultSession);
    } catch (error) {
      this._logger.debug(`Validation failed: ${error}.`);
    }
  }
}