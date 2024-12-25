"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BITLY_API_URL = "https://api-ssl.bitly.com/v4/shorten";
const BITLY_ACCESS_TOKEN = process.env.NEXT_PUBLIC_BITLY_ACCESS_TOKEN;

const UrlShortener: React.FC = () => {
  const [longUrl, setLongUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    try {
      const response = await axios.post(
        BITLY_API_URL,
        {
          long_url: longUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${BITLY_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShortUrl(response.data.link);
    } catch (error) {
      setError("Failed to shorten the URL. Please try again.");
      console.error(error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast("Successfully Copied URL!");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-500 to-gray-700">
      <div className="max-w-lg w-full space-y-6 p-8 rounded-xl bg-background shadow-xl">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold">URL Shortener</h1>
          <p className="text-muted-foreground">
            Paste your long URL and get a short, shareable link.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative flex items-center">
            <Input
              type="url"
              placeholder="Paste your long URL here"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="w-full pr-24 py-3 text-sm rounded-lg"
              required
            />
            <Button
              type="submit"
              className="absolute right-2 top-[17.9px] -translate-y-1/2 px-4 py-3 text-sm rounded-lg translate-x-[10%]"
            >
              Shorten
            </Button>
          </div>
          {error && <div className="text-red-600 text-center text-sm">{error}</div>}
          {shortUrl && (
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="cursor-pointer py-3 text-sm"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-muted/50 p-2"
                onClick={handleCopy}
              >
                <CopyIcon className="w-6 h-6" />
                <span className="sr-only">Copy</span>
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UrlShortener;
