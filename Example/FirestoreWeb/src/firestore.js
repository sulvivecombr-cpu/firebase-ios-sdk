const base =
  "/firestore/v1/projects/fir-firestore-sample-ios/databases/(default)/documents";

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!response.ok)
    throw new Error(
      `O emulador Firestore respondeu com erro ${response.status}.`,
    );
  return response.status === 204 ? null : response.json();
}

export function decodeFruits(documents, requireFavourite = true) {
  const fruits = [];
  const errors = [];
  for (const document of documents) {
    const id = document.name.split("/").pop();
    const name = document.fields?.name?.stringValue;
    const isFavourite = document.fields?.isFavourite?.booleanValue;
    if (
      typeof name !== "string" ||
      (requireFavourite && typeof isFavourite !== "boolean")
    ) {
      errors.push(
        `Documento “${id}”: campo ${typeof name !== "string" ? "name" : "isFavourite"} incompatível com o modelo Fruit.`,
      );
    } else {
      fruits.push({ id, name, isFavourite });
    }
  }
  return { fruits, errors };
}

export async function readFruits(collection, favouritesOnly) {
  const structuredQuery = { from: [{ collectionId: collection }] };
  if (favouritesOnly) {
    structuredQuery.where = {
      fieldFilter: {
        field: { fieldPath: "isFavourite" },
        op: "EQUAL",
        value: { booleanValue: true },
      },
    };
  }
  const result = await request(":runQuery", {
    method: "POST",
    body: JSON.stringify({ structuredQuery }),
  });
  return decodeFruits(
    result.filter((row) => row.document).map((row) => row.document),
    collection === "fruits",
  );
}

export const randomFruitNames = [
  "Apple",
  "Banana",
  "Orange",
  "Pineapple",
  "Dragonfruit",
  "Mangosteen",
  "Lychee",
  "Passionfruit",
  "Starfruit",
];

export async function addRandomFruit() {
  const name =
    randomFruitNames[Math.floor(Math.random() * randomFruitNames.length)];
  return request("/fruits", {
    method: "POST",
    body: JSON.stringify({
      fields: {
        name: { stringValue: name },
        isFavourite: { booleanValue: true },
      },
    }),
  });
}

export async function deleteFruit(id) {
  await request(`/fruits/${encodeURIComponent(id)}`, { method: "DELETE" });
}
