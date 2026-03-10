import { Box, Text, ActionIcon, Paper, Group } from "@mantine/core";
import {
  Download,
  Print,
  PictureAsPdf,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { useEffect, useRef, useState } from "react";
import type { QuotationFileResource } from "@/features/quotations/types/quotations.types";
import { apiClient } from "@/lib/api/client";

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

        const response = await apiClient.get(url, {
          responseType: "blob",
          baseURL: "",
        });

        objectUrl = URL.createObjectURL(response.data);
        if (cancelled) return;

        const pdf = await pdfjsLib.getDocument(objectUrl).promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = canvas.parentElement?.clientWidth ?? 150;
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
          height: "100%",
          gap: "0.4rem",
        }}
      >
        <PictureAsPdf
          width={36}
          height={36}
          style={{ color: "var(--mantine-color-red-6)" }}
        />
        <Text size="0.65rem" c="dimmed" tt="uppercase" lts="0.05em">
          PDF Document
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
            borderRadius: "0.25rem",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          opacity: loading ? 0 : 1,
          transition: "opacity 200ms ease",
        }}
      />
    </Box>
  );
}

// ─── DocumentCard ──────────────────────────────────────────────────────────────

interface DocumentCardProps {
  file: QuotationFileResource;
}

export function DocumentCard({ file }: DocumentCardProps) {
  const isPdf =
    file.file_name.toLowerCase().endsWith(".pdf") ||
    file.file_url.toLowerCase().includes(".pdf");

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
      p="0.75rem"
      style={{
        border: "1px solid var(--mantine-color-gray-3)",
        backgroundColor: "#fff",
      }}
    >
      {/* ── Header ── */}
      <Group justify="space-between" mb="0.5rem" wrap="nowrap">
        <Group
          gap="0.25rem"
          wrap="nowrap"
          style={{ flex: 1, overflow: "hidden" }}
        >
          <PictureAsPdf
            width={14}
            height={14}
            style={{ color: "var(--mantine-color-red-6)", flexShrink: 0 }}
          />
          <Text
            size="0.7rem"
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
          size="sm"
          component="a"
          href={file.file_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ flexShrink: 0 }}
        >
          <Print width={14} height={14} />
        </ActionIcon>
      </Group>

      {/* ── Thumbnail ── */}
      <Box
        component="a"
        href={file.file_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          height: "8rem",
          backgroundColor: "var(--mantine-color-gray-1)",
          borderRadius: "0.375rem",
          marginBottom: "0.5rem",
          overflow: "hidden",
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
          <PdfThumbnail url={file.file_url} />
        ) : (
          <img
            src={file.file_url}
            alt={file.file_name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </Box>

      {/* ── Footer ── */}
      <Group justify="space-between" align="center">
        <ActionIcon
          variant="subtle"
          color="dark"
          size="sm"
          component="a"
          href={file.file_url}
          download={file.file_name}
        >
          <Download width={14} height={14} />
        </ActionIcon>
        <Text size="0.65rem" c="dimmed">
          {formattedDate}
        </Text>
      </Group>
    </Paper>
  );
}
