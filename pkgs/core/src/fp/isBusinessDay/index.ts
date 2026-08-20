// This file is generated automatically by `scripts/build/fp.ts`. Please, don't change it.

import { isBusinessDay as fn } from "../../isBusinessDay/index.ts";
import { convertToFP } from "../_lib/convertToFP/index.ts";

export const isBusinessDay = convertToFP(fn, 1);
