export default function Loading() {
  return <div role="status" aria-label="Memuat halaman"><div className="skeleton heading-skeleton" /><div className="stats-grid">{[1, 2, 3].map(i => <div className="skeleton card-skeleton" key={i} />)}</div><div className="skeleton content-skeleton" /></div>;
}
