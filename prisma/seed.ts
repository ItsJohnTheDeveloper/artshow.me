import { Painting, PrismaClient } from "@prisma/client";
import GalleryDataMock from "../src/mock/gallery.json";
import ProfileDataMock from "../src/mock/profile-pics.json";

const prisma = new PrismaClient();
const testUserId = "6293dca2d671e0ad7d7878ea";

interface RandomPainting {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

const createMockPainting = (userId: string) => {
  const paintingRange = Math.floor(Math.random() * GalleryDataMock.length) + 0;
  const ranPainting: RandomPainting = GalleryDataMock[paintingRange];

  const painting: Omit<
    Painting,
    "id" | "createdAt" | "updatedAt" | "showPrice" | "price"
  > = {
    name: `Painting #${ranPainting.id}`,
    description: "Random painting from mock data",
    image: ranPainting.url,
    width: ranPainting.width,
    height: ranPainting.height,
    sizeUnit: "in",
    userId,
    collectionIds: [],
  };
  return painting;
};

const ClearExistingData = async () => {
  // Delete ALL Users (except for my main testing user)
  await prisma.user.deleteMany({ where: { id: { not: testUserId } } });
  await prisma.painting.deleteMany({
    where: { userId: { not: testUserId } },
  });
  await prisma.collection.deleteMany({
    where: {
      userId: { not: testUserId },
    },
  });
  await prisma.painting.updateMany({
    data: {
      collectionIds: {
        set: [],
      },
    },
  });
};

const GenerateTestUsers = async (qty) => {
  const a = ["Small", "Chirpy", "Ugly", "Blue"];
  const b = ["Hilarious", "Evil", "Pretty", "Godly"];
  const c = ["Bear", "Dog", "Banana", "Tuple"];

  const mockUsers = [];
  for (let i = 1; i < qty; i++) {
    const email = Math.round(Math.random() * 100000) + "@email.com";
    const name =
      a[Math.floor(Math.random() * a.length)] +
      b[Math.floor(Math.random() * b.length)] +
      c[Math.floor(Math.random() * c.length)];

    // Generate random profile picture and cover picture from mock data
    const profileMockRange =
      Math.floor(Math.random() * ProfileDataMock.length) + 0;
    const mockProfile = ProfileDataMock[profileMockRange];

    const paintingRange =
      Math.floor(Math.random() * GalleryDataMock.length) + 0;
    const ranPainting: RandomPainting = GalleryDataMock[paintingRange];

    mockUsers.push({
      email,
      name,
      password: "password",
      bio: `Sample user #${mockProfile.id}`,
      coverPic: ranPainting.url,
      profilePic: mockProfile.url,
    });
  }

  try {
    return mockUsers.forEach(
      async (user) => await prisma.user.create({ data: user })
    );
  } catch (err) {
    console.log("[ERROR] Seeding users: ", err);
  }
};

const GenerateTestPaintings = async () => {
  const paintingsPerUser = 21;
  try {
    const allUsers = await prisma.user.findMany({
      where: { id: { not: testUserId } },
    });
    return allUsers.forEach(
      async (user) =>
        await prisma.painting.createMany({
          data: [...Array(paintingsPerUser)].map(() =>
            createMockPainting(user.id)
          ),
        })
    );
  } catch (err) {
    console.log("[ERROR] Seeding paintings: ", err);
  }
};

const GenerateTestCollections = async () => {
  const mockCollection = (index, userId) => ({
    name: `Collection #${index}`,
    userId,
  });

  try {
    const allUsers = await prisma.user.findMany({
      where: { id: { not: testUserId } },
    });
    return allUsers.forEach(
      async (user) =>
        await prisma.collection.createMany({
          data: [
            mockCollection(1, user.id),
            mockCollection(2, user.id),
            mockCollection(3, user.id),
          ],
        })
    );
  } catch (err) {
    console.log("[ERROR] Seeding collections: ", err);
  }
};

const AddUserPaintingToUserCollections = async () => {
  const allUsers = await prisma.user.findMany({
    where: { id: { not: testUserId } },
  });

  const allPaintings = await prisma.painting.findMany({
    where: { userId: { not: testUserId } },
  });

  const allCollections = await prisma.collection.findMany({
    where: { userId: { not: testUserId } },
  });

  allUsers.forEach(async (user) => {
    const userPaintings = allPaintings.filter(
      (painting) => painting.userId === user.id
    );
    const userCollections = allCollections.filter(
      (collection) => collection.userId === user.id
    );

    const paintingCollectionMap = userPaintings.map((painting) => {
      const randomCollectionIndex =
        Math.floor(Math.random() * userCollections.length) + 0;
      const randomCollection = userCollections[randomCollectionIndex];
      return {
        paintingId: painting.id,
        collectionId: randomCollection.id,
      };
    });

    paintingCollectionMap.forEach(async (map) => {
      await prisma.painting.update({
        where: { id: map.paintingId },
        data: {
          collectionIds: {
            push: map.collectionId,
          },
        },
      });
    });
  });
};

const seed = async () => {
  await ClearExistingData();
  setTimeout(async () => await GenerateTestUsers(10), 500);
  setTimeout(async () => await GenerateTestPaintings(), 1000);
  setTimeout(async () => await GenerateTestCollections(), 1500);
  setTimeout(async () => await AddUserPaintingToUserCollections(), 2000);
};

seed();
