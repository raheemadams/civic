import StaticPage from "@/components/layout/StaticPage";
import { Scale } from "lucide-react";

export default function CivicRightsPage() {
  const rights = [
    {
      title: "Right to Life",
      chapter: "Section 33",
      desc: "Every person has a right to life, and no one shall be deprived intentionally of their life, save in execution of a court sentence.",
    },
    {
      title: "Right to Dignity",
      chapter: "Section 34",
      desc: "Every person is entitled to respect for the dignity of their person. No person shall be subjected to torture, inhuman or degrading treatment.",
    },
    {
      title: "Right to Personal Liberty",
      chapter: "Section 35",
      desc: "Every person is entitled to their personal liberty and no person shall be deprived of such liberty except in accordance with law.",
    },
    {
      title: "Right to Fair Hearing",
      chapter: "Section 36",
      desc: "Every person is entitled to a fair hearing within a reasonable time by a court or tribunal established by law.",
    },
    {
      title: "Right to Freedom of Expression",
      chapter: "Section 39",
      desc: "Every person shall be entitled to freedom of expression, including freedom to hold opinions and to receive and impart ideas and information.",
    },
    {
      title: "Right to Peaceful Assembly",
      chapter: "Section 40",
      desc: "Every person shall be entitled to assemble freely and associate with other persons for the protection of their interests.",
    },
    {
      title: "Right to Freedom of Movement",
      chapter: "Section 41",
      desc: "Every citizen of Nigeria is entitled to move freely throughout Nigeria and to reside in any part thereof.",
    },
    {
      title: "Right to Vote & Be Voted For",
      chapter: "Section 77 & 117",
      desc: "Every citizen of Nigeria who has attained the age of 18 years and is registered to vote is entitled to vote in elections.",
    },
    {
      title: "Right to Freedom from Discrimination",
      chapter: "Section 42",
      desc: "A citizen shall not be discriminated against on the grounds of ethnic group, place of origin, sex, religion, or political opinion.",
    },
  ];

  return (
    <StaticPage title="Civic Rights Guide" subtitle="Your rights under the 1999 Constitution of the Federal Republic of Nigeria (as amended).">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
        <p className="text-gray-600 text-sm leading-relaxed">
          The Nigerian Constitution guarantees fundamental rights to every citizen under Chapter IV.
          These rights are enforceable in court. Knowing them is the first step toward holding your
          government accountable.
        </p>
      </div>

      <div className="space-y-4">
        {rights.map(({ title, chapter, desc }) => (
          <div key={title} className="bg-white rounded-2xl p-5 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-civic-green-light flex items-center justify-center shrink-0">
              <Scale size={18} className="text-civic-green" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
                <span className="text-xs bg-civic-green-light text-civic-green-dark font-semibold px-2 py-0.5 rounded-full">
                  {chapter}
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}
