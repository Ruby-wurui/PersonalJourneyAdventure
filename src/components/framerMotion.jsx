import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue } from 'framer-motion';
import { ArrowDown, Camera, Layers, Zap, Star, Home, Image, FileText, ArrowRight, ChevronLeft, ChevronRight, GalleryHorizontal } from 'lucide-react';

// ==========================================
// 0. 侧边栏导航组件 (Sidebar Navigation)
// ==========================================

// 自定义 Hook: 获取尺寸
const useDimensions = (ref) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);

  return dimensions.current;
};

// 路径组件
const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 100%)" 
    strokeLinecap="round"
    {...props}
  />
);

// 菜单开关按钮
const MenuToggle = ({ toggle }) => (
  <button style={toggleStyle} onClick={toggle}>
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);

// 菜单配置数据
const navConfig = [
  { label: "Intro", icon: Home, color: "#a855f7", targetId: "hero-section" },
  { label: "Parallax", icon: Image, color: "#3b82f6", targetId: "parallax-section" },
  { label: "Pop-ups", icon: Star, color: "#eab308", targetId: "popup-section" },
  { label: "Cards", icon: Layers, color: "#d4d4d8", targetId: "cards-section" },
  { label: "Reveal", icon: Zap, color: "#f97316", targetId: "reveal-section" },
  { label: "Gallery", icon: GalleryHorizontal, color: "#06b6d4", targetId: "coverflow-section" }, // 新增 Gallery
  { label: "Article", icon: FileText, color: "#ff0088", targetId: "article-section" },
];

const MenuItem = ({ item, i, toggle }) => {
  const style = { border: `2px solid ${item.color}` };
  const Icon = item.icon;

  const handleClick = () => {
    const element = document.getElementById(item.targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      toggle();
    }
  };

  return (
    <motion.li
      style={listItemStyle}
      variants={menuItemVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <div 
        style={{ ...iconPlaceholderStyle, borderColor: item.color, color: item.color }} 
        className="flex items-center justify-center border-2 rounded-full"
      >
        <Icon size={20} />
      </div>
      <div style={{ ...textPlaceholderStyle, ...style }} className="flex items-center px-4 bg-white/5 backdrop-blur-sm">
         <span className="text-white font-medium tracking-wide text-lg">{item.label}</span> 
      </div>
    </motion.li>
  );
};

// 导航列表
const Navigation = ({ toggle }) => (
  <motion.ul style={listStyle} variants={navVariants}>
    {navConfig.map((item, i) => (
      <MenuItem item={item} i={i} key={i} toggle={toggle} />
    ))}
  </motion.ul>
);

// 主侧边栏组件
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
      style={navStyle}
    >
      <motion.div style={sidebarBackgroundStyle} variants={sidebarVariants} />
      <Navigation toggle={() => setIsOpen(false)} />
      <MenuToggle toggle={() => setIsOpen(!isOpen)} />
    </motion.nav>
  );
};

// --- 动画变体 (Variants) ---

const sidebarVariants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const navVariants = {
  open: {
    transition: { delayChildren: 0.2, staggerChildren: 0.07, staggerDirection: 1 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const menuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

// --- 样式 (Styles) ---

const navStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  bottom: 0,
  width: "300px",
  zIndex: 1001, 
  pointerEvents: "none", 
};

const sidebarBackgroundStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  width: "300px",
  backgroundColor: "#171717", 
  boxShadow: "4px 0 24px rgba(0,0,0,0.5)", 
  pointerEvents: "auto",
};

const toggleStyle = {
  outline: "none",
  border: "none",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  cursor: "pointer",
  position: "absolute",
  top: "18px",
  left: "15px",
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "transparent", 
  zIndex: 101,
  pointerEvents: "auto",
};

const listStyle = {
  listStyle: "none",
  padding: "25px",
  margin: 0,
  position: "absolute",
  top: "80px",
  width: "230px",
  pointerEvents: "auto",
};

const listItemStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: 0,
  margin: 0,
  listStyle: "none",
  marginBottom: "20px",
  cursor: "pointer",
};

const iconPlaceholderStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  flex: "40px 0",
  marginRight: "20px",
};

const textPlaceholderStyle = {
  borderRadius: "5px",
  width: "200px",
  height: "40px",
  flex: 1,
};

// ==========================================
// 0.5. Header 组件
// ==========================================
const Header = () => {
  return (
    <header
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'transparent',
        backgroundImage: 'radial-gradient(transparent 1px, var(--background) 1px)',
        backgroundSize: '4px 4px',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        mask: 'linear-gradient(#000 calc(100% - 20px), #0000)',
        WebkitMask: 'linear-gradient(#000 calc(100% - 20px), #0000)',
        '--background': '#0a0a0a'
      }}
    >
      <div className="flex items-center gap-2 ml-14 md:ml-4">
        <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-xs font-mono">M</span>
        </div>
        <span className="text-white font-bold text-lg tracking-tight font-sans">Motion</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden md:block px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors font-medium">Log In</button>
        <button className="px-5 py-2 text-sm bg-white text-black rounded-full hover:bg-neutral-200 transition-colors font-bold tracking-tight">
          Get Started
        </button>
      </div>
    </header>
  );
};


// ==========================================
// 1. 视差画廊组件 (Parallax Gallery)
// ==========================================
const ParallaxGallery = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  const images = [
    "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop"
  ];

  return (
    <div id="parallax-section" ref={containerRef} className="min-h-screen bg-neutral-950 overflow-hidden relative flex flex-col items-center justify-center py-20">
      <div className="text-center z-10 px-4 mb-20">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Camera className="text-purple-500 w-6 h-6" />
          <span className="text-purple-400 font-mono text-sm tracking-widest">PARALLAX EFFECT</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">沉浸式视差</h2>
      </div>
      
      <div className="flex gap-4 md:gap-8 h-[120%] -mt-20 px-4">
        <Column images={[images[0], images[1], images[0]]} y={y1} />
        <Column images={[images[1], images[2], images[3]]} y={y2} className="mt-[10vh]" />
        <Column images={[images[2], images[3], images[1]]} y={y3} />
        <Column images={[images[3], images[0], images[2]]} y={y4} className="mt-[25vh] hidden md:flex" />
      </div>
    </div>
  );
};

const Column = ({ images, y, className = "" }) => {
  return (
    <motion.div 
      style={{ y }} 
      className={`flex flex-col gap-4 md:gap-8 min-w-[150px] md:min-w-[250px] relative h-full ${className}`}
    >
      {images.map((src, i) => (
        <motion.div 
          key={i} 
          className="relative rounded-xl overflow-hidden aspect-[2/3] w-full shadow-2xl border border-white/10"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <img src={src} alt="Parallax" className="w-full h-full object-cover" />
        </motion.div>
      ))}
    </motion.div>
  );
};

// ==========================================
// 2. 滚动触发弹出卡片 (Pop-up Cards)
// ==========================================

const popupData = [
  { 
    title: "霓虹夜景", 
    description: "光影交错的赛博城市，迷失在色彩斑斓的梦境中，感受夜晚的脉搏。",
    src: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=600", 
    color: "#a855f7" 
  }, // Purple
  { 
    title: "赛博未来", 
    description: "探索科技与人性的边界，构建数字化的新世界，突破想象的极限。",
    src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600", 
    color: "#3b82f6" 
  }, // Blue
  { 
    title: "城市微光", 
    description: "在钢筋水泥的森林里，寻找温暖人心的那一束光，照亮前行的路。",
    src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=600", 
    color: "#eab308" 
  }, // Yellow
  { 
    title: "数字艺术", 
    description: "打破现实的桎梏，用代码绘制无限可能的想象，重塑视觉体验。",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600", 
    color: "#f97316" 
  }, // Orange
];

const cardVariants = {
  offscreen: { 
    y: 400, // 增加初始位移
    rotate: 15, // 初始旋转
    scale: 0.8
  },
  onscreen: {
    y: 50, 
    rotate: -2, 
    scale: 1,
    transition: { 
      type: "spring", 
      bounce: 0.5, 
      duration: 1 
    },
  },
};

