import GrandFormatLayout from "../../../components/GrandFormatLayout";
import BasesClient from "./BasesClient";

export const metadata = {
  title: "L'Empire invisible, Les 800 bases militaires américaines dans le monde",
  description: "Comment les États-Unis projettent leur puissance depuis 80 pays. Une carte interactive de l'empreinte militaire américaine mondiale.",
};

export default function BasesMilitairesPage() {
  return (
    <GrandFormatLayout
      slug="bases-militaires"
      author="Steve Moradel"
      authorRole=""
      title="L'Empire invisible"
      description="Les 800 bases militaires américaines dans le monde"
      category="geo"
      categoryLabel="Géopolitique"
      date="2026-04-09"
      readTime="12 min"
    >
      <BasesClient />
    </GrandFormatLayout>
  );
}
