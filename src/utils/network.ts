import { OkResp, Resp } from "@data/interface";

export const isOk = <T>(resp: Resp<T>): resp is OkResp<T> => 200 <= resp.status && resp.status < 300;

export const uploadVideo = async <T>(
  url: string,
  data: { video: File },
  auth: string,
): Promise<Resp<T>> => {
  // TODO: send file without multipart/form-data
  const form = new FormData();
  form.append("video", data.video);
  const response = await fetch(
    url,
    {
      method: "POST",
      headers: { "Authorization": `Bearer ${auth}` },
      body: form,
    },
  );

  let res;
  try {
    res = await response.json();
  } catch (e) {
    res = null;
  }

  return {
    status: response.status,
    data: res,
  };
};

export const upload = async <T>(
  url: string,
  data: { image: File, watermarked?: number },
  auth: string,
): Promise<Resp<T>> => {
  // TODO: send file without multipart/form-data
  const form = new FormData();
  form.append("image", data.image);
  if (data.watermarked) { form.append("watermarked", `${data.watermarked}`); }
  const response = await fetch(
    url,
    {
      method: "POST",
      headers: { "Authorization": `Bearer ${auth}` },
      body: form,
    },
  );

  let res;
  try {
    res = await response.json();
  } catch (e) {
    res = null;
  }

  return {
    status: response.status,
    data: res,
  };
};

export const request = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  data?: object | null,
  auth?: string,
): Promise<Resp<T>> => {
  const headers: Record<string, string> = {};

  let body;

  if (method !== "GET" && data) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  }

  if (typeof auth !== "undefined") {
    headers["Authorization"] = `Bearer ${auth}`;
  }

  const response = await fetch(url, { method, headers, body });

  let res;
  try {
    res = await response.json();
  } catch (e) {
    res = null;
  }

  return {
    status: response.status,
    data: res,
  };
};

export type TFetcher<T> = { status: number, data: T };

export const fetcher = async (key: { url: string, jwt?: string }) => {
  const resp = await fetch(key.url,
    typeof key.jwt === "string" ?
      { headers: new Headers({ Authorization: `Bearer ${key.jwt}` }) }
      :
      undefined);

  let res;
  try {
    res = await resp.json();
  } catch (e) {
    res = null;
  }

  if (!resp.ok) {
    throw {
      status: resp.status,
      msg: res.msg,
    };
  }

  return {
    status: resp.status,
    data: res,
  };
};
