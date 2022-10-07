import { MongoDocument } from "./mongo-document";

export interface PaintingDocument extends MongoDocument {
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  width?: number;
  height?: number;
  sizeUnit?: string;
  showPrice: boolean;
  price?: number;
  description?: string;
  userId: string;
  collectionIds?: string[];
}

export interface Painting extends PaintingDocument {
  id: string;
}

export type EditPaintingForm = Omit<
  Painting,
  "createdAt" | "updatedAt" | "userId" | "collectionIds" | "_id" | "id"
>;
