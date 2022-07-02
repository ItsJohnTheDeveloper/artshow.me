import { MongoDocument } from "./mongo-document";

export interface CollectionDocument extends MongoDocument {
  name: string;
  userId: string;
  published: boolean;
  //   paintings: object[];
}

export interface Collection extends CollectionDocument {
  id: string;
}
