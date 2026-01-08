import { useEffect, useState, useCallback } from "react";
import {
  usePixelColors,
  getContrastText,
  type ColorFormat,
} from "pixel-colors";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {
  Upload,
  Copy,
  Image as ImageIcon,
  Sun,
  Moon,
  Check,
  X,
} from "lucide-react";
import { BsGithub } from "react-icons/bs";

import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [count, setCount] = useState([6]);
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [copied, setCopied] = useState(false);

  // useEffect(() => {
  //   // Check if we are in a Puppeteer/Prerender environment
  //   // or just fire it anyway (it's harmless in a normal browser)
  //   document.dispatchEvent(new Event("custom-render-trigger"));
  // }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));

  // Extraction logic - passing format directly ensures the library handles OKLCH/RGB conversion accurately
  const { palette } = usePixelColors(image || "", count[0], { format });
  const dominantColor = palette.length > 0 ? palette[0] : "";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (image) URL.revokeObjectURL(image);
      setImage(URL.createObjectURL(file));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCSS = useCallback(() => {
    const vars = palette.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n");
    return `:root {\n${vars}\n}`;
  }, [palette]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 font-mono selection:bg-primary/30 flex flex-col items-center">
      <nav className="px-6 md:px-20 py-4 border-b border-border w-full flex justify-between items-center sticky top-0 bg-background/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-8">
          <h1 className="text-xl tracking-tighter font-black bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent cursor-default">
            PixelColors
          </h1>
          <a
            href="#"
            className="hidden md:block text-xs tracking-widest opacity-50 hover:opacity-100 transition-opacity"
          >
            Docs
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full relative"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="rounded-full gap-2"
          >
            <a
              href="https://github.com/maynkudu/pixel-colors"
              target="_blank"
              rel="noreferrer"
            >
              <BsGithub className="w-4 h-4" />
              <span>Star</span>
            </a>
          </Button>
        </div>
      </nav>

      <div className="mx-auto w-full max-w-7xl p-6 md:p-10 space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border pb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Image Palette</h2>
            <p className="text-muted-foreground text-sm">
              Extract visual DNA from any image.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 p-3 rounded-2xl border border-border bg-card/30 backdrop-blur-sm shadow-sm">
            <div className="w-32 space-y-2 px-2">
              <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                <span>Count</span>
                <span>{count[0]}</span>
              </div>
              <Slider
                value={count}
                min={1}
                max={10}
                step={1}
                onValueChange={setCount}
              />
            </div>

            <Select
              value={format}
              onValueChange={(v) => setFormat(v as ColorFormat)}
            >
              <SelectTrigger className="w-28 border-none focus:ring-0 font-bold text-xs uppercase bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="font-bold">
                <SelectItem value="hex">HEX</SelectItem>
                <SelectItem value="oklch">OKLCH</SelectItem>
                <SelectItem value="rgb">RGB</SelectItem>
              </SelectContent>
            </Select>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-md h-9 gap-2 font-bold px-4 py-1 cursor-pointer"
                >
                  <Copy className="w-4 h-4" /> Export CSS
                </Button>
              </DialogTrigger>
              <DialogContent className="font-mono sm:max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Tailwind / CSS Variables</DialogTitle>
                </DialogHeader>
                <div className="relative">
                  <pre className="p-5 rounded-xl border bg-muted text-[11px] leading-relaxed overflow-x-auto max-h-75">
                    {generateCSS()}
                  </pre>
                  <Button
                    size="sm"
                    className="absolute top-3 right-3 shadow-md"
                    onClick={() => copyToClipboard(generateCSS())}
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 h-125 max-h-125 transition-all duration-1000 ease-in-out">
          {/* Left Side: Image Wrapper */}
          <div className="lg:col-span-8 h-125 flex flex-col">
            {!image ? (
              <label className="flex flex-col items-center justify-center grow rounded-3xl border-2 border-dashed border-border bg-muted/5 hover:bg-muted/10 hover:border-primary/50 transition-all cursor-pointer group">
                <div className="text-center space-y-4">
                  <div className="p-5 bg-background rounded-2xl shadow-xl inline-block group-hover:scale-110 transition-transform border border-border">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold">Select Inspiration</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      Supports PNG, JPG, WebP
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </label>
            ) : (
              <Card
                className="relative grow flex items-center justify-center rounded-3xl overflow-hidden bg-muted/20 border-border group transition-all duration-1000"
                style={{
                  filter: dominantColor
                    ? `drop-shadow(0 0 3.5rem color-mix(in srgb, ${dominantColor}, transparent 50%))`
                    : "none",
                }}
              >
                <img
                  src={image}
                  className="w-full h-full object-contain p-8"
                  alt="Source"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-6 right-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </Card>
            )}
          </div>

          {/* Right Side: Palette Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 grid-rows-5 gap-3 h-full">
            {palette.map((color, i) => (
              <Popover key={`${color}-${i}`}>
                <PopoverTrigger asChild>
                  <button
                    style={{
                      backgroundColor: color,
                      color: getContrastText(color),
                    }}
                    className="relative rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-[1.03] hover:z-10 active:scale-95 border border-white/10 shadow-lg group overflow-hidden"
                  >
                    <span className="font-bold text-[10px] tracking-tighter uppercase z-10 truncate px-2 w-full text-center">
                      {color}
                    </span>
                    {i === 0 && (
                      <span className="absolute top-2 left-3 text-[8px] font-black uppercase opacity-40 leading-none">
                        Dom
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-40 p-1.5 rounded-xl shadow-2xl"
                  side="bottom"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 font-bold text-[10px] h-8"
                    onClick={() => copyToClipboard(color)}
                  >
                    <Copy className="w-3 h-3 text-muted-foreground" />
                    {copied ? "COPIED!" : "COPY VALUE"}
                  </Button>
                </PopoverContent>
              </Popover>
            ))}

            {Array.from({ length: Math.max(0, 10 - palette.length) }).map(
              (_, i) => (
                <div
                  key={`empty-${i}`}
                  className="rounded-2xl border border-border/40 border-dashed flex items-center justify-center bg-muted/5"
                >
                  <ImageIcon className="w-4 h-4 opacity-10" />
                </div>
              ),
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
