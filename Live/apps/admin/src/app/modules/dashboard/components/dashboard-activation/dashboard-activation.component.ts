import { Component } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Logger } from "@live/services";
import { ActivationService } from "../../../../services/activation/activation.service";
import { SessionService } from "../../../../services/session/session.service";
import { ActivationDeletionDialogComponent } from "../activation-deletion-dialog/activation-deletion-dialog.component";

@Component({
  selector: "dashboard-activation",
  templateUrl: "./dashboard-activation.component.html",
  styleUrls: ["./dashboard-activation.component.scss"]
})
export class DashboardActivationComponent {

  constructor(
    private readonly _logger: Logger,
    public readonly activationService: ActivationService,
    public readonly activationDeletionDialog: MatDialog,
    public readonly sessionService: SessionService) {
  }

  public openActivationDeletionDialog(): void {
    const dialogRef = this.activationDeletionDialog.open(ActivationDeletionDialogComponent, { width: "250px", restoreFocus: false });

    dialogRef.afterClosed().toPromise().then((result) => {
      this._logger.info(`The dialog was closed, result: ${result}`);

      if (result) {
        this.activationService.deleteActivation();
      }
    });
  }
}
