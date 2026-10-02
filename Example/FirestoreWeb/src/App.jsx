import React, { useState } from "react";
import FruitDemo from "./FruitDemo.jsx";

const demos = [
  {
    id: "query",
    label: "Property Wrappers",
    eyebrow: "CONSULTAS",
    icon: "▤",
    title: "Suas frutas, em tempo real.",
    description:
      "Explore uma coleção do Firestore e veja como uma consulta traz apenas os documentos que você precisa.",
    collection: "fruits",
    code: '@FirestoreQuery(\n  collectionPath: "fruits",\n  predicates: [\n    .where("isFavourite",\n           isEqualTo: true)\n  ]\n)',
    detail:
      "O filtro altera a consulta no emulador. A lista é atualizada a cada 2 segundos.",
    file: "FavouriteFruitsView.swift",
  },
  {
    id: "strict",
    label: "Falha de mapeamento",
    eyebrow: "TRATAMENTO DE ERROS",
    icon: "!",
    title: "Um erro também ensina.",
    description:
      "Veja o que acontece quando um documento não corresponde ao modelo esperado e a consulta interrompe o mapeamento.",
    collection: "mappingFailure",
    code: '@FirestoreQuery(\n  collectionPath: "mappingFailure",\n  decodingFailureStrategy: .raise\n)',
    detail:
      "Estratégia .raise: um documento incompatível impede a apresentação de toda a lista.",
    file: "FavouriteFruitsMappingErrorView.swift",
  },
  {
    id: "tolerant",
    label: "Mapeamento tolerante",
    eyebrow: "TRATAMENTO DE ERROS",
    icon: "✓",
    title: "Continue com os dados válidos.",
    description:
      "Documentos incompatíveis são ignorados. Os resultados válidos continuam disponíveis, acompanhados de um aviso.",
    collection: "mappingFailure",
    code: '@FirestoreQuery(\n  collectionPath: "mappingFailure",\n  decodingFailureStrategy: .ignore\n)',
    detail:
      "Estratégia .ignore: preserva os documentos válidos e informa os erros de mapeamento.",
    file: "FavouriteFruitsMappingErrorView2.swift",
  },
  {
    id: "plain",
    label: "Sem animações",
    eyebrow: "ANIMAÇÕES",
    icon: "≡",
    title: "Mudanças sem transições.",
    description:
      "Adicione e exclua documentos de verdade. Aqui, os itens entram e saem da lista sem animação.",
    collection: "fruits",
    code: '@FirestoreQuery(\n  collectionPath: "fruits",\n  predicates: [\n    .where("isFavourite",\n           isEqualTo: true)\n  ]\n)',
    detail:
      "As adições e exclusões são compartilhadas por todas as demonstrações da coleção fruits.",
    file: "FavouriteFruitsNoAnimationsView.swift",
  },
  {
    id: "animated",
    label: "Com animações",
    eyebrow: "ANIMAÇÕES",
    icon: "✧",
    title: "Pequenas mudanças, mais fluidas.",
    description:
      "A mesma coleção, com transições suaves ao adicionar ou remover uma fruta. Experimente e compare.",
    collection: "fruits",
    code: '@FirestoreQuery(\n  collectionPath: "fruits",\n  predicates: [\n    .where("isFavourite",\n           isEqualTo: true)\n  ],\n  animation: .default\n)',
    detail:
      "A versão web usa transições CSS para representar as animações do exemplo SwiftUI.",
    file: "FavouriteFruitsAnimationView.swift",
  },
];

export default function App() {
  const [selected, setSelected] = useState("query");
  const [connection, setConnection] = useState("loading");
  const demo = demos.find((item) => item.id === selected);
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="Firestore Sample, início">
          <span className="brand-mark">🔥</span>
          <span>
            Firebase<span className="brand-sub">SAMPLE LAB</span>
          </span>
        </a>
        <div className="workspace-label">
          <span className="workspace-icon">▱</span>
          <div>
            Firestore Sample<small>Apple SDK → Web</small>
          </div>
          <span className="workspace-dot" />
        </div>
        <nav aria-label="Demonstrações">
          <p className="nav-heading">DEMONSTRAÇÕES</p>
          {demos.slice(0, 3).map((item) => (
            <button
              key={item.id}
              aria-current={selected === item.id ? "page" : undefined}
              onClick={() => setSelected(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              <span className="nav-arrow">›</span>
            </button>
          ))}
          <p className="nav-heading second">ANIMAÇÕES</p>
          {demos.slice(3).map((item) => (
            <button
              key={item.id}
              aria-current={selected === item.id ? "page" : undefined}
              onClick={() => setSelected(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              <span className="nav-arrow">›</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span>⌘</span>
          <strong>Do SwiftUI para o navegador</strong>
          <p>
            Uma adaptação interativa do exemplo original do Firebase Apple SDK.
          </p>
          <a
            href="https://github.com/firebase/firebase-ios-sdk/tree/main/Example/FirestoreSample"
            target="_blank"
            rel="noreferrer"
          >
            Ver exemplo original ↗
          </a>
        </div>
        <div className="sidebar-footer">
          <span className="tiny-dot" /> AMBIENTE DE DESENVOLVIMENTO
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            Sample Lab <span>/</span> <strong>Cloud Firestore</strong>
          </div>
          <span className={`connection ${connection}`} role="status">
            <span />
            {connection === "online"
              ? "Emulador conectado"
              : connection === "offline"
                ? "Emulador indisponível"
                : "Conectando ao emulador"}
          </span>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <span className="eyebrow">FIREBASE APPLE SDK · EXEMPLO WEB</span>
              <h1>
                Firestore playground<span>.</span>
              </h1>
              <p>
                Experimente consultas, explore erros e dê vida aos seus dados.
              </p>
            </div>
            <span className="local-badge">▱ &nbsp; LOCAL, SEM CREDENCIAIS</span>
          </div>
          <section className="hero">
            <div>
              <span className="hero-tag">{demo.eyebrow}</span>
              <h2>{demo.title}</h2>
              <p>{demo.description}</p>
              <div className="hero-meta">
                <span>◉</span> Dados reais do emulador{" "}
                <span className="meta-divider">·</span> Baseado no exemplo
                SwiftUI
              </div>
            </div>
            <div className="database-art" aria-hidden="true">
              <div className="art-orbit" />
              <div className="db-cylinder">
                <div className="db-layer" />
                <div className="db-layer" />
                <div className="db-layer" />
                <span>▤</span>
              </div>
              <span className="art-star">✦</span>
              <span className="art-dot" />
            </div>
          </section>
          <div className="demo-grid">
            <FruitDemo key={demo.id} demo={demo} onConnection={setConnection} />
            <aside className="info-column">
              <section className="code-card">
                <div className="card-title">
                  <span className="code-icon">⌘</span>
                  <h3>Por trás da consulta</h3>
                  <span className="language-tag">SWIFT</span>
                </div>
                <p>O trecho do exemplo nativo que inspira esta demonstração.</p>
                <pre>
                  <code>{demo.code}</code>
                </pre>
                <div className="code-footer">
                  <span>↳</span> {demo.file}
                </div>
              </section>
              <section className="explanation-card">
                <span className="info-symbol">i</span>
                <h3>Como funciona</h3>
                <p>{demo.detail}</p>
                <div className="collection-detail">
                  <span>Coleção</span>
                  <code>{demo.collection}</code>
                </div>
              </section>
            </aside>
          </div>
          <footer className="page-footer">
            <span>
              Feito para explorar. Sem tocar nos seus dados de produção.
            </span>
            <span>
              Firestore Sample <span className="footer-separator">/</span> Web
              adaptation
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
