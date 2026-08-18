import Section from '../Section'
import { bandBio } from '../../data/bio'
import aboutBackground from '../../assets/background-2.jpg'

function AboutSection() {
  return (
    <Section
      id="about"
      title="Biographie"
      description="Une histoire de riffs, de poussière et de lumière."
      background={aboutBackground}
    >
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1.05fr_1.45fr]">
        <img
          className="min-h-[420px] w-full border border-white/15 object-cover shadow-soft"
          src={bandBio.photo}
          alt="Le groupe en concert"
        />
        <div className="border border-white/15 bg-panel/84 p-6">
          {bandBio.text.split('\n').map((paragraph, index) => (
            <p className="mb-4" key={index}>
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </div>
    </Section>
  )
}

export default AboutSection
