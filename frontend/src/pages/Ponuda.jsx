import { useEffect, useState, useRef } from "react";

const Ponuda = () => {
  const [status, setStatus] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const fileRefs = useRef({});

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
            content: d.content.split(";").filter((c) => c.trim()),
            changedFields: {},
          }))
        );
      } catch (e) {
        setError(e);
      }
    })();
  }, []);

  const updateCategory = (id, updates) =>
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id
          ? {
              ...cat,
              ...updates,
              changedFields: { ...cat.changedFields, ...updates.changedFields },
            }
          : cat
      )
    );

  const handleInput = (id, type, value, index) => {
    if (type === "name")
      updateCategory(id, { name: value, changedFields: { name: true } });
    else if (type === "file")
      updateCategory(id, { changedFields: { image: true } });
    else if (type === "content")
      updateCategory(id, {
        content: categories
          .find((c) => c.id === id)
          .content.map((c, i) => (i === index ? value : c)),
        changedFields: { content: true },
      });
    else if (type === "add")
      updateCategory(id, {
        content: [...categories.find((c) => c.id === id).content, ""],
        changedFields: { content: true },
      });
    else if (type === "remove")
      updateCategory(id, {
        content: categories
          .find((c) => c.id === id)
          .content.filter((_, i) => i !== index),
        changedFields: { content: true },
      });
  };

  const update = async (id) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat || !Object.keys(cat.changedFields).length) return;

    const formData = new FormData();
    if (cat.changedFields.name) formData.append("name", cat.name);
    if (cat.changedFields.content)
      formData.append("content", cat.content.filter((c) => c.trim()).join(";"));
    if (cat.changedFields.image) {
      const file = fileRefs.current[id]?.files[0];
      if (file) formData.append("image", file);
    }

    // console.log(`FormData for category ${id}:`);
    // for (const [k, v] of formData) console.log(`${k}:`, v);

    try {
      const res = await fetch(`http://localhost:8000/categories/${id}`, {
        method: "PUT",
        body: formData,
      });
      setStatus((await res.json()).message);
      updateCategory(id, { changedFields: {} });
    } catch (e) {
      setStatus(e.message);
    }
  };

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      {categories.map((cat) => (
        <div key={cat.id}>
          <input
            className="border"
            value={cat.name}
            onChange={(e) => handleInput(cat.id, "name", e.target.value)}
          />
          <input
            type="file"
            className="border"
            ref={(el) => (fileRefs.current[cat.id] = el)}
            onChange={() => handleInput(cat.id, "file")}
          />
          <div className="flex flex-col gap-1">
            {cat.content.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="border w-fit"
                  value={c}
                  onChange={(e) =>
                    handleInput(cat.id, "content", e.target.value, i)
                  }
                />
                <button
                  className="border px-2 py-1 bg-red-500 text-white"
                  onClick={() => handleInput(cat.id, "remove", null, i)}
                >
                  -
                </button>
              </div>
            ))}
            <button
              className="border px-2 py-1 w-fit"
              onClick={() => handleInput(cat.id, "add")}
            >
              +
            </button>
            {status && <p>{status}</p>}
            <button
              className="border px-2 py-1 w-fit"
              onClick={() => update(cat.id)}
            >
              Sacuvaj
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default Ponuda;
