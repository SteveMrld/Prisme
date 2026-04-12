import fs from 'fs'
import path from 'path'
import GrandFormatLayout from "../../../components/GrandFormatLayout";

export const metadata = {
  title: "La désaffection — Soara",
  description: "Confiance en chute libre, évitement croissant, pouvoir médiatique concentré entre quelques mains. Le divorce entre le public occidental et ses médias est structurel. Anatomie d'une rupture.",
};

export default function MediasGrandFormat() {
  const contentPath = path.join(process.cwd(), 'lib', 'content', 'medias.html')
  let content = ''
  try {
    content = fs.readFileSync(contentPath, 'utf-8')
  } catch {
    content = '<p>Contenu à venir.</p>'
  }

  return (
    <GrandFormatLayout
      slug="medias"
      content={content}
      category="soc"
      categoryLabel="Société · Médias"
      readTime="10"
    />
  );
}
