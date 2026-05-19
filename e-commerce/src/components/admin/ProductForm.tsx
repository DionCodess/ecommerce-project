import { useState, type SyntheticEvent } from 'react';
import type { ProductCategory } from '../../domain';
import type { ProductFormInput } from '../../services';

const categories: readonly ProductCategory[] = ['electronics', 'apparel', 'home', 'books', 'fitness'];

interface ProductFormProps {
  readonly onSubmit: (input: ProductFormInput) => Promise<void>;
}

export function ProductForm({ onSubmit }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormInput>({
    id: '',
    name: '',
    description: '',
    category: 'electronics',
    imageUrl: '',
    priceInCents: 0,
    inventoryCount: 0,
    isActive: true,
    featured: false,
  });

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>): void {
    event.preventDefault();
    void onSubmit({
      ...form,
      id: form.id.trim() || `prod-${crypto.randomUUID()}`,
    }).then(() => {
      setForm({
        id: '',
        name: '',
        description: '',
        category: 'electronics',
        imageUrl: '',
        priceInCents: 0,
        inventoryCount: 0,
        isActive: true,
        featured: false,
      });
    });
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <h2>Add or Update Product</h2>
      <input
        placeholder="Product id, optional for new products"
        value={form.id}
        onChange={(event) => setForm({ ...form, id: event.target.value })}
      />
      <input
        required
        placeholder="Name"
        value={form.name}
        onChange={(event) => setForm({ ...form, name: event.target.value })}
      />
      <textarea
        required
        placeholder="Description"
        value={form.description}
        onChange={(event) => setForm({ ...form, description: event.target.value })}
      />
      <select
        value={form.category}
        onChange={(event) => setForm({ ...form, category: event.target.value as ProductCategory })}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <input
        required
        placeholder="Image URL"
        value={form.imageUrl}
        onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
      />
      <input
        min="0"
        required
        type="number"
        placeholder="Price in cents"
        value={form.priceInCents}
        onChange={(event) => setForm({ ...form, priceInCents: Number(event.target.value) })}
      />
      <input
        min="0"
        required
        type="number"
        placeholder="Inventory"
        value={form.inventoryCount}
        onChange={(event) => setForm({ ...form, inventoryCount: Number(event.target.value) })}
      />
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
        />
        Active
      </label>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(event) => setForm({ ...form, featured: event.target.checked })}
        />
        Featured
      </label>
      <button type="submit">Save product</button>
    </form>
  );
}
