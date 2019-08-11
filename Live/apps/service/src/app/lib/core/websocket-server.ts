import { Logger } from "../logging/logger";
import { injectable, inject } from "inversify";
import * as socketio from "socket.io";
import { Socket } from "socket.io";
import { ENDPOINTS, EVENTS } from "@live/constants";
import { ConnectionHistoryService } from "../statistics/connection-history-service";
import { ClientInfo } from "../statistics/client-info";

@injectable()
export class WebsocketServer {
  private _websocketServer: any;

  /** The currently available streams that are represented as rooms in socket.io */
  private _streams: string[] = [];

  constructor(
    @inject("Logger") private _logger: Logger,
    @inject("ConnectionHistoryService") private _connectionHistoryService: ConnectionHistoryService) {
  }

  public initializeAndListen(server: any): void {
    const websocketServer = socketio(server, { path: ENDPOINTS.websocket });

    websocketServer.on("connection", this.onConnection.bind(this));
    this._websocketServer = websocketServer;
    this._logger.info("Websocket server started.");
  }

  private onConnection(socket: Socket): void {
    this.onConnect(socket);

    socket.on(EVENTS.subscribe, streamId => {
      this.onSubscribeToStream(socket, streamId);
    });

    socket.on(EVENTS.unsubscribe, streamId => {
      this.onUnsubscribeFromStream(socket, streamId);
    });

    socket.on(EVENTS.subscribeAdmin, () => {
      this.onSubscribeAdmin(socket);
    });

    socket.on(EVENTS.unsubscribeAdmin, () => {
      this.onUnsubscribeAdmin(socket);
    });

    socket.on("disconnect", () => {
      this.onDisconnect(socket);
    });
  }

  private onSubscribeToStream(socket: Socket, streamId: any): void {
    const id = this._streams.find(stream => stream === streamId);

    if (!id) {
      this._logger.info(`Subscription for stream ${id} not possible, stream is not started.`);
      socket.emit(EVENTS.subscriptionError, "The stream is not started.");
    } else {
      socket.join(id);

      const clientInfo = this.getClientInfo(socket, streamId);
      this._connectionHistoryService.clientSubscribed(clientInfo);
    }
  }

  private onUnsubscribeFromStream(socket: Socket, streamId: string): void {
    socket.leave(streamId);
    const clientInfo = this.getClientInfo(socket);
    this._connectionHistoryService.clientUnsubscribed(clientInfo);
  }

  private onSubscribeAdmin(socket: Socket): void {
    socket.join("admin");
    this._logger.debug("Admin subscribed.");
  }

  private onUnsubscribeAdmin(socket: Socket): void {
    socket.leave("admin");
    this._logger.debug("Admin unsubscribed.");
  }

  private onConnect(socket: Socket): void {
    const clientInfo = this.getClientInfo(socket);
    this._connectionHistoryService.clientConnected(clientInfo);
  }

  private onDisconnect(socket: Socket): void {
    const clientInfo = this.getClientInfo(socket);
    this._connectionHistoryService.clientDisconnected(clientInfo);
  }

  public addStream(id: string): void {
    this._streams.push(id);
  }

  public removeStream(id: string): void {
    const index = this._streams.indexOf(id);
    if (index > -1) {
      this._streams.slice(index, 1);
    }
  }

  public emitStreamData(streamId: string, data: Buffer): void {
    this._websocketServer.to(streamId).emit(streamId, data);
  }

  public emitStreamEventMessage(streamId: string, event: string, message: string): void {
    this._websocketServer.to(streamId).emit(event, message);
  }

  public emitAdminEventMessage(event: string, message: string): void {
    this._websocketServer.to("admin").emit(event, message);
  }

  private getClientInfo(socket: Socket, streamId?: string): ClientInfo {
    const clientIpAddress = socket.handshake.address;
    const userAgent = socket.request.headers["user-agent"];

    return {
      ipAddress: clientIpAddress,
      userAgent: userAgent,
      streamId: streamId
    }
  }
}
