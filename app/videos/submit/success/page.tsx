export default function VideoSubmitSuccessPage() {
  return (
    <div className="min-h-screen bg-civic-gray flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-sm p-10">
          <div className="w-16 h-16 rounded-full bg-civic-green-light flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📹</span>
          </div>
          <h1 className="font-display font-bold uppercase text-civic-green-dark text-2xl mb-2">
            Video Submitted
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Your video is under review and will appear in Civic Lens once approved.
            Thank you for documenting Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/videos/submit"
              className="px-5 py-2.5 rounded-xl border-2 border-civic-green text-civic-green font-bold text-sm hover:bg-civic-green-light transition-colors"
            >
              Submit Another
            </a>
            <a
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-civic-green text-white font-bold text-sm hover:bg-civic-green-mid transition-colors"
            >
              Back to Dashboard →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
