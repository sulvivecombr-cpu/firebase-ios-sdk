# Firestore Sample — Web

Browser adaptation of `Example/FirestoreSample`. This is not the native iOS SDK running in a browser: it reimplements the sample's views using React and the Firestore emulator's REST interface.

From the repository root:

```sh
docker compose -f docker-compose.base44.yml up -d
```

Open port 3000. No Firebase account or external credentials are required. The emulator imports the exact checked-in `Example/FirestoreSample/data/firestore_export` dataset and uses the original sample's development-only open rules. It is accessible only on the internal Compose network. Do not use these rules in production.

The five demos mirror the native sample: favourite query, strict mapping failure, tolerant mapping failure, additions/deletions without animations, and additions/deletions with animations. Filter requests are evaluated by Firestore, not a local mock. Views refresh from the emulator every two seconds and immediately after writes. Unlike the native SDK's snapshot listeners, this web adaptation uses polling.

Emulator data is temporary: restarting the emulator restores the repository's sample export. The named emulator volume caches only its download. The web service bind-mounts source and uses Vite polling for hot reload. Its proxy keeps browser requests same-origin.

Verify:

```sh
docker compose -f docker-compose.base44.yml exec -T web npm test
docker compose -f docker-compose.base44.yml exec -T web npm run build
docker compose -f docker-compose.base44.yml ps
```
