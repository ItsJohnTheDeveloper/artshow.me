import { SampleDocument } from "../models/sample";
import { UserDocument } from "../models/user";

export function generateNewSample(
  text: string,
  body: string,
  age: number
): SampleDocument {
  return {
    text,
    body,
    age,
  };
}

export function generateNewUser(
  name: string,
  password: string,
  email: string,
  profilePic: string = ""
): UserDocument {
  return { name, password, email, profilePic };
}
