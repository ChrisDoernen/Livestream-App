import crypto from "crypto";
import { injectable } from "inversify";
import generate from "nanoid/non-secure/generate";

@injectable()
export class IdGenerator {

  private readonly alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";

  public generateId(length = 10): string {
    return generate(this.alphabet, length);
  }

  public getMd5Hash(value: string, length: number): string {
    const hash = crypto.createHash("md5").update(value).digest("hex");
    return hash.substr(0, length - 1);
  }
}
