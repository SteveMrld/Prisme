import GrandFormatLayout from "../../../components/GrandFormatLayout";

export const metadata = {
  title: "La désaffection — Soara",
  description: "Confiance en chute libre, évitement croissant, pouvoir médiatique concentré entre quelques mains. Le divorce entre le public occidental et ses médias est structurel. Anatomie d'une rupture.",
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
