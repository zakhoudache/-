import { HistoricalItem } from "./types";

export const historicalData: HistoricalItem[] = [
  {
    id: "1",
    title: "عبد القادر الجزائري",
    description: "قائد عسكري وسياسي جزائري قاد المقاومة ضد الاستعمار الفرنسي",
    type: "character",
    importance: "high",
    year: "1808-1883",
    relationships: [
      { targetId: "2", description: "قاد المقاومة في" },
      { targetId: "5", description: "وقع على" },
    ],
  },
  {
    id: "2",
    title: "معركة سطاوالي",
    description: "معركة تاريخية مهمة في تاريخ الجزائر",
    type: "event",
    importance: "medium",
    year: "1830",
    relationships: [],
  },
  {
    id: "3",
    title: "الباي",
    description: "لقب حاكم المقاطعة في العهد العثماني",
    type: "term",
    importance: "low",
    year: "1516-1830",
    relationships: [],
  },
  {
    id: "4",
    title: "الأمير خالد",
    description: "قائد سياسي ومناضل جزائري في بداية القرن العشرين",
    type: "character",
    importance: "high",
    year: "1875-1936",
    relationships: [],
  },
  {
    id: "5",
    title: "معاهدة تافنة",
    description: "معاهدة بين الأمير عبد القادر والفرنسيين",
    type: "event",
    importance: "medium",
    year: "1837",
    relationships: [{ targetId: "1", description: "وقعت من قبل" }],
  },
];
