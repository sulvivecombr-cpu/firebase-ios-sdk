# Base44 sandbox notes

- This checkout is the Firebase Apple SDK, not a web app. Native SDK and SwiftUI samples require macOS/Xcode; do not claim they execute in the Linux/browser preview.
- The user-approved browser adaptation lives in `Example/FirestoreWeb`. Leave native SDK code unchanged. `agents.md` documents the upstream SDK conventions.
- The Base44 Compose stack runs a source-mounted Vite frontend and an internal Firestore emulator. The frontend proxies `/firestore` to the emulator, so browser traffic stays same-origin and no real Firebase credentials are needed.
- Invoke the emulator's `--import-data` with `Example/FirestoreSample/data/firestore_export/firestore_export.overall_export_metadata` (the file, not the directory). It imports the actual checked-in dataset; fruits initially contains 5 documents, 3 favourites. mappingFailure has 2 valid name fields and 1 missing name.
- The emulator's named volume caches only the JAR; document edits are temporary and the original sample is restored when the emulator restarts. Only web port 3000 is exposed. Original permissive emulator rules are not production rules.
- Read updates use REST polling every 2 seconds, not native `@FirestoreQuery` snapshot listeners. Add/delete are real emulator writes.
- Web dependencies are installed with `npm ci` on service startup. To change dependencies, regenerate the sample's package-lock.json with Node in Docker and recreate only the web service. Do not install runtimes on the host.
- Verify with `docker compose -f docker-compose.base44.yml exec -T web npm test`, `... exec -T web npm run build`, and `... ps`. Web health probes both the served page and proxied Firestore documents. Served HTML should reference `/@vite/client` and `/src/main.jsx`, not `dist`.
- Browser checks: toggle from 3 favourites to all 5 fruits; strict mapping blocks the list with an error, tolerant mapping returns 2 names and a warning; in either animation demo add a document, check Firestore persistence, then delete the added document. Keep the sample's original records intact during tests.
