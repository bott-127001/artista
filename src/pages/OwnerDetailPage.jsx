import { Link, Navigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import owners from '../ownersData'

function OwnerDetailPage() {
  const { ownerId } = useParams()
  const owner = owners.find((profile) => profile.id === ownerId)

  if (!owner) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="relative w-full bg-background-light min-h-screen">
      <Header />
      <section className="bg-gradient-to-br from-primary to-primary/90 text-white pt-40 pb-16 lg:pt-48 lg:pb-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr,0.8fr] items-center">
            <div className="order-2 max-w-3xl lg:order-1">
              <p className="text-sm uppercase tracking-[0.3em] text-accent">Owner Spotlight</p>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold">{owner.name}</h1>
              {owner.role && <p className="mt-3 text-lg sm:text-xl text-white/80">{owner.role}</p>}
              <p className="mt-4 text-base sm:text-lg text-white/80">{owner.shortQuote}</p>
              <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold uppercase tracking-wider text-primary">
                {owner.experience && (
                  <span className="rounded-full bg-white px-4 py-2">{owner.experience}</span>
              )}
                <span className="rounded-full bg-white px-4 py-2">Artista founding family</span>
              </div>
            </div>
            <div className="order-1 mx-auto w-full max-w-sm lg:order-2">
              <div className="relative aspect-square rounded-[32px] bg-white/10 p-4 shadow-2xl shadow-black/30 ring-2 ring-white/30">
                <div className="absolute -inset-2 rounded-[36px] bg-white/20 blur-3xl"></div>
                <img
                  src={owner.image}
                  alt={owner.name}
                  className="relative z-10 h-full w-full rounded-[24px] object-cover ring-4 ring-white/50"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-background-light">
        <section className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[2fr,1fr] items-start">
            <div className="space-y-8">
              <div className="rounded-3xl bg-white p-6 lg:p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-primary">Story & Leadership</h2>
                <div className="mt-4 space-y-4 text-base text-text-color/80 leading-relaxed">
                  {owner.bio.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 lg:p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-primary">Signature Specialties</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {owner.specialties.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-primary font-semibold"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-lg">
                <h3 className="text-xl font-bold text-primary">Career Highlights</h3>
                <ul className="mt-4 space-y-3 text-sm text-text-color/80">
                  {owner.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-accent"></span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-primary text-white p-6 shadow-lg">
                <Link
                  to="/"
                  className="block text-center rounded-2xl border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
                >
                  Back to Home
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default OwnerDetailPage

