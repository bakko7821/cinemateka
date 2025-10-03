import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

interface KinopoiskMovie {
  id?: number;
  name?: string;
  description?: string;
  year?: number;
  poster?: { url?: string } | string;
  genres?: Array<{ name?: string } | string>;
  // добавь поля по необходимости
}

function extractKpId(url: string): string | null {
  // ищем /film/123456 или /film/123456/
  const m = url.match(/\/film\/(\d+)(?:\/|$)/i);
  return m ? m[1] : null;
}

router.post("/parse-by-api", async (req: Request, res: Response) => {
  const { url } = req.body as { url?: string };
  if (!url) return res.status(400).json({ error: "URL не указан" });

  const kpId = extractKpId(url);
  if (!kpId) return res.status(400).json({ error: "Не удалось извлечь id из URL" });

  try {
    const apiUrl = `https://api.kinopoisk.dev/v1.4/movie/${kpId}`;
    const apiKey = process.env.KP_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API key не настроен на сервере" });

    const resp = await axios.get<KinopoiskMovie>(apiUrl, {
      headers: { "X-API-KEY": apiKey }
    });

    const data = resp.data;

    // Нормализуем ответ — делаем простую структуру для фронта
    const title = data.name ?? "";
    const year = data.year ?? null;

    // poster может быть объектом или строкой, смотрим по ответу API
    let poster: string | null = null;
    if (!data.poster) poster = null;
    else if (typeof data.poster === "string") poster = data.poster;
    else poster = (data.poster as any).url ?? null;

    // genres: API может возвращать массив строк или объектов
    let genres: string[] = [];
    if (Array.isArray(data.genres)) {
      genres = data.genres.map(g => (typeof g === "string" ? g : (g as any).name)).filter(Boolean);
    }

    return res.json({
      success: true,
      kpId,
      title,
      year,
      poster,
      genres,
      raw: data // опционально — убрать, если не нужен
    });
  } catch (err: any) {
    console.error("kinopoisk API error:", err?.response?.status, err?.response?.data || err.message);
    const status = err?.response?.status ?? 500;
    return res.status(status).json({ error: "Ошибка обращения к kinopoisk API", details: err?.response?.data ?? err.message });
  }
});

interface Movie {
  id: number;
  name: string;
  year: number;
  description?: string;
  poster?: {
    url: string;
    previewUrl: string;
  };
}

export default router;
