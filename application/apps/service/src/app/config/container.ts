import { Container, interfaces } from "inversify";
import { config } from "../../../../server/src/app/config/service.config";
import { Logger } from "../../../../server/src/app/services/logging/logger";
import { PlatformConstants } from "../../../../server/src/app/services/platform-constants/i-platform-constants";
import { PLATFORM_CONSTANTS } from "../../../../server/src/app/services/platform-constants/platformConstants";
import { ProcessExecutionService } from "../../../../server/src/app/services/process-execution/process-execution-service";
import { ISettingsProvider } from "../../../../server/src/app/services/settings/settings-provider";
import { SettingsService } from "../../../../server/src/app/services/settings/settings-service";
import { SystemMonitoringService } from "../../../../server/src/app/services/system-monitoring/system-monitoring-service";
import { Bootstrapper } from "../core/bootstrapper";
import { WebServer } from "../core/web-server";
import { WebsocketServer } from "../core/websocket-server";
import { AuthenticationMiddleware } from "../middleware/authentication/authentication.middleware";
import { ActivationService } from "../services/activation/activation-service";
import { AutoActivationService } from "../services/activation/auto-activation-service";
import { AdminService } from "../services/admin/admin.service";
import { ActivationStateService } from "../services/application-state/activation-state.service";
import { AuthenticationService } from "../services/authentication/authentication-service";
import { IUserProvider } from "../services/authentication/i-user-provider";
import { DataService } from "../services/data/data-service";
import { Device } from "../services/devices/device";
import { DeviceDetector } from "../services/devices/device-detector";
import { DeviceFactory } from "../services/devices/device-factory";
import { DeviceService } from "../services/devices/device.service";
import { LinuxDeviceDetector } from "../services/devices/linux-device-detector";
import { SimulationDeviceDetector } from "../services/devices/simulation-device-detector";
import { WindowsDeviceDetector } from "../services/devices/windows-device-detector";
import { IdGenerator } from "../services/id-generation/id-generator";
import { NotificationService } from "../services/notifications/notification-service";
import { Scheduler } from "../services/scheduling/scheduler";
import { ISessionRepository } from "../services/sessions/i-session-repository";
import { SessionService } from "../services/sessions/session-service";
import { ProcessShutdownService } from "../services/shutdown/process-shutdown-service";
import { ShutdownService } from "../services/shutdown/shutdown-service";
import { ShutdownSimulationService } from "../services/shutdown/shutdown-simulation-service";
import { UnixShutdownService } from "../services/shutdown/unix-shutdown-service";
import { WindowsShutdownService } from "../services/shutdown/windows-shutdown-service";
import { ConnectionHistoryService } from "../services/statistics/connection-history-service";
import { FileStreamingSourceFactory } from "../services/streaming-sources/file-streaming-source-factory";
import { IStreamingSource } from "../services/streaming-sources/i-streaming-source";
import { StreamingSimulationSourceFactory } from "../services/streaming-sources/streaming-simulation-source-factory";
import { streamingSourceFactory } from "../services/streaming-sources/streaming-source-factory";
import { IStreamRepository } from "../services/streams/i-stream-repository";
import { StreamService } from "../services/streams/stream-service";
import { TimeService } from "../services/time/time.service";
import { FfmpegLogger, ServiceLogger } from "./logging.config";

export const container = new Container();

switch (config.platform) {
  case "linux": {
    container.bind<ShutdownService>("ShutdownService").to(UnixShutdownService);
    container.bind<DeviceDetector>("DeviceDetector").to(LinuxDeviceDetector).inSingletonScope();
    container.bind<PlatformConstants>("PlattformConstants").toConstantValue(PLATFORM_CONSTANTS.linux);
    break;
  }
  case "win32": {
    container.bind<ShutdownService>("ShutdownService").to(WindowsShutdownService);
    container.bind<DeviceDetector>("DeviceDetector").to(WindowsDeviceDetector).inSingletonScope();
    container.bind<PlatformConstants>("PlattformConstants").toConstantValue(PLATFORM_CONSTANTS.win32);
    break;
  }
  default: {
    throw new Error(`OS ${config.platform} is unsupported.`);
  }
}

