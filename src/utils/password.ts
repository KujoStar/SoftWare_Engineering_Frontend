// eslint-disable-next-line
import { fucking_frontend_hash, init_wasm } from "./mika_kawaii/mika_kawaii";

export const initWasm = () => init_wasm();

export const hashPasswd = (password: string, salt: string) => {
  const b16salt = salt.replaceAll("-", "");
  return fucking_frontend_hash(password, b16salt);
};
