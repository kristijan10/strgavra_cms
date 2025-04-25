import { useState } from "react";

const podaci = [
  {
    title: "Logo Gavra",
    type: "image",
    link: "https://strgavra.rs/static/media/logo.ab5942f642f561c6ab376b5936b6097d.svg",
  },
  {
    title: "O nama",
    type: "link",
    link: "#o-nama",
  },
  {
    title: "Ponuda",
    type: "link",
    link: "#ponuda",
  },
  {
    title: "Kontakt",
    type: "link",
    link: "#kontakt",
  },
];

// Mock function to simulate CDN and DB save
const uploadToCDN = async (file) => {
  try {
    const response = await fetch("http://localhost:8000/media", {
      method: "POST",
      body: "",
    });
    return response;
  } catch (error) {
    console.log("Greska pri slanju slike na backend: ", error);
  }
};

// Mock function to simulate saving text and links to DB

const Navigacija = () => {
  const [links, setLinks] = useState(
    podaci.filter((p) => p.type === "link").map((p) => ({ ...p }))
  );
  const [imageUrl, setImageUrl] = useState(
    podaci.find((p) => p.type === "image")?.link || ""
  );

  // Handle image selection and immediate save
  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const cdnUrl = await uploadToCDN(file);
        setImageUrl(cdnUrl);
      } catch (error) {
        console.log("Greska pri cuvanju slike na CDN: ", error);
      }
    }
  };

  // Handle text/link input changes
  const handleInputChange = (index, field, value) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = value;
    setLinks(updatedLinks);
  };

  // Handle save button click

  return (
    <div className="p-5">
      <div>
        <h1 className="text-2xl">Navigacija</h1>
      </div>
      <div>
        <div className="flex items-center mb-4">
          <p className="mr-2">Izaberi sliku (ikonicu)</p>
          <input
            type="file"
            accept="image/*"
            className="border-1"
            onChange={handleImageChange}
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="ml-4 h-10 w-10 object-contain"
            />
          )}
        </div>
        {links.map((p, i) => (
          <div key={i} className="my-2.5">
            <div>
              <div className="flex mb-1">
                <p className="mr-2">Tekst</p>
                <input
                  value={p.title}
                  onChange={(e) =>
                    handleInputChange(i, "title", e.target.value)
                  }
                  className="border-1"
                />
              </div>
              <div className="flex">
                <p className="mr-2">Link</p>
                <input
                  value={p.link}
                  onChange={(e) => handleInputChange(i, "link", e.target.value)}
                  className="border-1"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          // onClick={handleSave}
          className="border-1 cursor-pointer px-1.5 py-1 mt-2"
        >
          Sacuvaj
        </button>
      </div>
    </div>
  );
};

export default Navigacija;

/*

const podaci = [
  {
    title: "Logo Gavra",
    type: "image",
    url: "/static/media/logo.ab5942f642f561c6ab376b5936b6097d.svg",
    link: "/",
  },
  {
    title: "O nama",
    type: "link",
    link: "#o-nama",
  },
  {
    title: "Ponuda",
    type: "link",
    link: "#ponuda",
  },
  {
    title: "Kontakt",
    type: "link",
    link: "#kontakt",
  },
];

const Navigacija = () => {
  return (
    <div className="p-5">
      <div>
        <h1 className="text-2xl">Navigacija</h1>
      </div>
      <div>
        <div className="flex">
          <p>Izaberi sliku (ikonicu)</p>
          <input
            type="file"
            className="border-1"
            defaultValue={podaci.find((p) => p.type === "image").url}
          />
        </div>
        {podaci
          .filter((p) => p.type === "link")
          .map((p, i) => (
            <div key={i} className="my-2.5">
              <div>
                <div className="flex mb-1">
                  <p className="mr-2">Tekst</p>
                  <input defaultValue={p.title} className="border-1" />
                </div>
                <div className="flex">
                  <p className="mr-2">Link</p>
                  <input defaultValue={p.link} className="border-1" />
                </div>
              </div>
            </div>
          ))}
        <button className="border-1 cursor-pointer px-1.5 py-1">Sacuvaj</button>
      </div>
    </div>
  );
};
*/
