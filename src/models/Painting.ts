import { MongoDocument } from "./mongo-document";

export interface PaintingDocument extends MongoDocument {
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  width?: number;
  height?: number;
  sizeUnit?: "in" | "cm";
  showPrice: boolean;
  price?: number;
  description?: string;
  userId: string;
  collectionIds?: string[];
}

export interface Painting extends PaintingDocument {
  id: string;
  collections?: [
    {
      label: string;
      value: string;
    }
  ];
}

export type EditPaintingForm = Omit<
  Painting,
  "createdAt" | "updatedAt" | "userId" | "_id" | "id"
>;
