import { useState } from "react";
import throwError from "../../../backend/utils/throwError";
import { useRef } from "react";

// TODO: kada se uploaduje slika prvo ide na /media api (na cloudinary), gde uzimam public_url i prosledjujem na PUT
// /? (ruta jos ne postoji, ali za editovanje putanje logoa za navigaciju, menja se podaci[link])
// razraditi kako cu prepoznati koji je logo light a koji dark
// public_url = uploadToCloudinary()
// fetch(..., {method: "PUT", body: {public_url}}) -> ovim ce automatski, po uspesnom zahtevu, front povuci novi
// link ka toj slici sa cdn-a i prikazati

// TODO: azurirati stanje u bazi linkova

const podaci = [
  { id: 1, title: "O nama", url: "#o-nama", type: "link", order: 0 },
  { id: 2, title: "Ponuda", url: "#ponuda", type: "link", order: 0 },
  { id: 3, title: "Kontakt", url: "#kontakt", type: "link", order: 0 },
  {
    id: 4,
    title: "Gavra logo, vatra, dark",
    url: "https://res.cloudinary.com/dlu5thalf/image/upload/v1745658666/navigation_images/ap9qokrkieeyunxpckcq.webp",
    type: "image",
    order: 0,
  },
  {
    id: 5,
    title: "Gavra logo, vatra, light",
    url: "https://res.cloudinary.com/dlu5thalf/image/upload/v1745658773/navigation_images/vcpgn7ifuo9mw6nprjjd.webp",
    type: "image",
    order: 1,
  },
];

// Mock function to simulate CDN and DB save
const uploadToCDN = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("http://localhost:8000/media", {
    method: "POST",
    body: formData,
  });

  if (!response.ok)
    throwError({ message: "Nisam uspeo da postavim na cloudify", status: 400 });

  const data = await response.json();
  return data.secure_url;
  // podaci.find(d=>d.type==="image").url = response;
};

// Mock function to simulate saving text and links to DB

const Navigacija = () => {
  const [links, setLinks] = useState(
    podaci.filter((p) => p.type === "link").map((p) => ({ ...p }))
  );
  const [imageUrl, setImageUrl] = useState(
    podaci.find((p) => p.type === "image")?.url || ""
  );
  const [changedLinks, setChangedLinks] = useState([]);
  const logoInputRef = useRef();

  // Handle image selection and immediate save
  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const cdnUrl = await uploadToCDN(file);
        setImageUrl(cdnUrl);
        logoInputRef.current.value = "";
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

    const changedIndex = changedLinks.findIndex((cl) => cl.index === index);
    let obj = changedLinks[changedIndex] || { index, changes: {} };

    obj.changes[field] = value;

    if (changedIndex === -1) {
      setChangedLinks([...changedLinks, obj]);
    } else {
      const updatedChangedLinks = [...changedLinks];
      updatedChangedLinks[changedIndex] = obj;
      setChangedLinks(updatedChangedLinks);
    }
    console.log(changedLinks);
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
            ref={logoInputRef}
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
                  value={p.url}
                  onChange={(e) => handleInputChange(i, "url", e.target.value)}
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
