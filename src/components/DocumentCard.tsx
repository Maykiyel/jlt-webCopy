import { Box, Text, ActionIcon, Paper, Group } from "@mantine/core";
import {
  Download,
  Print,
  PictureAsPdf,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { useEffect, useRef, useState } from "react";

const DEV_FILE_PROXY_PREFIX = "/__files_proxy";

function toClientFileUrl(rawUrl: string): string {
  if (!import.meta.env.DEV) return rawUrl;

  try {
    const parsedUrl = new URL(rawUrl);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

    if (apiBaseUrl) {
      const parsedApiBase = new URL(apiBaseUrl);
      if (parsedUrl.origin === parsedApiBase.origin) {
        return `${DEV_FILE_PROXY_PREFIX}${parsedUrl.pathname}${parsedUrl.search}`;
      }
    }

    if (
      (parsedUrl.hostname === "127.0.0.1" ||
        parsedUrl.hostname === "localhost") &&
      parsedUrl.port === "8000"
    ) {
      return `${DEV_FILE_PROXY_PREFIX}${parsedUrl.pathname}${parsedUrl.search}`;
    }
  } catch {
    return rawUrl;
  }

  return rawUrl;
}

// ─── PDF Thumbnail ─────────────────────────────────────────────────────────────

function PdfThumbnail({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    async function render() {
      try {
        const pdfjsLib = await import("pdfjs-dist");

        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`Failed to fetch PDF: ${response.status}`);

        objectUrl = URL.createObjectURL(await response.blob());
        if (cancelled) return;

        const pdf = await pdfjsLib.getDocument(objectUrl).promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = canvas.parentElement?.clientWidth ?? 150;

        // Scale to fill width, let height overflow (cropped by container)
        const scale = containerWidth / viewport.width;
        const scaled = page.getViewport({ scale });

        canvas.width = scaled.width;
        canvas.height = scaled.height;

        await page.render({
          canvasContext: canvas.getContext("2d")!,
          viewport: scaled,
          canvas: canvas,
        }).promise;

        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    render();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  if (error) {
    return (
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          gap: "0.4rem",
        }}
      >
        <PictureAsPdf
          width={32}
          height={32}
          style={{ color: "var(--mantine-color-red-6)" }}
        />
        <Text size="0.6rem" c="dimmed" tt="uppercase" lts="0.05em">
          PDF
        </Text>
      </Box>
    );
  }

  return (
    <Box style={{ position: "relative", width: "100%", height: "100%" }}>
      {loading && (
        <Box
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "var(--mantine-color-gray-2)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          display: "block",
          opacity: loading ? 0 : 1,
          transition: "opacity 200ms ease",
          verticalAlign: "top",
        }}
      />
    </Box>
  );
}

// ─── DocumentCard ──────────────────────────────────────────────────────────────

interface DocumentCardProps {
  file: {
    id: number;
    file_name: string;
    file_url: string;
    created_at: string;
  };
}

export function DocumentCard({ file }: DocumentCardProps) {
  const fileUrl = toClientFileUrl(file.file_url);

  const isPdf =
    file.file_name.toLowerCase().endsWith(".pdf") ||
    fileUrl.toLowerCase().includes(".pdf");

  const formattedDate = (() => {
    try {
      return new Date(file.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return file.created_at;
    }
  })();

  return (
    <Paper
      radius="md"
      shadow="none"
      p="0.5rem"
      style={{
        backgroundColor: "rgba(190, 190, 190, 0.5)",
        width: "8.5rem",
        height: "12.25rem",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header: icon + filename + print ── */}
      <Group justify="space-between" mb="0.35rem" wrap="nowrap" align="center">
        <Group
          gap="0.25rem"
          wrap="nowrap"
          style={{ flex: 1, overflow: "hidden" }}
        >
          <PictureAsPdf
            width={16}
            height={16}
            style={{ color: "var(--mantine-color-red-6)", flexShrink: 0 }}
          />
          <Text
            size="0.65rem"
            fw={600}
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={file.file_name}
          >
            {file.file_name}
          </Text>
        </Group>
        <ActionIcon
          variant="subtle"
          color="dark"
          size="xs"
          component="a"
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ flexShrink: 0 }}
        >
          <Print width={16} height={16} />
        </ActionIcon>
      </Group>

      {/* ── Thumbnail ── */}
      <Box
        component="a"
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flex: 1,
          display: "block",
          overflow: "hidden",
          boxShadow: "var(--mantine-shadow-md)",
          cursor: "pointer",
          transition: "opacity 120ms ease",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.opacity = "0.85")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.opacity = "1")
        }
      >
        {isPdf ? (
          <PdfThumbnail url={fileUrl} />
        ) : (
          <img
            src={fileUrl}
            alt={file.file_name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </Box>

      {/* ── Footer: download + date ── */}
      <Group justify="space-between" align="center" mt="0.35rem">
        <ActionIcon
          variant="subtle"
          color="dark"
          size="xs"
          component="a"
          href={fileUrl}
          download={file.file_name}
        >
          <Download width={16} height={16} />
        </ActionIcon>
        <Text size="0.6rem" c="dimmed">
          {formattedDate}
        </Text>
      </Group>
    </Paper>
  );
}
