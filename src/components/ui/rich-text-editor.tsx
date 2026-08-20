"use client";

import { useCallback, useRef } from "react";

import {
  Bold,
  Code,
  List,
  Code2,
  Link2,
  Redo2,
  Undo2,
  Minus,
  Quote,
  Table2,
  Trash2,
  Eraser,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  AlignLeft,
  AlignRight,
  Highlighter,
  AlignCenter,
  ListOrdered,
  AlignJustify,
  Strikethrough,
  Underline as UnderlineIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
} from "lucide-react";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import TextAlign from "@tiptap/extension-text-align";
import TableCell from "@tiptap/extension-table-cell";
import Superscript from "@tiptap/extension-superscript";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import TableHeader from "@tiptap/extension-table-header";
import { useEditor, EditorContent } from "@tiptap/react";
import CharacterCount from "@tiptap/extension-character-count";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { cn } from "@/lib/utils";
import { useUploadImage } from "@/features/media/hooks/use-upload-image";

interface RichTextEditorProps {
  value: string;
  placeholder?: string;
  characterLimit?: number;
  onChange: (html: string) => void;
}

function ToolbarDivider() {
  return <div className="mx-1 h-4 w-px shrink-0 bg-border" />;
}

export function RichTextEditor({
  value,
  onChange,
  characterLimit,
  placeholder = "Nhập mô tả sản phẩm...",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadImage = useUploadImage();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: "text-primary underline underline-offset-2" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ HTMLAttributes: { class: "rounded-md max-w-full" } }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder }),
      ...(characterLimit
        ? [CharacterCount.configure({ limit: characterLimit })]
        : []),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[220px] px-3 py-2 focus:outline-none",
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageItem = items.find((item) => item.type.startsWith("image/"));
        if (imageItem) {
          const file = imageItem.getAsFile();
          if (file) {
            handleImageUpload(file);
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor) return;
      try {
        const { url } = await uploadImage.mutateAsync(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error("Upload ảnh thất bại", error);
      }
    },
    [editor, uploadImage],
  );

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    e.target.value = "";
  };

  const handleSetLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Nhập URL:", previousUrl ?? "");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleInsertTable = () => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  if (!editor) return null;

  const isInTable = editor.isActive("table");
  const charCount = characterLimit
    ? editor.storage.characterCount?.characters?.()
    : undefined;

  return (
    <div className="rounded-md border border-input">
      <div className="sticky -top-4 z-10 flex flex-wrap items-center gap-1 rounded-t-md border-b bg-background px-2 py-1">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Hoàn tác"
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Làm lại"
        >
          <Redo2 className="size-4" />
        </Button>

        <ToolbarDivider />

        <Button
          type="button"
          size="icon-sm"
          variant={
            editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          title="Tiêu đề 1"
        >
          <Heading1 className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={
            editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Tiêu đề 2"
        >
          <Heading2 className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={
            editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="Tiêu đề 3"
        >
          <Heading3 className="size-4" />
        </Button>

        <ToolbarDivider />

        <Button
          type="button"
          size="icon-sm"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Đậm"
        >
          <Bold className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Nghiêng"
        >
          <Italic className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={editor.isActive("underline") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Gạch chân"
        >
          <UnderlineIcon className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={editor.isActive("strike") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Gạch ngang"
        >
          <Strikethrough className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={editor.isActive("code") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Code inline"
        >
          <Code className="size-4" />
        </Button>

        <ToolbarDivider />

        <Button
          type="button"
          size="icon-sm"
          variant={editor.isActive("subscript") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          title="Chỉ số dưới"
        >
          <SubscriptIcon className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={editor.isActive("superscript") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          title="Chỉ số trên"
        >
          <SuperscriptIcon className="size-4" />
        </Button>

        <ToolbarDivider />

        <label
          className="relative flex size-7 cursor-pointer items-center justify-center rounded-md hover:bg-accent"
          title="Màu chữ"
        >
          <span
            className="text-xs font-bold"
            style={{ color: editor.getAttributes("textStyle").color }}
          >
            A
          </span>
          <input
            type="color"
            className="absolute inset-0 size-full cursor-pointer opacity-0"
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
          />
        </label>
        <Button
          type="button"
          size="icon-sm"
          variant={editor.isActive("highlight") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          title="Bôi vàng (highlight)"
        >
          <Highlighter className="size-4" />
        </Button>

        <ToolbarDivider />

        <Button
          type="button"
          size="icon-sm"
          variant={
            editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"
          }
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Căn trái"
        >
          <AlignLeft className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={
            editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"
          }
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Căn giữa"
        >
          <AlignCenter className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={
            editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"
          }
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Căn phải"
        >
          <AlignRight className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={
            editor.isActive({ textAlign: "justify" }) ? "secondary" : "ghost"
          }
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          title="Căn đều"
        >
          <AlignJustify className="size-4" />
        </Button>

        <ToolbarDivider />

        <Button
          type="button"
          size="icon-sm"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Danh sách"
        >
          <List className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Danh sách số"
        >
          <ListOrdered className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Trích dẫn"
        >
          <Quote className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={editor.isActive("codeBlock") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Khối code"
        >
          <Code2 className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Đường kẻ ngang"
        >
          <Minus className="size-4" />
        </Button>

        <ToolbarDivider />

        <Button
          type="button"
          size="icon-sm"
          variant={editor.isActive("link") ? "secondary" : "ghost"}
          onClick={handleSetLink}
          title="Chèn liên kết"
        >
          <Link2 className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={handlePickFile}
          disabled={uploadImage.isPending}
          title="Chèn hình ảnh"
        >
          {uploadImage.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <ImageIcon className="size-4" />
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <ToolbarDivider />

        <Button
          type="button"
          size="icon-sm"
          variant={isInTable ? "secondary" : "ghost"}
          onClick={handleInsertTable}
          title="Chèn bảng"
        >
          <Table2 className="size-4" />
        </Button>
        {isInTable && (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => editor.chain().focus().deleteTable().run()}
            title="Xoá bảng"
          >
            <Trash2 className="size-4" />
          </Button>
        )}

        <ToolbarDivider />

        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          title="Xoá định dạng"
        >
          <Eraser className="size-4" />
        </Button>
      </div>

      <EditorContent spellCheck="false" editor={editor} />

      {characterLimit && (
        <div
          className={cn(
            "border-t px-3 py-1 text-right text-xs text-muted-foreground",
            charCount !== undefined &&
              charCount > characterLimit &&
              "text-destructive",
          )}
        >
          {charCount ?? 0} / {characterLimit}
        </div>
      )}
    </div>
  );
}
