import { submitReply, submitReview } from '@/app/actions';
import type { ReviewRow } from '@/lib/db';

function Stars({ value }: { value: number }) {
  return <span className="stars" aria-label={`${value} out of 5 stars`}>{'★'.repeat(value)}{'☆'.repeat(5-value)}</span>;
}

function ReplyForm({ gameSlug, parent }: { gameSlug: string; parent: ReviewRow }) {
  return <details>
    <summary>Reply</summary>
    <form action={submitReply} className="reply-form">
      <input type="hidden" name="gameSlug" value={gameSlug} />
      <input type="hidden" name="parentId" value={parent.id} />
      <input name="author" required minLength={2} maxLength={50} placeholder="Your name" />
      <textarea name="body" required minLength={2} maxLength={1200} placeholder={`Reply to ${parent.author}`} />
      <button className="secondary" type="submit">Post reply</button>
    </form>
  </details>;
}

function CommentThread({ row, childrenByParent, gameSlug, depth = 0 }: {
  row: ReviewRow;
  childrenByParent: Map<number, ReviewRow[]>;
  gameSlug: string;
  depth?: number;
}) {
  const children = childrenByParent.get(row.id) ?? [];
  const isReview = row.parent_id === null;
  return <article className={isReview ? 'review-card' : 'reply'} style={!isReview ? { marginLeft: `${Math.min(depth, 5) * 14}px` } : undefined}>
    <div className="review-meta">
      <div className="avatar">{row.author.slice(0,1).toUpperCase()}</div>
      <div>
        <strong>{row.author}</strong>
        <div>{isReview && <><Stars value={row.rating ?? 0} /> {' '}</>}<time>{new Date(row.created_at + 'Z').toLocaleDateString()}</time></div>
      </div>
    </div>
    <p>{row.body}</p>
    <ReplyForm gameSlug={gameSlug} parent={row} />
    {children.length > 0 && <div className="reply-thread">
      {children.map((child) => <CommentThread key={child.id} row={child} childrenByParent={childrenByParent} gameSlug={gameSlug} depth={depth + 1} />)}
    </div>}
  </article>;
}

export function Reviews({ gameSlug, reviews, summary }: { gameSlug: string; reviews: ReviewRow[]; summary: { count: number; average: number; breakdown: Record<number, number> } }) {
  const top = reviews.filter((r) => r.parent_id === null);
  const childrenByParent = new Map<number, ReviewRow[]>();
  for (const row of reviews) {
    if (row.parent_id === null) continue;
    const list = childrenByParent.get(row.parent_id) ?? [];
    list.push(row);
    childrenByParent.set(row.parent_id, list);
  }
  for (const list of childrenByParent.values()) list.sort((a, b) => a.id - b.id);

  return <section className="reviews" id="reviews">
    <div className="rating-summary">
      <div><strong>{summary.count ? summary.average.toFixed(1) : '—'}</strong><div><Stars value={summary.count ? Math.round(summary.average) : 0} /></div><span>{summary.count} rating{summary.count === 1 ? '' : 's'}</span></div>
      <div className="bars">{[5,4,3,2,1].map((n) => <div className="bar-row" key={n}><span>{n}</span><div><i style={{ width: `${summary.count ? (summary.breakdown[n] / summary.count) * 100 : 0}%` }} /></div><span>{summary.breakdown[n]}</span></div>)}</div>
    </div>
    <form action={submitReview} className="review-form">
      <input type="hidden" name="gameSlug" value={gameSlug} />
      <div className="form-head"><div><h3>Rate this game</h3><p>Share feedback with the AtenPlay community.</p></div><label className="rating-input"><span>Stars</span><select name="rating" defaultValue="5" aria-label="Rating"><option value="5">★★★★★</option><option value="4">★★★★☆</option><option value="3">★★★☆☆</option><option value="2">★★☆☆☆</option><option value="1">★☆☆☆☆</option></select></label></div>
      <input name="author" maxLength={50} minLength={2} required placeholder="Your name" />
      <textarea name="body" maxLength={1200} minLength={3} required placeholder="What did you like? What should improve?" />
      <button className="primary" type="submit">Post review</button>
    </form>
    <div className="review-list">
      {top.length === 0 && <div className="empty-review"><h3>No reviews yet</h3><p>Be the first to rate this game.</p></div>}
      {top.map((review) => <CommentThread key={review.id} row={review} childrenByParent={childrenByParent} gameSlug={gameSlug} />)}
    </div>
  </section>;
}
