import { Nominee } from "@/types";

const avatar = (name: string, bg: string) =>
  `https://ui-avatars.com/api/?background=${bg}&color=fff&bold=true&size=256&name=${encodeURIComponent(name)}`;

export const nominees: Nominee[] = [
  {
    id: "n1",
    name: "Ngozi Okonjo-Iweala",
    achievement: "WTO Director-General · 2× Finance Minister",
    field: "Economics",
    state: "Delta",
    lga: "Ogwashi-Uku",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Ngozi_Okonjo-Iweala_takes_over_as_new_WTO_Director-General%2C_1_March_2021_%2850993534756%29_%28cropped%29.jpg",
  },
  {
    id: "n2",
    name: "Akinwumi Adesina",
    achievement: "President, African Development Bank",
    field: "Agriculture & Finance",
    state: "Oyo",
    lga: "Iseyin",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/64/Akinwumi_Adesina_-_2014_%28cropped%29.jpg",
  },
  {
    id: "n3",
    name: "Amina J. Mohammed",
    achievement: "UN Deputy Secretary-General",
    field: "International Development",
    state: "Gombe",
    lga: "Gombe",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c9/UN_Deputy_Secretary_General_Amina_J._Mohammed_%283x4_cropped%29.jpg",
  },
  {
    id: "n4",
    name: "Oby Ezekwesili",
    achievement: "Co-founder, Transparency International · #BBOG",
    field: "Governance & Anti-Corruption",
    state: "Anambra",
    lga: "Onitsha North",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Obiageli_Katryn_Ezekwesili%2C_2009_World_Economic_Forum_on_Africa.jpg",
  },
  {
    id: "n5",
    name: "Temie Giwa-Tubosun",
    achievement: "Founder LifeBank · Saves lives daily with blood delivery",
    field: "Healthcare Innovation",
    state: "Lagos",
    lga: "Lagos Island",
    imageUrl: avatar("Temie Giwa-Tubosun", "be185d"),
  },
  {
    id: "n6",
    name: "Funke Opeke",
    achievement: "CEO MainOne · Built West Africa's first private fibre cable",
    field: "Technology & Infrastructure",
    state: "Lagos",
    lga: "Apapa",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/22/Funke_Opeke_-_ITU_Telecom_World_2016_-_Industry_Leaders_Roundtable_%28cropped%29.jpg",
  },
  {
    id: "n7",
    name: "Oluyinka Olutoye",
    achievement: "Pioneer fetal surgeon — operated on a baby still in the womb",
    field: "Medicine",
    state: "Ekiti",
    lga: "Ado-Ekiti",
    imageUrl: avatar("Oluyinka Olutoye", "dc2626"),
  },
  {
    id: "n8",
    name: "Philip Emeagwali",
    achievement: "Computing Pioneer · Gordon Bell Prize Winner",
    field: "Technology",
    state: "Delta",
    lga: "Ika South",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Philip_Emeagwali_with_scribbled_Exxon-Mobil_equations.jpg",
  },
  {
    id: "n10",
    name: "Wole Soyinka",
    achievement: "Nobel Laureate · Lifelong activist for freedom & justice",
    field: "Literature & Activism",
    state: "Ogun",
    lga: "Abeokuta South",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/78/Wole_Soyinka_in_2018_%283x4_cropped%29.jpg",
  },
];

// All unique states represented, for the filter bar
export const nomineeStates = [...new Set(nominees.map((n) => n.state))].sort();
