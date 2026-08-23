import { useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ImagePlus, Send, Upload, X, Menu, Home as HomeIcon, BookOpen, Images, Mail, MessageCircle, Settings2, Play, Music2, Video, LogOut } from "lucide-react";
import { toast } from "sonner";
import { getLastReadAt, markChatRead, resetChatRead, switchIdentityReadState } from "@shared/unread";

type Identity = "Flinter" | "Josua";
type Page = "beranda" | "alasan" | "kenangan" | "galeri" | "surat" | "chat" | "kelola";

const identityMeta: Record<Identity, { color: string; initials: string; subtitle: string }> = {
  Flinter: { color: "#e8849a", initials: "F", subtitle: "Baginda Ratu Flinteria" },
  Josua: { color: "#d4a853", initials: "J", subtitle: "Peci yang selalu memilihmu" },
};

const staticMemories = [
  ["Hari Pertama", "Pertama Kali Bertemu", "Waktu pertama kali kita bertemu adalah ketika NSO, kamu jarang terlihat, tetapi aku selalu sadar kalau ada yang kurang dari Biologi."],
  ["Hari Dimana Interaksi konkret Kita Dimulai", "Waktu Aku Ambil Jedaimu yang Warna Kuning Itu", "Ini adalah awal aku tertarik padamu, karena kamu begitu lucu sekali dan bisa aku jahili, dan puncaknya kamu kejar aku sampai di depan kelas dan dilihat anak kamarmu sendiri dan dikira aku jadian samamu dan ternyata itu terwujud."],
  ["Minggu-Minggu Berikutnya", "Ternyata kita tidak sekelas", "Obrolan kita yang dimulai dari hal sepele perlahan berubah menjadi sesuatu yang lebih dalam sampai akhirnya tanggal 5 Mei 2025 kita teleponan untuk pertama kalinya dan jadian di telepon setelah kamu berkata \"Ooohh... Gini ya rasanya punya pacar\" hehehe, aku masih inget banget."],
  ["Makan Martabak di FJ", "Aku beli dua Martabak mini", "Seneng banget waktu kamu nyuapin aku martabak pakai sendok, gak cuma sendok tapi pake tangan, suka banget disuapin samamu."],
  ["Waktu ke Cinepolis", "Kamu mau belanja ke Cinepolis, belanja ke foodmart, waktu itu aku baru pulang gym", "Semangat banget waktu bisa jalan bareng cuma berduaan ke Cinepolis, inget banget waktu cium pipimu, terus kamu nyenggol rak foodmart sampe goyang, terus kita ketawa-ketiwi bareng."],
  ["Hari-hari selanjutnya", "Boneka Ice Bear masih ada di sini", "Ini bukan akhir, ini baru permulaan. Masih banyak kenangan yang akan kita buat bersama, dan nanti akan ada lagi, mohon bersabar hingga kita bisa bertemu lagi, karena aku masih perlu waktu untuk mempersiapkannya lagi untukmu yang spesial."],
];

