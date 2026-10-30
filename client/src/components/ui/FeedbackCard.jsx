function FeedbackCard({ feedback, t }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
      <p className="text-2xl font-black text-blue-700">
        {feedback.rating}/5
      </p>
      <p className="mt-3 text-slate-700">
        {feedback.comment || t("noComment")}
      </p>
      <div className="mt-5 border-t border-slate-200 pt-4 text-sm text-slate-600">
        <p className="font-bold text-slate-950">
          {feedback.userId?.name || t("participant")}
        </p>
        <p>
          {new Date(feedback.createdAt).toLocaleDateString()}
        </p>
      </div>
    </article>
  );
}

export default FeedbackCard;
