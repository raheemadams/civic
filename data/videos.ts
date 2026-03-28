export interface CivicVideo {
  id: string;
  title: string;
  location: string;
  duration: string;
  category: string;
  seed: number; // picsum seed for consistent thumbnails
}

export const civicVideos: CivicVideo[] = [
  {
    id: "v1",
    title: "Landmark Elections: Lagos 2023",
    location: "Lagos State",
    duration: "12:34",
    category: "Elections",
    seed: 10,
  },
  {
    id: "v2",
    title: "Federal Roads: Who Is Responsible?",
    location: "Abuja, FCT",
    duration: "8:17",
    category: "Infrastructure",
    seed: 20,
  },
  {
    id: "v3",
    title: "Young Nigerians Building the Future",
    location: "Kano State",
    duration: "15:02",
    category: "Youth",
    seed: 30,
  },
  {
    id: "v4",
    title: "Education Crisis: Empty Classrooms",
    location: "Borno State",
    duration: "10:45",
    category: "Education",
    seed: 40,
  },
  {
    id: "v5",
    title: "Port Harcourt: Oil Wealth, Shared Poverty",
    location: "Rivers State",
    duration: "18:23",
    category: "Economy",
    seed: 50,
  },
  {
    id: "v6",
    title: "Women Leading Change Across the Niger Delta",
    location: "Delta State",
    duration: "9:58",
    category: "Leadership",
    seed: 60,
  },
  {
    id: "v7",
    title: "Healthcare on Zero Budget: Anambra Hospitals",
    location: "Anambra State",
    duration: "13:11",
    category: "Health",
    seed: 70,
  },
  {
    id: "v8",
    title: "Tech Hubs Replacing Broken Government Systems",
    location: "Lagos State",
    duration: "11:30",
    category: "Technology",
    seed: 80,
  },
];
