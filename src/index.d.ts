import Application from "./framework/Application";

declare global {
  interface Window {
    GetApplication?: () => Application;
  }
}