const bundledMedia = [
  { id: "bundled-1", mediaType: "image", category: "kenangan", memoryIndex: 0, title: "Pertama kali bertemu", caption: "Awal kecil dari cerita besar kita.", fileUrl: "/manus-storage/IMG-20250621-WA0067_b10e3e78.jpg", uploadedBy: "Flinter & Josua", createdAt: "2025-04-22T00:00:00.000Z" },
  { id: "bundled-2", mediaType: "image", category: "kenangan", memoryIndex: 1, title: "Jeda warna kuning", caption: "Momen ketika interaksi kita mulai terasa berbeda.", fileUrl: "/manus-storage/IMG-20250422-WA0006_63262738.jpg", uploadedBy: "Flinter & Josua", createdAt: "2025-05-13T00:00:00.000Z" },
  { id: "bundled-3", mediaType: "image", category: "kenangan", memoryIndex: 2, title: "Ternyata kita tidak sekelas", caption: "Awal teleponan dan jadian yang masih diingat sampai sekarang.", fileUrl: "/manus-storage/IMG-20250628-WA0052_6e2c8368.jpg", uploadedBy: "Flinter & Josua", createdAt: "2025-06-28T00:00:00.000Z" },
  { id: "bundled-4", mediaType: "image", category: "kenangan", memoryIndex: 3, title: "Martabak mini", caption: "Seneng banget waktu kamu menyuapiku martabak.", fileUrl: "/manus-storage/IMG-20250601-WA0011_91c615a5.jpg", uploadedBy: "Flinter & Josua", createdAt: "2025-06-01T00:00:00.000Z" },
  { id: "bundled-5", mediaType: "image", category: "kenangan", memoryIndex: 4, title: "Hari di Cinepolis", caption: "Foodmart, tawa, dan cerita yang masih terasa.", fileUrl: "/manus-storage/IMG-20250628-WA0055_59575e03.jpg", uploadedBy: "Flinter & Josua", createdAt: "2025-06-28T00:00:00.000Z" },
  { id: "bundled-6", mediaType: "image", category: "galeri", title: "Senyum terindah", caption: "Senyum yang selalu ingin kulihat.", fileUrl: "/manus-storage/IMG-20251216-WA0016_2124eb38.jpg", uploadedBy: "Flinter & Josua", createdAt: "2025-12-16T00:00:00.000Z" },
  { id: "bundled-7", mediaType: "image", category: "galeri", title: "Hari yang sempurna", caption: "Satu hari yang ingin kusimpan lama-lama.", fileUrl: "/manus-storage/IMG-20251124-WA0007_39ecec81.jpg", uploadedBy: "Flinter & Josua", createdAt: "2025-11-24T00:00:00.000Z" },
  { id: "bundled-8", mediaType: "image", category: "galeri", title: "Pertemuan setelah UPH", caption: "Akhirnya bertemu lagi setelah sekian cerita.", fileUrl: "/manus-storage/IMG-20250930-WA0103_535026e1.jpg", uploadedBy: "Flinter & Josua", createdAt: "2025-09-30T00:00:00.000Z" },
  { id: "bundled-9", mediaType: "image", category: "galeri", title: "Energi baruku", caption: "Senyuman manismu adalah energi baruku.", fileUrl: "/manus-storage/IMG-20250521-WA0009_76c4f4ab.jpg", uploadedBy: "Flinter & Josua", createdAt: "2025-05-21T00:00:00.000Z" },
  { id: "bundled-10", mediaType: "image", category: "galeri", title: "Carissima", caption: "Paling disayang.", fileUrl: "/manus-storage/Carissime_20260801_103034_0000_8083161a.png", uploadedBy: "Flinter & Josua", createdAt: "2026-08-01T00:00:00.000Z" },
  { id: "bundled-11", mediaType: "image", category: "galeri", title: "Video call", caption: "Momen kecil dari layar yang terasa dekat.", fileUrl: "/manus-storage/Screenshot_2025-05-20-20-09-14-662_com.whatsapp_c1dcec13.jpg", uploadedBy: "Flinter & Josua", createdAt: "2025-05-20T00:00:00.000Z" },
  { id: "bundled-12", mediaType: "image", category: "galeri", title: "Siluet martabak", caption: "Pap yang kamu fotoin waktu makan martabak di FJ.", fileUrl: "/manus-storage/IMG-20250621-WA0063_256303ad.jpg", uploadedBy: "Flinter & Josua", createdAt: "2025-06-21T00:00:00.000Z" },
  { id: "bundled-13", mediaType: "image", category: "galeri", title: "Pap darimu", caption: "Tidak sempat foto bersama, tetapi tetap kusimpan.", fileUrl: "/manus-storage/IMG-20250516-WA0019_36134872.jpg", uploadedBy: "Flinter & Josua", createdAt: "2025-05-16T00:00:00.000Z" },
  { id: "bundled-14", mediaType: "image", category: "galeri", title: "Momen yang kusimpan", caption: "Satu lagi potret kecil dari perjalanan kita.", fileUrl: "/manus-storage/IMG-20250514-WA0004_54616754.jpg", uploadedBy: "Flinter & Josua", createdAt: "2025-05-14T00:00:00.000Z" },
  { id: "bundled-15", mediaType: "image", category: "galeri", title: "Setelah hari kelulusan", caption: "Pap yang tetap terasa dekat meski tidak sempat berfoto bersama.", fileUrl: "/manus-storage/IMG-20250516-WA0012_a3b862a5.jpg", uploadedBy: "Flinter & Josua", createdAt: "2025-05-16T00:00:00.000Z" },
  { id: "bundled-16", mediaType: "image", category: "galeri", title: "Nona yang selalu cantik", caption: "Tidak sempat foto berdua, tetapi tetap jadi momen istimewa.", fileUrl: "/manus-storage/IMG-20250516-WA0017_3d09ab97.jpg", uploadedBy: "Flinter & Josua", createdAt: "2025-05-16T00:00:00.000Z" },
  { id: "bundled-17", mediaType: "image", category: "galeri", title: "Senyum yang menghangatkan", caption: "Cerita lain dari hari-hari yang ingin diingat.", fileUrl: "/manus-storage/IMG-20250621-WA0067_b10e3e78.jpg", uploadedBy: "Flinter & Josua", createdAt: "2025-06-21T00:00:00.000Z" },
  { id: "bundled-18", mediaType: "video", category: "galeri", title: "Cerita bergerak", caption: "Satu momen yang lebih indah ketika diputar kembali.", fileUrl: "/manus-storage/VID-20260111-WA0021_053cbbd5.mp4", uploadedBy: "Flinter & Josua", createdAt: "2026-01-11T00:00:00.000Z" },
  { id: "bundled-19", mediaType: "video", category: "galeri", title: "Kenangan lain", caption: "Simpan, putar, dan kenang lagi nanti.", fileUrl: "/manus-storage/20250607_153743_16cfe309.mp4", uploadedBy: "Flinter & Josua", createdAt: "2025-06-07T00:00:00.000Z" },
];

