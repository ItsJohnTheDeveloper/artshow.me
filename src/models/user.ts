import { MongoDocument } from "./mongo-document";

export interface UserDocument extends MongoDocument {
  name: string;
  password: string;
  email: string;
  profilePic?: string;
}
