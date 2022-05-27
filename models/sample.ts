import { MongoDocument } from "./mongo-document";

export interface SampleDocument extends MongoDocument {
  text: string;
  body: string;
  age: number;
}
