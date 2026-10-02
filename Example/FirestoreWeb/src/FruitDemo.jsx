import React, { useEffect, useState } from "react";
import { readFruits, addRandomFruit, deleteFruit } from "./firestore.js";

const fruitIcons = {
  apple: "🍎",
  banana: "🍌",
  orange: "🍊",
  pineapple: "🍍",
  dragonfruit: "🌵",
  mangosteen: "🟣",
  lychee: "🍒",
  passionfruit: "🟡",
  starfruit: "⭐",
  strawberry: "🍓",
  pear: "🍐",
  grape: "🍇",
  kiwi: "🥝",
  watermelon: "🍉",
  mango: "🥭",
  lemon: "🍋",
};

export default function FruitDemo({ demo, onConnection }) {
  const [favourites, setFavourites] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [revision, setRevision] = useState(0);
  const mapping = demo.collection === "mappingFailure";
  const editable = demo.id === "plain" || demo.id === "animated";
  const animated = demo.id === "animated";

  useEffect(() => {
    let active = true;
    let timer;
    async function load() {
      try {
        const result = await readFruits(
          demo.collection,
          !mapping && favourites,
        );
        if (active) {
          setData(result);
          setError("");
          onConnection("online");
        }
      } catch (failure) {
        if (active) {
          setError(failure.message);
          onConnection("offline");
        }
      }
      if (active) timer = setTimeout(load, 2000);
    }
    load();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [demo.collection, mapping, favourites, revision, onConnection]);

  async function add() {
    setBusy(true);
    setActionError("");
    try {
      await addRandomFruit();
      setRevision((value) => value + 1);
    } catch (failure) {
      setActionError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    setBusy(true);
    setActionError("");
    try {
      await deleteFruit(id);
      if (animated) {
        setRemoving(id);
        await new Promise((resolve) => setTimeout(resolve, 220));
      }
      setData((current) => ({
        ...current,
        fruits: current.fruits.filter((fruit) => fruit.id !== id),
      }));
      setRevision((value) => value + 1);
    } catch (failure) {
      setActionError(failure.message);
    } finally {
      setBusy(false);
      setRemoving(null);
    }
  }

  const strictError = demo.id === "strict" && data?.errors.length > 0;
  return (
    <section className="fruit-card" aria-label="Lista da coleção">
      <div className="fruit-card-header">
        <div>
          <span className="collection-eyebrow">
            COLEÇÃO / {demo.collection}
          </span>
          <h3>
            {mapping ? "Mapeamento de documentos" : "Suas frutas"}{" "}
            <span className="count-badge" data-testid="fruit-count">
              {strictError ? "—" : (data?.fruits.length ?? "…")}
            </span>
          </h3>
        </div>
        <span className="list-symbol">▤</span>
      </div>
      {!mapping && (
        <div className="filter-bar">
          <div className="segmented" role="group" aria-label="Filtrar frutas">
            <button
              aria-pressed={!favourites}
              onClick={() => {
                setData(null);
                setFavourites(false);
              }}
            >
              Todas as frutas
            </button>
            <button
              aria-pressed={favourites}
              onClick={() => {
                setData(null);
                setFavourites(true);
              }}
            >
              <span>☆</span> Favoritas
            </button>
          </div>
          <span className="query-label">
            {favourites ? "isFavourite == true" : "sem filtro"}
          </span>
        </div>
      )}
      <div className="list-column-labels">
        <span>{mapping ? "DOCUMENTO" : "FRUTA"}</span>
        <span>{mapping ? "VALIDAÇÃO" : "FAVORITA"}</span>
      </div>
      {error ? (
        <div className="error-panel" role="alert">
          <strong>Não foi possível carregar os dados</strong>
          <p>{error}</p>
          <button onClick={() => setRevision((value) => value + 1)}>
            Tentar novamente
          </button>
        </div>
      ) : !data ? (
        <div className="empty-state" role="status">
          Carregando documentos…
        </div>
      ) : strictError ? (
        <div className="error-panel mapping-error" role="alert">
          <span className="error-icon">!</span>
          <strong>Não foi possível mapear os dados</strong>
          <p>{data.errors[0]}</p>
          <code>decodingFailureStrategy: .raise</code>
        </div>
      ) : (
        <>
          <ul
            className={`fruit-list ${animated ? "animated" : ""}`}
            data-testid="fruit-list"
          >
            {data.fruits.map((fruit) => (
              <li
                key={fruit.id}
                data-document-id={fruit.id}
                className={removing === fruit.id ? "removing" : ""}
              >
                <div className="fruit-name">
                  <span className="fruit-emoji" aria-hidden="true">
                    {fruitIcons[fruit.name.toLowerCase()] || "🍃"}
                  </span>
                  <div>
                    <strong>{fruit.name}</strong>
                    <small>{fruit.id}</small>
                  </div>
                </div>
                <div className="row-actions">
                  {mapping ? (
                    <span className="valid-badge">Válido</span>
                  ) : (
                    <span
                      className={`favourite-indicator ${fruit.isFavourite ? "is-favourite" : ""}`}
                      aria-label={
                        fruit.isFavourite ? "Favorita" : "Não favorita"
                      }
                    >
                      {fruit.isFavourite ? "★" : "☆"}
                    </span>
                  )}
                  {editable && (
                    <button
                      className="delete-button"
                      aria-label={`Excluir ${fruit.name}`}
                      disabled={busy}
                      onClick={() => remove(fruit.id)}
                      title="Excluir fruta"
                    >
                      ×
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {data.fruits.length === 0 && (
            <div className="empty-state">
              Nenhuma fruta encontrada nesta consulta.
            </div>
          )}
          {mapping && data.errors.length > 0 && (
            <div className="mapping-warning" role="alert">
              <strong>Alguns documentos não puderam ser mapeados.</strong>
              <p>
                {data.errors.length} documento(s) ignorado(s). Os dados válidos
                continuam na lista.
              </p>
            </div>
          )}
        </>
      )}
      {actionError && (
        <p className="action-error" role="alert">
          {actionError}
        </p>
      )}
      <div className="list-footer">
        <span>
          <span className="tiny-dot" />{" "}
          {error ? "Sem conexão" : "Sincronização local · a cada 2s"}
        </span>
        {editable && (
          <button
            className="add-button"
            onClick={add}
            disabled={busy || !data || !!error}
          >
            <span>＋</span> {busy ? "Salvando…" : "Adicionar fruta"}
          </button>
        )}
      </div>
      <div className="sample-note">
        <span>ⓘ</span>{" "}
        {editable
          ? "Adicionar escolhe uma fruta aleatória, como no exemplo original."
          : "Os dados vêm da exportação original do exemplo iOS."}
      </div>
    </section>
  );
}