const PopUpCard = ({ item, i }) => {
  const background = `linear-gradient(135deg, ${item.color}88, ${item.color}22)`; 
  const splashClipPath = `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`;
  
  const cardBackground = `linear-gradient(160deg, #2a2a2a 0%, ${item.color}15 100%)`;

  return (
    <motion.div
      className="flex justify-center items-center relative pt-5 -mb-[160px] overflow-visible"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.6, margin: "0px 0px -100px 0px" }}
    >
      <div 
        className="absolute inset-0 w-full h-full blur-3xl opacity-70 pointer-events-none"
        style={{ background, clipPath: splashClipPath }} 
      />
      
      <motion.div 
        variants={cardVariants} 
        className="relative w-[380px] h-[520px] flex flex-col rounded-3xl border border-white/20 shadow-2xl overflow-hidden origin-[50%_100%]"
        style={{ background: cardBackground }}
      >
        <div className="h-[50%] w-full overflow-hidden relative group">
           <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a] via-transparent to-transparent opacity-80 z-10" />
           <img 
            src={item.src} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
           />
           <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs text-white font-mono">
              0{i+1}
           </div>
        </div>
        
        <div className="h-[50%] w-full flex flex-col p-6 relative z-20">
           <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">{item.title}</h3>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/5">
                 <Zap size={16} style={{ color: item.color }} />
              </div>
           </div>
           
           <div className="w-10 h-1 rounded-full mb-4" style={{ backgroundColor: item.color }} />
           
           <p className="text-neutral-300 text-sm leading-relaxed font-light mb-6 opacity-90">
             {item.description}
           </p>

           <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between group cursor-pointer">
              <span className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase group-hover:text-white transition-colors">Read More</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
                  <ArrowRight size={14} className="text-white transform group-hover:translate-x-1 transition-transform" />
              </div>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PopUpGallery = () => {
  return (
    <section id="popup-section" className="py-40 bg-neutral-900 overflow-hidden">
       <div className="text-center mb-24 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="text-yellow-500 w-6 h-6" />
            <span className="text-yellow-400 font-mono text-sm tracking-widest">WHILE IN VIEW</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">滚动弹出效果</h2>
          <p className="text-neutral-400 mt-4 max-w-md mx-auto">向下滚动，体验卡片富有弹性的动态入场。</p>
       </div>
       
       <div className="max-w-[600px] mx-auto w-full pb-[150px] relative z-0">
          {popupData.map((item, i) => (
             <PopUpCard i={i} item={item} key={item.title} />
          ))}
       </div>
    </section>
  );
};


// ==========================================
// 3. 堆叠卡片组件 (Stacking Cards)
// ==========================================

