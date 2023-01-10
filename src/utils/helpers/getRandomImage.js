const staticImages = [
  "art1.png",
  "art2.jpg",
  "art3.jpg",
  "art4.jpeg",
  "art5.webp",
  "art6.jpg",
  "art7.jpg",
  "art8.jpg",
];

export const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * staticImages.length);
  return `/gallery/${staticImages[randomIndex]}`;
};
