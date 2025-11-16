// app/api/search/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Document from "@/models/Document";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const filter = searchParams.get("filter");

    const query = {};

    // === 1. FULL-TEXT SEARCH ===
    if (q) {
      query.$text = { $search: q };
    }

    // === 2. CATEGORY FILTER (team→project) ===
    if (filter && filter !== "all" && !filter.startsWith("topic-")) {
      const [team, project] = filter.split("→").map(s => s.trim());
      if (team) query.team = team;
      if (project) query.project = project;
    }

    // === 3. TOPIC FILTER (topic-AI) ===
    if (filter?.startsWith("topic-")) {
      const topic = filter.split("-")[1];
      query.topics = { $in: [topic] }; // ← CRITICAL: $in for array
    }

    // === 4. EXECUTE QUERY ===
    const results = await Document.find(query)
      .sort(q ? { score: { $meta: "textScore" }, uploadedAt: -1 } : { uploadedAt: -1 })
      .limit(50)
      .select("originalName path mimetype size category topics uploadedAt")
      .lean();

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}