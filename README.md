# Magen Israel Backend (NestJS)

A real-time backend for Home Front Command alerts in Israel, built with NestJS.

## Features
- REST API to fetch all alert zones
- WebSocket server for real-time alerts
- Persists latest alert for each zone using Redis
- Broadcasts new alerts to all connected clients
- Sends all latest alerts to new clients on connect

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Redis server running (default: `localhost:6379`)

### Install dependencies
```bash
npm install
```

### Start the server
```bash
npm run start
```

The server will run on [http://localhost:3000](http://localhost:3000) by default.

### Environment Variables
- Configure Redis by editing the `AlertStoreService` constructor if needed.
- Default Redis connection: `localhost:6379`
- To change the port, set the `PORT` environment variable.

## API Endpoints

### `GET /zones`
Returns a list of all alert zones (cities/areas).

**Example:**
```
curl http://localhost:3000/zones
```

### WebSocket `/`
Connect via WebSocket (Socket.IO) to receive real-time alerts.

- **Event:** `all-latest-alerts` — sent on connect, contains latest alert for every zone
- **Event:** `alert` — sent on new alert, contains the alert object

**Example (Socket.IO client):**
```js
socket.on('all-latest-alerts', (alerts) => { ... });
socket.on('alert', (alert) => { ... });
```

## Redis Persistence
- The backend stores the latest alert for each zone in Redis (`alert:zone:<zoneName>`).
- Alerts persist across server restarts as long as Redis is running.
- To change Redis connection, edit `src/alert-store.service.ts`.

## Project Structure
- `src/alerts.gateway.ts` — WebSocket gateway
- `src/alert-store.service.ts` — Redis alert storage
- `src/zones.controller.ts` — REST endpoint for zones

## Notes
- Requires Redis to be running for persistence.
- Designed to be used with the [frontend app](https:///github.com/adi6409/magen_israel_fe).

---

For frontend setup, see [../magen_israel_fe/README.md](https:///github.com/adi6409/magen_israel_fe)