if (config.executable) {
  container.rebind<ShutdownService>("ShutdownService").to(ProcessShutdownService).inSingletonScope();
}

if (!config.production) {
  container.rebind<ShutdownService>("ShutdownService").to(ShutdownSimulationService);
}

if (config.simulate) {
  container.rebind<DeviceDetector>("DeviceDetector").to(SimulationDeviceDetector).inSingletonScope();
  container.bind<interfaces.Factory<IStreamingSource>>("StreamingSourceFactory").toFactory(StreamingSimulationSourceFactory);
} else if (config.filesource) {
  container.rebind<DeviceDetector>("DeviceDetector").to(SimulationDeviceDetector).inSingletonScope();
  container.bind<interfaces.Factory<IStreamingSource>>("StreamingSourceFactory").toFactory(FileStreamingSourceFactory);
} else {
  container.bind<interfaces.Factory<IStreamingSource>>("StreamingSourceFactory").toFactory(streamingSourceFactory);
}

container.bind<interfaces.Factory<Device>>("DeviceFactory").toFactory(DeviceFactory);

container.bind<IdGenerator>("IdGenerator").to(IdGenerator);
const dataService = new DataService(new Logger(ServiceLogger), new IdGenerator());
container.bind<DataService>("DataService").toConstantValue(dataService);

container.bind<ISessionRepository>("ISessionRepository").toConstantValue(dataService);
container.bind<IStreamRepository>("IStreamRepository").toConstantValue(dataService);
container.bind<ISettingsProvider>("ISettingsProvider").toConstantValue(dataService);
container.bind<IUserProvider>("IUserProvider").toConstantValue(dataService);

container.bind<Bootstrapper>("Bootstrapper").to(Bootstrapper);
container.bind<ProcessExecutionService>("ProcessExecutionService").to(ProcessExecutionService);
container.bind<TimeService>("TimeService").to(TimeService);
container.bind<NotificationService>("NotificationService").to(NotificationService);

container.bind<Logger>("Logger").toConstantValue(new Logger(ServiceLogger));
container.bind<Logger>("FfmpegLogger").toConstantValue(new Logger(FfmpegLogger));
container.bind<string>("FfmpegPath").toConstantValue(config.ffmpegPath);

container.bind<AdminService>("AdminService").to(AdminService).inSingletonScope();
container.bind<StreamService>("StreamService").to(StreamService).inSingletonScope();
container.bind<DeviceService>("DeviceService").to(DeviceService).inSingletonScope();
container.bind<SessionService>("SessionService").to(SessionService).inSingletonScope();
container.bind<SettingsService>("SettingsService").to(SettingsService);
container.bind<WebServer>("WebServer").to(WebServer).inSingletonScope();
container.bind<WebsocketServer>("WebsocketServer").to(WebsocketServer).inSingletonScope();
container.bind<ActivationService>("ActivationService").to(ActivationService).inSingletonScope();
container.bind<ActivationStateService>("ActivationStateService").to(ActivationStateService).inSingletonScope();
container.bind<Scheduler>("Scheduler").to(Scheduler).inSingletonScope();
container.bind<ConnectionHistoryService>("ConnectionHistoryService").to(ConnectionHistoryService).inSingletonScope();
container.bind<SystemMonitoringService>("SystemMonitoringService").to(SystemMonitoringService);
container.bind<AutoActivationService>("AutoActivationService").to(AutoActivationService);

container.bind<AuthenticationService>("AuthenticationService").to(AuthenticationService).inSingletonScope();
container.bind<AuthenticationMiddleware>(AuthenticationMiddleware).to(AuthenticationMiddleware);