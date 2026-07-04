import { Router } from "express";
import { getBancosActivos } from "../controllers/bancosController.js";
import { cotizarCredito } from "../controllers/cotizadorController.js";

const router = Router();

router.get("/api/bancos", getBancosActivos);
router.post("/api/cotizar", cotizarCredito);

export default router;
