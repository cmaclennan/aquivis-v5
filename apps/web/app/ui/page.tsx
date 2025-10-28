export default function UIGallery() {
  return (
    <main style={{ padding: 24 }}>
      <h1>UI Gallery (placeholder)</h1>
      <section>
        <h2>Buttons</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button>Primary</button>
          <button style={{ background: 'transparent', border: '1px solid #ccc' }}>Ghost</button>
        </div>
      </section>
      <section>
        <h2>Badges</h2>
        <span style={{ background: '#E6F4FA', color: '#2090C3', padding: '2px 8px', borderRadius: 12 }}>Info</span>
      </section>
    </main>
  );
}

