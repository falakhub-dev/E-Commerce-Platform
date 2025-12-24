import { useState } from 'react';

export default function Filters({ onChange }) {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const apply = () => onChange({ q, category, minPrice, maxPrice });

  return (
    <div className="filters">
      <input placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} />
      <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
      <input placeholder="Min price" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
      <input placeholder="Max price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
      <button onClick={apply}>Apply</button>
    </div>
  );
}
