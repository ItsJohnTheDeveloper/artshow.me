import { Collection } from "./Collection";
import { MongoDocument } from "./mongo-document";

export interface ArtistDocument extends MongoDocument {
  email: string;
  name: string;
  password: string;
  profilePic?: string;
  coverPic?: string;
  bio?: string;
  refreshTokens?: string[];
  createdAt: Date;
  updatedAt: Date;
  collections?: Collection[];
}

export interface Artist extends ArtistDocument {
  id: string;
}
