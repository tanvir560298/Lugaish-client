const previews = {
  library: { src: '/images/campus/library-arrival.webp', width: 1200, height: 800, alt: 'Lugaish Study Library: entrance view of wooden study tables, four learning zones and bookshelves' },
  classroom: { src: '/images/campus/classroom.jpg', width: 685, height: 440, alt: 'Lugaish Classroom: sage chairs, wooden desks and a teaching screen' },
};
export function CampusPreview({ kind = 'library', eager = false }) {
  const preview = previews[kind] ?? previews.library;
  return <img className="campus-render-preview" src={preview.src} alt={preview.alt} width={preview.width} height={preview.height} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
}
