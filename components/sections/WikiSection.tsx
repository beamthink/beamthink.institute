"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, History } from 'lucide-react';
import { supabase } from '@/lib/supabase';
// import ReactMarkdown from 'react-markdown'; // Uncomment if available

export default function WikiSection() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [openPage, setOpenPage] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('wiki_pages')
      .select('*')
      .order('updated_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError('Failed to load wiki pages.');
          setPages([]);
        } else {
          setPages(data || []);
        }
        setLoading(false);
      });
  }, []);

  const filteredPages = selectedTag ? pages.filter(p => p.tags && p.tags.includes(selectedTag)) : pages;
  const allTags = Array.from(new Set(pages.flatMap((p: any) => p.tags || [])));

  return (
    <section id="wiki" className="py-24 px-4 bg-gradient-to-br from-black via-gray-900 to-black min-h-screen flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-extrabold tracking-widest text-cyan-200 font-mono mb-2 drop-shadow-[0_0_8px_#0ff]"
        style={{ fontFamily: 'Orbitron, monospace' }}
      >
        Wiki
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="text-cyan-300 text-lg mb-8 text-center max-w-2xl"
      >
        The living brain of the BEAM Institute. Explore the philosophies, protocols, designs, and field experiments that shape our cooperative economy.
      </motion.p>
      {loading && <div className="text-cyan-400 text-lg my-12 animate-pulse">Loading wiki pages...</div>}
      {error && <div className="text-red-400 text-lg my-12">{error}</div>}
      {!loading && !error && (
        <>
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge
              className={`cursor-pointer px-4 py-2 text-cyan-200 border border-cyan-400 bg-black/60 hover:bg-cyan-800/40 transition-all ${!selectedTag ? 'ring-2 ring-cyan-400' : ''}`}
              onClick={() => setSelectedTag(null)}
            >
              All
            </Badge>
            {allTags.map(tag => (
              <Badge
                key={tag}
                className={`cursor-pointer px-4 py-2 text-cyan-200 border border-cyan-400 bg-black/60 hover:bg-cyan-800/40 transition-all ${selectedTag === tag ? 'ring-2 ring-cyan-400' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          {filteredPages.length === 0 && (
            <div className="text-cyan-400 text-lg my-12">No wiki articles found.</div>
          )}
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredPages.map((page, i) => (
                <motion.div
                  key={page.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  whileHover={{ scale: 1.04, boxShadow: '0 0 32px #00fff7' }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="bg-gray-900/80 border border-cyan-400 rounded-2xl p-6 shadow-xl cursor-pointer hover:ring-4 hover:ring-cyan-400/60 transition-all relative group"
                  onClick={() => setOpenPage(page)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="h-6 w-6 text-cyan-300 drop-shadow-[0_0_8px_#0ff]" />
                    <span className="font-bold text-cyan-200 text-lg font-mono" style={{ fontFamily: 'Orbitron, monospace' }}>{page.title}</span>
                    <Badge className="ml-auto bg-cyan-700 text-white font-mono">v{page.version}</Badge>
                  </div>
                  <div className="text-cyan-100 mb-2 text-sm line-clamp-4">
                    {(page.content || '').replace(/[#*\-]/g, '').slice(0, 200)}...
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(page.tags || []).map((tag: string) => (
                      <span key={tag} className="bg-cyan-800 text-cyan-100 px-2 py-1 rounded text-xs font-mono">{tag}</span>
                    ))}
                  </div>
                  <span className="absolute right-4 bottom-4 text-xs text-cyan-400 font-mono">Updated: {page.updated_at?.slice(0, 10)}</span>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-cyan-400/10 pointer-events-none rounded-2xl group-hover:opacity-30 transition-all"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
      <Dialog open={!!openPage} onOpenChange={open => !open && setOpenPage(null)}>
        <DialogContent className="bg-gray-950 border-cyan-400/30 text-white shadow-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold tracking-widest text-cyan-200 font-mono flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
              <BookOpen className="h-7 w-7 text-cyan-300" />
              {openPage?.title}
              <Button size="sm" variant="ghost" className="ml-auto text-cyan-400 border-cyan-400 border" onClick={() => setShowHistory(true)}>
                <History className="h-5 w-5 mr-1" /> Version History
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="prose prose-invert max-w-none text-cyan-100 mt-4">
            {/* <ReactMarkdown>{openPage?.content || ''}</ReactMarkdown> */}
            <pre className="whitespace-pre-wrap font-mono text-cyan-100">{openPage?.content}</pre>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showHistory} onOpenChange={open => setShowHistory(open)}>
        <DialogContent className="bg-gray-950 border-cyan-400/30 text-white shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold tracking-widest text-cyan-200 font-mono flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
              <History className="h-6 w-6 text-cyan-300" /> Version History
            </DialogTitle>
          </DialogHeader>
          <div className="text-cyan-100">
            <ul className="space-y-2">
              <li>v3 - 2024-06-01 (Cooperative Economy)</li>
              <li>v2 - 2024-06-02 (Onboarding Guide)</li>
              <li>v5 - 2024-06-03 (Field Experiments)</li>
            </ul>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" className="border-cyan-400 text-cyan-200" onClick={() => setShowHistory(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}