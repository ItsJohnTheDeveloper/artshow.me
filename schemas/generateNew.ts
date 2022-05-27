import { SampleDocument } from "../models/sample";

export function generateNewSample(
  text: string,
  body: string,
  age: number
): SampleDocument {
  return {
    text: text,
    body: body,
    age: age,
  };
}