const cardData = [
  { title: "探索", description: "发现前所未见的自然奇观，感受大自然的鬼斧神工。", src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop", color: "#27272a" },
  { title: "设计", description: "极简主义与现代美学的完美融合，打造极致用户体验。", src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop", color: "#202022" },
  { title: "创新", description: "突破技术的边界，用代码构建未来的数字世界。", src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop", color: "#18181b" }
];

const StackCard = ({ i, title, description, src, color, progress, range, targetScale }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
      <motion.div 
        style={{ scale, backgroundColor: color, top: `calc(-5vh + ${i * 25}px)` }} 
        className="flex flex-col relative w-[90vw] md:w-[1000px] h-[60vh] md:h-[500px] rounded-3xl p-8 md:p-12 origin-top border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row h-full gap-8">
          <div className="w-full md:w-2/5 flex flex-col justify-center z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{title}</h2>
            <p className="text-base md:text-lg text-neutral-300">{description}</p>
          </div>
          <div className="w-full md:w-3/5 h-full relative rounded-2xl overflow-hidden">
             <motion.div className="w-full h-full" style={{ scale: imageScale }}>
                <img src={src} alt="card" className="w-full h-full object-cover" />
             </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StackingCards = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <div id="cards-section" ref={containerRef} className="bg-black relative pt-20 pb-[20vh]">
       <div className="sticky top-10 text-center mb-10 pt-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Layers className="text-blue-500 w-6 h-6" />
            <span className="text-blue-400 font-mono text-sm tracking-widest">STACKING CARDS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">堆叠卡片效果</h2>
       </div>
      {cardData.map((card, i) => {
        const targetScale = 1 - ( (cardData.length - i) * 0.05); 
        return (
          <StackCard key={i} i={i} {...card} progress={scrollYProgress} range={[i * 0.25, 1]} targetScale={targetScale} />
        );
      })}
    </div>
  );
};


// ==========================================
// 4. 文字揭示与水平滚动 (Text Reveal)
// ==========================================
const TextReveal = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const x2 = useTransform(scrollYProgress, [0, 1], [-200, 200]);
  const maskSize = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);

  return (
    <div id="reveal-section" ref={containerRef} className="h-[100vh] bg-white flex flex-col items-center justify-center overflow-hidden relative">
      <div className="absolute top-20 flex items-center gap-2">
         <Zap className="text-orange-500 w-6 h-6" />
         <span className="text-orange-600 font-mono text-sm tracking-widest">SCROLL TYPOGRAPHY</span>
      </div>

      <motion.div style={{ x: x1 }} className="whitespace-nowrap mb-4">
        <h1 className="text-[10vw] md:text-[8vw] font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-400 leading-none uppercase">
          Motion Design
        </h1>
      </motion.div>
      
      <div className="relative">
         <h1 className="text-[12vw] md:text-[10vw] font-black text-neutral-200 leading-none text-center">CREATIVITY</h1>
         <motion.div style={{ height: maskSize }} className="absolute bottom-0 left-0 w-full overflow-hidden flex items-end justify-center">
            <h1 className="text-[12vw] md:text-[10vw] font-black text-black leading-none text-center">CREATIVITY</h1>
         </motion.div>
      </div>

      <motion.div style={{ x: x2 }} className="whitespace-nowrap mt-4">
        <h1 className="text-[10vw] md:text-[8vw] font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-200 leading-none uppercase">Interactive Web</h1>
      </motion.div>
    </div>
  );
};


// ==========================================
// 5. [NEW] Coverflow Gallery (3D 图片轮播)
// ==========================================

