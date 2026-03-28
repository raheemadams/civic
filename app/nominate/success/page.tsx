export default function NominationSuccessPage() {
  return (
    <div className="min-h-screen bg-civic-gray flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-sm p-10">
          <div className="w-16 h-16 rounded-full bg-civic-green-light flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="font-display font-bold uppercase text-civic-green-dark text-2xl mb-2">
            Nomination Submitted
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Your nomination is under review. A moderator will approve or reject it
            within 48 hours. Thank you for building Nigeria&apos;s credibility database.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/nominate"
              className="px-5 py-2.5 rounded-xl border-2 border-civic-green text-civic-green font-bold text-sm hover:bg-civic-green-light transition-colors"
            >
              Nominate Another
            </a>
            <a
              href="/nominees"
              className="px-5 py-2.5 rounded-xl bg-civic-green text-white font-bold text-sm hover:bg-civic-green-mid transition-colors"
            >
              Browse Nominees →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
