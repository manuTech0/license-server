import { verify } from "argon2";
import { ENV_SERVER } from "./schema/env.schema";

const hash =
  "$argon2id$v=19$m=80,t=3,p=4$uy27QaVvJBBZkPB9ruWD2g$3AOH5++dDuU1g1TpNSNVWWAza/I9d0qYSsAM3sVckLE";
const password = "bf9bce7@0#d873#c28e071263e#15f0#082d1";

console.log(
  await verify(hash, password, {
    secret: Buffer.from(ENV_SERVER.PASSWORD_SECRET, "utf8"),
  }),
);