const COVERFLOW_IMAGES = [
  { id: 1, url: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", title: "Mountain Escape", desc: "攀登高峰" },
  { id: 2, url: "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", title: "Forest Mystery", desc: "迷雾森林" },
  { id: 3, url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", title: "Starry Night", desc: "璀璨星空" },
  { id: 4, url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", title: "Ocean Breeze", desc: "海风拂面" },
  { id: 5, url: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", title: "Urban Dreams", desc: "城市梦想" },
  { id: 6, url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", title: "Golden Hour", desc: "日落时分" },
];

const CARD_WIDTH = 280;
const CARD_HEIGHT = 420;
const DRAG_BUFFER = 50;
const SPRING_OPTIONS = { type: "spring", stiffness: 200, damping: 25, mass: 1 };

const CoverflowGallery = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const containerRef = useRef(null);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => Math.min(prev + 1, COVERFLOW_IMAGES.length - 1));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  const onDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset > DRAG_BUFFER || velocity > 500) {
      handlePrev();
    } else if (offset < -DRAG_BUFFER || velocity < -500) {
      handleNext();
    }
  };

  return (
    <section id="coverflow-section" className="h-screen bg-[#0f1014] text-white flex flex-col items-center justify-center overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* 标题 */}
      <div className="absolute top-12 z-20 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
            <GalleryHorizontal className="text-cyan-400 w-6 h-6" />
            <span className="text-cyan-400 font-mono text-sm tracking-widest">3D CAROUSEL</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-cyan-300 to-blue-500 tracking-tight">
          Coverflow
        </h2>
        <p className="text-slate-500 text-sm">拖拽滑动 · 丝滑过渡</p>
      </div>

      {/* 3D 视窗容器 */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-[1000px] h-[500px] flex items-center justify-center"
        style={{ perspective: 1000 }}
      >
        {/* 透明的拖拽触发层 */}
        <motion.div
          className="absolute inset-0 z-50 touch-pan-y" 
          drag="x"
          dragConstraints={{ left: 0, right: 0 }} 
          dragElastic={0.1} 
          onDragEnd={onDragEnd}
          style={{ cursor: 'grab' }}
          whileTap={{ cursor: 'grabbing' }}
        />

        <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
          <AnimatePresence initial={false} mode='popLayout'>
            {COVERFLOW_IMAGES.map((item, index) => {
              const isActive = index === activeIndex;
              const offset = index - activeIndex; 
              
              const xOffset = offset * 220; 
              const scale = isActive ? 1 : 0.85; 
              const rotateY = isActive ? 0 : offset > 0 ? -45 : 45; 
              const zIndex = 100 - Math.abs(offset);
              const opacity = Math.abs(offset) > 3 ? 0 : 1; 

              return (
                <motion.div
                  key={item.id}
                  layout 
                  initial={false}
                  animate={{
                    x: xOffset,
                    scale: scale,
                    rotateY: rotateY,
                    zIndex: zIndex,
                    opacity: opacity,
                    z: isActive ? 0 : -100,
                  }}
                  transition={SPRING_OPTIONS}
                  className="absolute top-1/2 left-1/2 -ml-[140px] -mt-[210px] transform-style-3d pointer-events-none" 
                  style={{
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                  }}
                >
                  {/* 实际的卡片内容 */}
                  <div className={`
                    w-full h-full rounded-2xl overflow-hidden relative shadow-2xl
                    transition-all duration-500
                    ${isActive ? 'shadow-cyan-500/20' : 'brightness-[0.4]'}
                  `}>
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* 玻璃拟态光泽层 */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* 文字内容 */}
                    <motion.div 
                      className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      <p className="text-cyan-200 text-sm mt-1">{item.desc}</p>
                    </motion.div>
                  </div>

                  {/* 倒影效果 (Reflection) */}
                  <div className="absolute top-full left-0 w-full h-full mt-2 rounded-2xl overflow-hidden opacity-30 transform-style-3d origin-top -scale-y-100 mask-image-linear">
                     <img src={item.url} className="w-full h-full object-cover blur-sm" alt="" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014] to-transparent" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* 底部控制器 */}
      <div className="absolute bottom-12 flex items-center gap-6 z-50">
        <button 
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/5 backdrop-blur-sm"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-2">
          {COVERFLOW_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex 
                ? 'w-8 bg-cyan-400' 
                : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          disabled={activeIndex === COVERFLOW_IMAGES.length - 1}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/5 backdrop-blur-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* CSS 用于遮罩倒影 */}
      <style>{`
        .mask-image-linear {
          -webkit-mask-image: linear-gradient(to top, transparent 40%, black 100%);
          mask-image: linear-gradient(to top, transparent 40%, black 100%);
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  );
};


// ==========================================
// 6. Article 深度阅读区域
// ==========================================
const ArticleSection = () => {
  return (
    <div id="article-section" className="bg-neutral-950 py-40 px-6">
      <div className="max-w-[500px] mx-auto">
        <div className="flex items-center gap-2 mb-8">
           <FileText className="text-[#ff0088] w-6 h-6" />
           <span className="text-[#ff0088] font-mono text-sm tracking-widest">DEEP READ</span>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <p className="mb-6 text-neutral-400 leading-relaxed text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ac rhoncus quam.
          </p>
          <p className="mb-6 text-neutral-400 leading-relaxed text-lg">
            Fringilla quam urna. Cras turpis elit, euismod eget ligula quis, imperdiet sagittis justo. In viverra fermentum ex ac vestibulum. Aliquam eleifend nunc a luctus porta. Mauris laoreet augue ut felis blandit, at iaculis odio ultrices. Nulla facilisi. Vestibulum cursus ipsum tellus, eu tincidunt neque tincidunt a.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-12 mb-4">Sub-header</h2>
          
          <p className="mb-6 text-neutral-400 leading-relaxed text-lg">
            In eget sodales arcu, consectetur efficitur metus. Duis efficitur tincidunt odio, sit amet laoreet massa fringilla eu.
          </p>
          <p className="mb-6 text-neutral-400 leading-relaxed text-lg">
            Pellentesque id lacus pulvinar elit pulvinar pretium ac non urna. Mauris id mauris vel arcu commodo venenatis. Aliquam eu risus arcu. Proin sit amet lacus mollis, semper massa ut, rutrum mi.
          </p>
          <p className="mb-6 text-neutral-400 leading-relaxed text-lg">
            Sed sem nisi, luctus consequat ligula in, congue sodales nisl.
          </p>
          <p className="mb-6 text-neutral-400 leading-relaxed text-lg">
            Vestibulum bibendum at erat sit amet pulvinar. Pellentesque pharetra leo vitae tristique rutrum. Donec ut volutpat ante, ut suscipit leo.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">Sub-header</h2>
          
          <p className="mb-6 text-neutral-400 leading-relaxed text-lg">
            Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum fringilla aliquet. Pellentesque auctor vehicula malesuada. Aliquam id feugiat sem, sit amet tempor nulla. Quisque fermentum felis faucibus, vehicula metus ac, interdum nibh. Curabitur vitae convallis ligula. Integer ac enim vel felis pharetra laoreet. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque hendrerit ac augue quis pretium.
          </p>
          <p className="mb-6 text-neutral-400 leading-relaxed text-lg">
            Morbi ut scelerisque nibh. Integer auctor, massa non dictum tristique, elit metus efficitur elit, ac pretium sapien nisl nec ante. In et ex ultricies, mollis mi in, euismod dolor.
          </p>
          <p className="mb-6 text-neutral-400 leading-relaxed text-lg">
            Quisque convallis ligula non magna efficitur tincidunt.
          </p>

          <p className="mb-6 text-neutral-400 leading-relaxed text-lg">
            Pellentesque id lacus pulvinar elit pulvinar pretium ac non urna. Mauris id mauris vel arcu commodo venenatis. Aliquam eu risus arcu. Proin sit amet lacus mollis, semper massa ut, rutrum mi.
          </p>
        </motion.div>
      </div>
    </div>
  );
};


// ==========================================
// 主应用组件 (App)
// ==========================================
const App = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="bg-neutral-950 min-h-screen font-sans selection:bg-purple-500 selection:text-white">
      {/* 0. 侧边栏导航 */}
      <Sidebar />

      {/* 0.5. Header (Appears below Sidebar z-index) */}
      <Header />

      {/* 顶部进度条 */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-blue-500 to-orange-500 origin-left z-[1002]" // Higher than sidebar
        style={{ scaleX }}
      />

      {/* Hero (Reverted to original) */}
      <section id="hero-section" className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="z-10 text-center px-4">
          <div className="inline-block px-3 py-1 mb-4 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm text-sm text-neutral-300">
            Framer Motion Demo
          </div>
          <h1 className="text-5xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 mb-6">
            Scroll Triggered
          </h1>
          <motion.div 
             animate={{ y: [0, 10, 0] }}
             transition={{ repeat: Infinity, duration: 2 }}
             className="opacity-50"
          >
             <ArrowDown className="text-white w-8 h-8 mx-auto mt-8" />
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      </section>

      {/* 1. 视差画廊 */}
      <ParallaxGallery />

      {/* 2. 弹出卡片效果 (Optimized version retained) */}
      <PopUpGallery />

      {/* 3. 堆叠卡片 */}
      <StackingCards />

      {/* 4. 文字揭示 */}
      <TextReveal />

      {/* 5. [NEW] Coverflow Gallery */}
      <CoverflowGallery />

      {/* 6. Article 长文阅读区域 */}
      <ArticleSection />

      <footer className="h-[50vh] flex items-center justify-center bg-black text-white border-t border-white/10">
         <p className="text-neutral-500">Built with React & Framer Motion</p>
      </footer>
    </div>
  );
};

export default App;