function Avatar({ identity, small = false }: { identity: Identity; small?: boolean }) {
  const meta = identityMeta[identity];
  return <span className={`avatar ${small ? "avatar-small" : ""}`} style={{ background: `linear-gradient(135deg, ${meta.color}, #5d304d)` }}>{meta.initials}</span>;
}

function IdentityGate({ onEnter }: { onEnter: (identity: Identity) => void }) {
  return <main className="gate-shell">
    <div className="gate-orbit orbit-one" /><div className="gate-orbit orbit-two" />
    <div className="gate-card">
      <div className="brand-mark"><Heart size={17} fill="currentColor" /> For You</div>
      <span className="eyebrow">Ruang kecil untuk dua hati</span>
      <h1>Masuk sebagai<br /><em>siapa?</em></h1>
      <p className="gate-copy">Pilih namamu untuk membuka kenangan, surat, dan percakapan yang hanya kita berdua miliki.</p>
      <div className="identity-grid">
        {(["Flinter", "Josua"] as Identity[]).map(identity => <button key={identity} className="identity-card" onClick={() => onEnter(identity)}>
          <Avatar identity={identity} /><span><strong>{identity}</strong><small>{identityMeta[identity].subtitle}</small></span><span className="identity-arrow">→</span>
        </button>)}
      </div>
      <p className="gate-note"><Heart size={12} fill="currentColor" /> Pilihan ini menentukan nama pengirim pesanmu.</p>
    </div>
  </main>;
}

function MediaCard({ item, onOpen, onDelete }: { item: any; onOpen?: (url: string) => void; onDelete?: () => void }) {
  return <article className="media-card">
    <div className="media-visual">
      {item.mediaType === "image" && <button className="image-button" onClick={() => onOpen?.(item.fileUrl)} aria-label={`Buka ${item.title}`}><img src={item.fileUrl} alt={item.title} /></button>}
      {item.mediaType === "video" && <><video src={item.fileUrl} controls preload="metadata" /><span className="media-badge"><Video size={12} /> Video</span></>}
      {item.mediaType === "audio" && <div className="audio-tile"><Music2 size={28} /><audio src={item.fileUrl} controls /></div>}
    </div>
    <div className="media-info"><h4>{item.title}</h4>{item.caption && <p>{item.caption}</p>}<small>{item.uploadedBy} · {new Date(item.createdAt).toLocaleDateString("id-ID")}</small>{onDelete && <button className="delete-media" onClick={onDelete}>Hapus</button>}</div>
  </article>;
}

