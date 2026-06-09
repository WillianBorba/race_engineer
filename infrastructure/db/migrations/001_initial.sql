CREATE TABLE IF NOT EXISTS users (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  user_id    CHAR(36)     NOT NULL,
  simulator  VARCHAR(50)  NOT NULL DEFAULT 'acc',
  track      VARCHAR(100),
  car        VARCHAR(100),
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS laps (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  session_id CHAR(36)     NOT NULL,
  lap_number INT          NOT NULL,
  lap_time   INT,          -- milliseconds
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_laps_session FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
);
