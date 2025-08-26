import type { Params } from "@feathersjs/feathers";

export interface ScrapParams extends Params {
  source?: "user" | "cronjob" | "delete";
}
