CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS bancos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo_bcra VARCHAR(5) NOT NULL UNIQUE,
  nombre VARCHAR(150) NOT NULL,
  tasa_base_tna NUMERIC(5,2) NOT NULL CHECK (tasa_base_tna >= 0),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS politicas_riesgo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  banco_id UUID NOT NULL REFERENCES bancos(id) ON DELETE CASCADE,
  situacion_bcra_min INT NOT NULL CHECK (situacion_bcra_min BETWEEN 1 AND 5),
  situacion_bcra_max INT NOT NULL CHECK (situacion_bcra_max BETWEEN 1 AND 5),
  score_veraz_min INT NOT NULL CHECK (score_veraz_min BETWEEN 0 AND 999),
  score_veraz_max INT NOT NULL CHECK (score_veraz_max BETWEEN 0 AND 999),
  multiplicador_riesgo NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (multiplicador_riesgo > 0),
  monto_maximo_permitido NUMERIC(15,2) NOT NULL CHECK (monto_maximo_permitido >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_politicas_situacion_bcra_rango
    CHECK (situacion_bcra_min <= situacion_bcra_max),
  CONSTRAINT chk_politicas_score_veraz_rango
    CHECK (score_veraz_min <= score_veraz_max)
);

CREATE TABLE IF NOT EXISTS historial_crediticio_usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL,
  situacion_bcra_actual INT NOT NULL CHECK (situacion_bcra_actual BETWEEN 1 AND 5),
  score_veraz_actual INT NOT NULL CHECK (score_veraz_actual BETWEEN 0 AND 999),
  ingresos_mensuales_declarados NUMERIC(15,2) NOT NULL CHECK (ingresos_mensuales_declarados >= 0),
  tiene_concursos_quiebras BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_politicas_riesgo_banco_id
  ON politicas_riesgo (banco_id);

CREATE INDEX IF NOT EXISTS idx_politicas_riesgo_rangos
  ON politicas_riesgo (
    banco_id,
    situacion_bcra_min,
    situacion_bcra_max,
    score_veraz_min,
    score_veraz_max
  );

CREATE INDEX IF NOT EXISTS idx_historial_crediticio_usuario_id
  ON historial_crediticio_usuarios (usuario_id);

CREATE INDEX IF NOT EXISTS idx_historial_crediticio_score_situacion
  ON historial_crediticio_usuarios (situacion_bcra_actual, score_veraz_actual);

INSERT INTO bancos (id, codigo_bcra, nombre, tasa_base_tna, activo)
VALUES
  ('11111111-1111-1111-1111-111111111111', '011', 'Banco Nacion', 72.50, TRUE),
  ('22222222-2222-2222-2222-222222222222', '007', 'Galicia', 82.00, TRUE),
  ('33333333-3333-3333-3333-333333333333', '017', 'BBVA Argentina', 84.00, TRUE)
ON CONFLICT (codigo_bcra) DO UPDATE
SET
  nombre = EXCLUDED.nombre,
  tasa_base_tna = EXCLUDED.tasa_base_tna,
  activo = EXCLUDED.activo,
  updated_at = NOW();

INSERT INTO politicas_riesgo (
  id,
  banco_id,
  situacion_bcra_min,
  situacion_bcra_max,
  score_veraz_min,
  score_veraz_max,
  multiplicador_riesgo,
  monto_maximo_permitido
)
VALUES
  (
    'aaaaaaaa-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    1,
    1,
    700,
    999,
    1.00,
    9000000.00
  ),
  (
    'aaaaaaaa-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    2,
    4,
    450,
    699,
    1.45,
    3500000.00
  ),
  (
    'bbbbbbbb-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    1,
    1,
    730,
    999,
    1.00,
    12000000.00
  ),
  (
    'bbbbbbbb-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    2,
    4,
    480,
    729,
    1.55,
    4200000.00
  ),
  (
    'cccccccc-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    1,
    1,
    740,
    999,
    1.00,
    11000000.00
  ),
  (
    'cccccccc-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    2,
    4,
    500,
    739,
    1.60,
    4000000.00
  )
ON CONFLICT (id) DO UPDATE
SET
  banco_id = EXCLUDED.banco_id,
  situacion_bcra_min = EXCLUDED.situacion_bcra_min,
  situacion_bcra_max = EXCLUDED.situacion_bcra_max,
  score_veraz_min = EXCLUDED.score_veraz_min,
  score_veraz_max = EXCLUDED.score_veraz_max,
  multiplicador_riesgo = EXCLUDED.multiplicador_riesgo,
  monto_maximo_permitido = EXCLUDED.monto_maximo_permitido,
  updated_at = NOW();

INSERT INTO historial_crediticio_usuarios (
  id,
  usuario_id,
  situacion_bcra_actual,
  score_veraz_actual,
  ingresos_mensuales_declarados,
  tiene_concursos_quiebras
)
VALUES
  (
    'dddddddd-1111-1111-1111-111111111111',
    '99999999-1111-1111-1111-111111111111',
    1,
    782,
    2450000.00,
    FALSE
  ),
  (
    'dddddddd-2222-2222-2222-222222222222',
    '99999999-2222-2222-2222-222222222222',
    3,
    612,
    980000.00,
    FALSE
  )
ON CONFLICT (id) DO UPDATE
SET
  usuario_id = EXCLUDED.usuario_id,
  situacion_bcra_actual = EXCLUDED.situacion_bcra_actual,
  score_veraz_actual = EXCLUDED.score_veraz_actual,
  ingresos_mensuales_declarados = EXCLUDED.ingresos_mensuales_declarados,
  tiene_concursos_quiebras = EXCLUDED.tiene_concursos_quiebras,
  updated_at = NOW();

-- Consulta de simulacion: calcula la TNA personalizada de un usuario contra politicas bancarias.
-- Parametros esperados:
--   :usuario_id UUID
--   :monto_solicitado NUMERIC
SELECT
  h.usuario_id,
  b.id AS banco_id,
  b.codigo_bcra,
  b.nombre AS banco,
  b.tasa_base_tna,
  p.multiplicador_riesgo,
  ROUND(b.tasa_base_tna * p.multiplicador_riesgo, 2) AS tna_personalizada,
  p.monto_maximo_permitido,
  h.situacion_bcra_actual,
  h.score_veraz_actual,
  h.ingresos_mensuales_declarados,
  CASE
    WHEN h.tiene_concursos_quiebras THEN 'RECHAZADO_CONCURSO_QUIEBRA'
    WHEN p.monto_maximo_permitido < :monto_solicitado THEN 'RECHAZADO_MONTO_SUPERA_POLITICA'
    ELSE 'PRE_APROBABLE'
  END AS resultado_evaluacion
FROM historial_crediticio_usuarios h
JOIN politicas_riesgo p
  ON h.situacion_bcra_actual BETWEEN p.situacion_bcra_min AND p.situacion_bcra_max
  AND h.score_veraz_actual BETWEEN p.score_veraz_min AND p.score_veraz_max
JOIN bancos b
  ON b.id = p.banco_id
WHERE h.usuario_id = :usuario_id
  AND b.activo = TRUE
ORDER BY tna_personalizada ASC, p.monto_maximo_permitido DESC;
