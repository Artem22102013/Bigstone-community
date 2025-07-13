
"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [text, setText] = useState("");

  useEffect(() => {
    async function fetchText() {
      const res = await fetch("/api/main/");  // your API route
      const data = await res.text();          // get text from response
      setText(data);                          // set it to state
    }
    fetchText();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-red-400 mb-2 tracking-tight">
          We'll be back soon!
        </h1>
        <p className="text-center mb-6" dangerouslySetInnerHTML={{ __html: text }}></p>
      </div>
    </div>
  );
}
