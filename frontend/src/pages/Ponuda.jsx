import { useEffect, useState, useRef } from "react";

const PonudaCard = ({ initialCategory, onDelete }) => {
  const [category, setCategory] = useState({
    ...initialCategory,
    changedFields: {},
  });
  const [status, setStatus] = useState(null);
  const fileRef = useRef(null);

  const updateCategory = (updates) =>
    setCategory((prev) => ({
      ...prev,
      ...updates,
      changedFields: { ...prev.changedFields, ...updates.changedFields },
    }));

  const handleInput = (type, value, index) => {
    if (type === "name") {
      updateCategory({ name: value, changedFields: { name: true } });
    } else if (type === "file") {
      updateCategory({ changedFields: { image: true } });
    } else if (type === "content") {
      updateCategory({
        content: category.content.map((c, i) => (i === index ? value : c)),
        changedFields: { content: true },
      });
    } else if (type === "add") {
      updateCategory({
        content: [...category.content, ""],
        changedFields: { content: true },
      });
    } else if (type === "remove") {
      updateCategory({
        content: category.content.filter((_, i) => i !== index),
        changedFields: { content: true },
      });
    } else if (type === "visible") {
      updateCategory({ visible: value, changedFields: { visible: true } });
    }
  };

  const update = async () => {
    const formData = new FormData();
    if (category.changedFields.name) formData.append("name", category.name);
    if (category.changedFields.content)
      formData.append(
        "content",
        category.content.filter((c) => c.trim()).join(";")
      );
    if (category.changedFields.image) {
      const file = fileRef.current?.files[0];
      if (file) formData.append("image", file);
    }
    if (category.changedFields.visible)
      formData.append("visible", category.visible ? "1" : "0");

    try {
      const res = await fetch(
        `http://localhost:8000/categories/${category.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      const response = await res.json();
      setStatus(response.message);
      setCategory((prev) => ({ ...prev, changedFields: {} }));
    } catch (e) {
      setStatus(e.message);
    }
  };

  const deleteCategory = async () => {
    try {
      if (!confirm("Da li zaista zelis da obrises kategoriju?")) return;

      const res = await fetch(
        `http://localhost:8000/categories/${category.id}`,
        {
          method: "DELETE",
        }
      );
      const response = await res.json();
      setStatus(response.message);
      onDelete(category.id);
    } catch (e) {
      setStatus(e.message);
    }
  };

  // Only render the card if visible is true
  // if (!category.visible) return null;

  return (
    <div className="border p-4 mb-4 rounded">
      <input
        className="border p-2 mb-2 w-full"
        value={category.name}
        onChange={(e) => handleInput("name", e.target.value)}
      />
      <input
        type="file"
        className="border p-2 mb-2 w-full"
        ref={fileRef}
        onChange={() => handleInput("file")}
      />
      <div className="mb-2">
        <label className="mr-4">Prikazi na klijentskom frontu:</label>
        <label className="mr-2">
          <input
            type="radio"
            name={`visible-${category.id}`}
            checked={category.visible}
            onChange={() => handleInput("visible", true)}
          />
          Da
        </label>
        <label>
          <input
            type="radio"
            name={`visible-${category.id}`}
            checked={!category.visible}
            onChange={() => handleInput("visible", false)}
          />
          Ne
        </label>
      </div>
      <div className="flex flex-col gap-1">
        {category.content.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className="border p-2 w-full"
              value={c}
              onChange={(e) => handleInput("content", e.target.value, i)}
            />
            <button
              className="border px-2 py-1 bg-red-500 text-white rounded"
              onClick={() => handleInput("remove", null, i)}
            >
              -
            </button>
          </div>
        ))}
        <button
          className="border px-2 py-1 w-fit bg-green-500 text-white rounded mt-2"
          onClick={() => handleInput("add")}
        >
          +
        </button>
        {status && <p className="mt-2 text-gray-600">{status}</p>}
        <div className="flex gap-2 mt-2">
          <button
            className="border px-2 py-1 w-fit bg-blue-500 text-white rounded"
            onClick={update}
          >
            Sacuvaj
          </button>
          <button
            className="border px-2 py-1 w-fit bg-red-600 text-white rounded"
            onClick={deleteCategory}
          >
            Obrisi Kategoriju
          </button>
        </div>
      </div>
    </div>
  );
};

const Ponuda = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:8000/categories");
        if (!res.ok) throw new Error("Greska pri fetchovanju podataka");
        const data = await res.json();
        setCategories(
          data.map((d) => ({
            id: d.id,
            name: d.name,
            content: d.content
              ? d.content.split(";").filter((c) => c.trim())
              : [],
            visible: Boolean(d.visible),
          }))
        );
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <div className="p-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {categories.map((cat) => (
        <PonudaCard
          key={cat.id}
          initialCategory={cat}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default Ponuda;
