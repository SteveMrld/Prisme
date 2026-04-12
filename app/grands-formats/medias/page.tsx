import GrandFormatLayout from "../../../components/GrandFormatLayout";

export const metadata = {
  title: "Quand les médias perdent le fil de la vérité — Soara",
  description: "La désinformation prospère moins parce que le mensonge est devenu habile que parce que la rigueur journalistique s'est érodée. Entre polarisation éditoriale, économie de l'attention et concentration du pouvoir médiatique, le diagnostic.",
};

export default function MediasGrandFormat() {
  return (
    <GrandFormatLayout
      slug="medias"
      category="soc"
      categoryLabel="Société · Médias"
      readTime="10"
    />
  );
}
