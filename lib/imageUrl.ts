// lib/imageUrl.ts
// 표지 URL 정규화 + 폴백/블러

export const FALLBACK_COVER =
  "https://dummyimage.com/480x640/e5e7eb/9ca3af.png&text=No+Cover";
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjgwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjZWVlZWVlIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+";

const strip = (s: string) => (s || "").trim();

export function normalizeCoverUrl(raw: string): string {
  const url = strip(raw);
  if (!url) return FALLBACK_COVER;

  try {
    const u = new URL(url);

    // google drive (sharing -> direct)
    if (u.hostname === "drive.google.com") {
      const id = u.searchParams.get("id");
      if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
      // /file/d/FILE_ID/view
      const m = u.pathname.match(/\/file\/d\/([^/]+)/);
      if (m?.[1]) return `https://drive.google.com/uc?export=view&id=${m[1]}`;
    }

    // googleusercontent (이미 변환된 경우 그대로)
    if (u.hostname.endsWith("googleusercontent.com")) return url;

    // naver book/shopping (pstatic)
    if (u.hostname.includes("pstatic.net")) return url;

    // aladin
    if (u.hostname.includes("aladin.co.kr")) return url;

    // books.google
    if (u.hostname.includes("books.google.com")) return url;

    // 그 외 https는 그냥 허용
    if (u.protocol === "https:") return url;
  } catch {
    // URL 파싱 실패 → 폴백
  }
  return FALLBACK_COVER;
}
