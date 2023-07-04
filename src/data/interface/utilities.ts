export interface ResultInfo {
  url: string;
  type: "convert" | "resolution" | "watermark";
  finishTime: number;
  fileType: "gif" | "jpeg" | "png";
  expiredTime: number;
}
