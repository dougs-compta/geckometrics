CREATE TABLE metrics
(
  id          INTEGER DEFAULT nextval('metrics_id_seq' :: REGCLASS) NOT NULL
    CONSTRAINT metrics_pkey
    PRIMARY KEY,
  type        TEXT                                                  NOT NULL,
  date        TIMESTAMP                                             NOT NULL,
  source      TEXT,
  status      INTEGER,
  service     DOUBLE PRECISION,
  memory      DOUBLE PRECISION,
  memoryquota DOUBLE PRECISION,
  load        DOUBLE PRECISION
);
CREATE INDEX metrics_type_index
  ON metrics (type);
CREATE INDEX metrics_date_index
  ON metrics (date);
