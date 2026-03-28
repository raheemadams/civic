import A from "@/components/ui/A";

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-24 sm:py-32"
      style={{
        background: "linear-gradient(135deg, #0f3a1a 0%, #1a5c2a 55%, #2d7a40 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full opacity-[0.07] pointer-events-none"
        style={{ background: "#39ff14" }}
      />
      <div
        className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full opacity-[0.07] pointer-events-none"
        style={{ background: "#39ff14" }}
      />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-civic-lime text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 rounded-full bg-civic-lime animate-pulse" />
          Nigeria deserves better
        </div>

        <h1 className="font-display font-bold uppercase text-white leading-[1.05] text-5xl sm:text-6xl lg:text-7xl">
          Our Talent Is{" "}
          <span className="text-civic-lime">World-Class.</span>{" "}
          Our Leaders Should Be Too.
        </h1>

        <p className="mt-8 text-white/70 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
          Naija Civic Connect is building Nigeria&apos;s most credible talent
          database — one local government at a time. Nominate the brilliant,
          honest, and capable people from your LGA. When we have enough,
          political parties will have no excuse to field bad candidates.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <A
            href="/nominate"
            className="bg-civic-lime text-black font-bold text-sm px-8 py-4 rounded-full hover:bg-civic-lime-hover hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Nominate Someone →
          </A>
          <A
            href="/how-it-works"
            className="bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold text-sm px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-200"
          >
            How It Works
          </A>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { value: "774", label: "Local Govts" },
            { value: "36+", label: "States Covered" },
            { value: "Free", label: "To Nominate" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-4 border border-white/10"
            >
              <p className="font-display font-bold text-civic-lime text-2xl sm:text-3xl">
                {stat.value}
              </p>
              <p className="text-white/60 text-xs mt-0.5 leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
