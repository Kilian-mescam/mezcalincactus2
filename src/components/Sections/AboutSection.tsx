import Section from '../Section'
import { bandBio } from '../../data/bio'

function AboutSection() {
  return (
    <Section id="bio" background="#242424" hideTitle>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div>
          <img
            className="psy-still mb-6 h-[420px] w-full object-cover"
            src={bandBio.photos[0]}
            alt="Le groupe en concert"
          />
          <h2 className="text-[clamp(2rem,4vw,3.5rem)]">Bio</h2>
        </div>

        {bandBio.columns.map((paragraphs, index) => (
          <div key={index}>
            <img
              className="psy-still mb-6 h-[420px] w-full object-cover"
              src={bandBio.photos[index + 1]}
              alt="Le groupe en concert"
            />
            {paragraphs.map((paragraph, paragraphIndex) => (
              <p className="mb-4" key={paragraphIndex}>
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </Section>
  )
}

export default AboutSection