function readIdentity(): Identity | null {
  const queryValue = new URLSearchParams(window.location.search).get("identity");
  const value = queryValue || sessionStorage.getItem("fj-identity");
  return value === "Flinter" || value === "Josua" ? value : null;
}

function readPage(): Page {
  const value = new URLSearchParams(window.location.search).get("page");
  const pages: Page[] = ["beranda", "alasan", "kenangan", "galeri", "surat", "chat", "kelola"];
  return pages.includes(value as Page) ? value as Page : "beranda";
}

export default function Home() {
  const [identity, setIdentity] = useState<Identity | null>(readIdentity);
  const [page, setPage] = useState<Page>(readPage);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [draft, setDraft] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<"galeri" | "kenangan">("galeri");
  const [file, setFile] = useState<File | null>(null);
  const [memoryIndex, setMemoryIndex] = useState(0);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lastReadAt, setLastReadAt] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesQuery = trpc.chat.list.useQuery(undefined, { enabled: Boolean(identity) && page === "chat", refetchInterval: page === "chat" ? 3000 : false });
  const unreadInput = useMemo(() => ({ viewer: identity ?? "Flinter", since: lastReadAt }), [identity, lastReadAt]);
  const unreadQuery = trpc.chat.unread.useQuery(unreadInput, { enabled: Boolean(identity), refetchInterval: 5000 });
  const mediaQuery = trpc.media.list.useQuery({}, { enabled: Boolean(identity), refetchInterval: 8000 });
  const sendMessage = trpc.chat.send.useMutation({ onSuccess: () => { setDraft(""); messagesQuery.refetch(); } });
  const deleteMedia = trpc.media.delete.useMutation({ onSuccess: () => { toast.success("Media dihapus."); mediaQuery.refetch(); } });
  const uploadMedia = trpc.media.upload.useMutation({ onSuccess: () => { toast.success("Media berhasil ditambahkan ke ruang kenangan."); setFile(null); setTitle(""); setCaption(""); setMemoryIndex(0); mediaQuery.refetch(); setShowComposer(false); } });
  const utils = trpc.useUtils();

  const previousIdentity = useRef<Identity | null>(null);
  useEffect(() => { if (identity) { if (previousIdentity.current && previousIdentity.current !== identity) resetChatRead(sessionStorage, identity); previousIdentity.current = identity; sessionStorage.setItem("fj-identity", identity); setLastReadAt(getLastReadAt(sessionStorage, identity)); } }, [identity]);
  useEffect(() => { if (page === "chat") chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messagesQuery.data, page]);
  useEffect(() => { if (identity && page === "chat" && messagesQuery.data) { const now = Date.now(); setLastReadAt(markChatRead(sessionStorage, identity, now)); unreadQuery.refetch(); } }, [identity, page, messagesQuery.data]);

  const currentMedia = useMemo(() => mediaQuery.data ?? [], [mediaQuery.data]);
  const displayMedia = useMemo(() => [...bundledMedia, ...currentMedia], [currentMedia]);
  const go = (next: Page) => { setPage(next); setMobileOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const enter = (selected: Identity) => { setIdentity(selected); setPage("beranda"); };
  const switchIdentity = (next: Identity) => { if (identity) setLastReadAt(switchIdentityReadState(sessionStorage, identity, next)); sessionStorage.setItem("fj-identity", next); setIdentity(next); setPage("beranda"); };
  const logout = () => { if (identity) resetChatRead(sessionStorage, identity); sessionStorage.removeItem("fj-identity"); setIdentity(null); };
  const submitMessage = (e: React.FormEvent) => { e.preventDefault(); if (!identity || !draft.trim()) return; sendMessage.mutate({ sender: identity, body: draft.trim() }); };
  const submitMedia = async (e: React.FormEvent) => {
    e.preventDefault(); if (!identity || !file || !title.trim()) return toast.error("Pilih file dan isi judul terlebih dahulu.");
    const mediaType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : file.type.startsWith("audio/") ? "audio" : null;
    if (!mediaType) return toast.error("Format yang didukung: gambar, video, atau audio.");
    if (file.size > 25 * 1024 * 1024) return toast.error("Ukuran file maksimal 25 MB.");
    const base64 = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); });
    uploadMedia.mutate({ title: title.trim(), caption: caption.trim() || undefined, category, mediaType, mimeType: file.type, fileName: file.name, base64, uploadedBy: identity, memoryIndex: category === "kenangan" ? memoryIndex : undefined });
  };

  if (!identity) return <IdentityGate onEnter={enter} />;

  const nav: { id: Page; label: string; icon: any }[] = [
    { id: "beranda", label: "Beranda", icon: HomeIcon }, { id: "alasan", label: "Alasan", icon: Heart }, { id: "kenangan", label: "Kenangan", icon: BookOpen }, { id: "galeri", label: "Galeri", icon: Images }, { id: "surat", label: "Surat", icon: Mail }, { id: "chat", label: "Chat Kita", icon: MessageCircle }, { id: "kelola", label: "Kelola", icon: Settings2 },
  ];

  return <div className="app-shell">
    <div className="ambient ambient-a" /><div className="ambient ambient-b" />
    <header className="topbar">
      <button className="brand-button" onClick={() => go("beranda")}><Heart size={16} fill="currentColor" /> For You</button>
      <nav className={`desktop-nav ${mobileOpen ? "mobile-open" : ""}`}>{nav.map(({ id, label, icon: Icon }) => <button key={id} className={page === id ? "active" : ""} onClick={() => go(id)}><Icon size={14} />{label}{id === "chat" && Boolean(unreadQuery.data) && page !== "chat" && <span className="notif-badge">{unreadQuery.data! > 99 ? "99+" : unreadQuery.data}</span>}</button>)}</nav>
      <div className="profile-chip"><Avatar identity={identity} small /><span>{identity}</span><button onClick={() => switchIdentity(identity === "Flinter" ? "Josua" : "Flinter")} aria-label="Ganti identitas">↔</button><button onClick={logout} aria-label="Keluar"><LogOut size={14} /></button></div>
      <button className="mobile-menu" onClick={() => setMobileOpen(v => !v)} aria-label="Buka menu"><Menu size={20} /></button>
    </header>
    <main className="page-wrap">
      {page === "beranda" && <section className="hero-page page-enter"><div className="hero-kicker"><span className="live-dot" /> Dibuat khusus untukmu</div><h1>Kamu adalah<br /><strong>duniaku</strong><em>selalu.</em></h1><div className="gold-line" /><p>Di antara jutaan bintang di langit, kamu adalah satu-satunya yang <span>bersinar paling terang</span> di hatiku. Ini bukan sekadar halaman, ini adalah bukti bahwa kamu layak mendapat sesuatu yang istimewa.</p><div className="hero-actions"><Button onClick={() => go("surat")}><Mail size={16} /> Baca suratku</Button><Button variant="outline" onClick={() => go("alasan")}><Heart size={16} /> Alasanku</Button></div><div className="quick-grid">{nav.slice(1, 5).map(({ id, label, icon: Icon }) => <button key={id} onClick={() => go(id)}><Icon size={22} /><span>{label}</span></button>)}</div></section>}
      {page === "alasan" && <section className="content-page narrow page-enter"><span className="eyebrow">Sebuah pengakuan</span><h2>Tidak ada<br /><em>alasan.</em></h2><div className="cross-mark">+</div><p className="lead">Sama seperti <span className="gold-text">Tuhan Yesus mencintaimu</span> — tanpa syarat, tanpa alasan, tanpa batas — akupun demikian. Cinta-Nya kepadamu bukan karena kamu sempurna, bukan karena kamu layak, tapi karena <span>itulah sifat kasih yang sejati.</span></p><blockquote>“Kita mengasihi, karena Allah terlebih dahulu mengasihi kita.”<cite>1 Yohanes 4:19</cite></blockquote><p className="lead">Aku bukan Tuhan Yesus. Aku tidak sempurna, aku adalah pendosa yang ditebus. Tapi ada satu hal yang aku yakini — <span className="gold-text">aku ingin belajar mencintaimu dengan cara yang sama</span>. Tanpa pamrih. Tanpa hitung-hitungan. Tanpa hari ketika aku berhenti.</p><p className="closing">Jika kamu bertanya kenapa aku mencintaimu —<br />jawabannya bukan alasan.<br />Jawabannya adalah keputusan.<br /><strong>Setiap hari, aku memilih kamu.</strong></p></section>}
      {page === "kenangan" && <section className="content-page page-enter"><span className="eyebrow">Perjalanan kita</span><h2>Kenangan yang<br /><em>tak terlupakan.</em></h2><p className="subcopy">Setiap momen bersamamu layak untuk dikenang selamanya.</p><div className="timeline">{staticMemories.map(([date, heading, text], index) => <article className="timeline-item" key={heading}><span className="timeline-dot" /><div><small>{date}</small><h3>{heading}</h3><p>{text}</p>{displayMedia.filter((m: any) => m.category === "kenangan" && (m.memoryIndex ?? 0) === index).map((m: any) => <MediaCard item={m} key={m.id} onOpen={setLightboxUrl} />)}</div></article>)}</div></section>}
      {page === "galeri" && <section className="content-page page-enter"><span className="eyebrow">Potret kita</span><h2>Momen-momen<br /><em>indah.</em></h2><p className="subcopy">Setiap foto menyimpan cerita, setiap senyuman menyimpan rasa.</p><div className="media-grid">{displayMedia.filter((m: any) => m.category === "galeri").map((item: any) => <MediaCard key={item.id} item={item} onOpen={setLightboxUrl} />)}{displayMedia.filter((m: any) => m.category === "galeri").length === 0 && <div className="empty-state"><Images size={30} /><strong>Galeri masih menunggu cerita baru.</strong><span>Tambahkan foto, video, atau lagu melalui ruang kelola.</span><Button variant="outline" onClick={() => go("kelola")}><Upload size={15} /> Tambah media</Button></div>}</div></section>}
      {page === "surat" && <section className="content-page narrow page-enter"><div className="letter-card"><div className="letter-heading"><Heart size={28} fill="currentColor" /><span>Surat untuk Baginda Ratu Flinteria-ku</span></div><p className="letter-salute">Printer,</p><p>Ini adalah web khusus yang kubuat sendiri untukmu.</p><p>Aku tahu aku bukan orang yang sempurna. Aku sering membuatmu kesal dan mungkin belum bisa menjadi seperti yang kamu harapkan. Aku minta maaf untuk semua hal yang pernah membuatmu sakit.</p><p>Tapi <span>aku selalu mencintaimu dengan sepenuh hati</span>. Bukan karena kamu sempurna, tetapi karena <strong>kamu orang yang tepat buatku</strong>. Siapa bilang kamu bersaing dengan orang lain? Kamu selalu menjadi pemenangnya.</p><p>Mungkin menurutmu aku tidak mencintai atau memperlakukanmu dengan baik seperti orang-orang lain, tetapi sebenarnya aku jauh sangat sayang sama kamu. Ini tentang siapa yang tetap bertahan meskipun sedang tidak berjalan bersama.</p><p><em>Aku selalu sayang kamu, lebih dari yang bisa kata-kata ungkapkan.</em></p><div className="letter-sign">Dengan segala cinta,<br /><strong>Peci</strong></div></div></section>}
      {page === "chat" && <section className="content-page chat-page page-enter"><div className="chat-heading"><div><span className="eyebrow">Ruang percakapan</span><h2>Chat <em>kita.</em></h2></div><div className="online-note"><span className="live-dot" /> tersimpan otomatis</div></div><div className="chat-window"><div className="chat-intro"><MessageCircle size={20} /><span>Pesan di sini hanya untuk Flinter dan Josua.</span></div><div className="messages">{messagesQuery.data?.map((message: any) => <div className={`message-row ${message.sender === identity ? "mine" : "theirs"}`} key={message.id}><Avatar identity={message.sender} small /><div className="message-bubble"><small>{message.sender} · {new Date(message.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</small><p>{message.body}</p></div></div>)}{!messagesQuery.data?.length && <div className="empty-chat">Belum ada pesan. Mulailah dengan satu kalimat kecil.</div>}<div ref={chatEndRef} /></div><form className="chat-form" onSubmit={submitMessage}><Input value={draft} onChange={e => setDraft(e.target.value)} placeholder={`Tulis pesan sebagai ${identity}...`} maxLength={4000} /><Button type="submit" disabled={sendMessage.isPending || !draft.trim()}><Send size={16} /></Button></form></div></section>}
      {page === "kelola" && <section className="content-page page-enter"><div className="manage-heading"><div><span className="eyebrow">Studio pribadi</span><h2>Kelola <em>cerita.</em></h2><p className="subcopy">Tambahkan gambar, video, dan audio agar ruang ini terus tumbuh bersama kalian.</p></div><Button onClick={() => setShowComposer(true)}><ImagePlus size={16} /> Tambah media</Button></div><Tabs defaultValue="galeri" className="manage-tabs"><TabsList><TabsTrigger value="galeri">Galeri</TabsTrigger><TabsTrigger value="kenangan">Kenangan</TabsTrigger></TabsList><TabsContent value="galeri"><div className="manage-list">{currentMedia.filter((m: any) => m.category === "galeri").map((item: any) => <MediaCard item={item} key={item.id} onOpen={setLightboxUrl} onDelete={() => deleteMedia.mutate({ id: item.id })} />)}</div></TabsContent><TabsContent value="kenangan"><div className="manage-list">{currentMedia.filter((m: any) => m.category === "kenangan").map((item: any) => <MediaCard item={item} key={item.id} onOpen={setLightboxUrl} onDelete={() => deleteMedia.mutate({ id: item.id })} />)}</div></TabsContent></Tabs></section>}
    </main>
    <footer><Heart size={13} fill="currentColor" /> Dibuat dengan cinta, hanya untuk kamu</footer>
    {showComposer && <div className="modal-backdrop" onClick={() => setShowComposer(false)}><form className="composer" onSubmit={submitMedia} onClick={e => e.stopPropagation()}><button type="button" className="modal-close" onClick={() => setShowComposer(false)}><X size={18} /></button><span className="eyebrow">Tambah ke cerita</span><h3>Media baru</h3><label>Judul<Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Hari yang sempurna" /></label><label>Keterangan<Textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Ceritakan sedikit tentang momen ini..." /></label><label>Masukkan ke<select value={category} onChange={e => setCategory(e.target.value as "galeri" | "kenangan")}><option value="galeri">Galeri</option><option value="kenangan">Kenangan</option></select></label>{category === "kenangan" && <label>Bagian kenangan<select value={memoryIndex} onChange={e => setMemoryIndex(Number(e.target.value))}>{staticMemories.map(([date, heading], index) => <option value={index} key={heading}>{index + 1}. {date}</option>)}</select></label>}<label className="file-drop"><Upload size={22} /><span>{file ? file.name : "Pilih gambar, video, atau lagu"}</span><small>Maksimal 25 MB</small><input type="file" accept="image/*,video/*,audio/*" onChange={e => setFile(e.target.files?.[0] ?? null)} /></label><Button type="submit" disabled={uploadMedia.isPending || !file || !title.trim()}>{uploadMedia.isPending ? "Mengunggah..." : "Simpan media"}</Button></form></div>}
    {lightboxUrl && <div className="lightbox" onClick={() => setLightboxUrl(null)}><button onClick={() => setLightboxUrl(null)} aria-label="Tutup"><X size={22} /></button><img src={lightboxUrl} alt="Pratinjau media" /></div>}
  </div>;
}
