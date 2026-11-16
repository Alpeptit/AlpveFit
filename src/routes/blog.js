import express from "express";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { pool } from "../db/pool.js";

// Herkese açık blog: yalnız YAYINDAKİ yazılar. Yazma/yayınlama yönetici API'sindedir (/api/admin/blog).
export const blogRouter = withAsyncErrors(express.Router());
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

blogRouter.get("/blog", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT slug, title, excerpt, author_name, published_at FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC LIMIT 100`
  );
  res.setHeader("Cache-Control", "public, max-age=60");
  res.json(rows);
});

blogRouter.get("/blog/:slug", async (req, res) => {
  if (!SLUG_RE.test(req.params.slug) || req.params.slug.length > 80) return res.status(404).json({ error: "Yazı bulunamadı." });
  const { rows } = await pool.query(
    `SELECT slug, title, excerpt, body, author_name, published_at FROM blog_posts WHERE slug = $1 AND status = 'published'`, [req.params.slug]
  );
  if (!rows.length) return res.status(404).json({ error: "Yazı bulunamadı." });
  res.setHeader("Cache-Control", "public, max-age=60");
  res.json(rows[0]);
});
