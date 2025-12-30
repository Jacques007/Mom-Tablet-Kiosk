
(async function(){
  // ------- JSON path -------
  const JSON_URL = "jigsaw.json";  // images & daily schedule

  // ------- DOM -------
  const boardEl = document.getElementById("board");
  const trayEl = document.getElementById("tray");
  const statusEl = document.getElementById("status");
  const guideEl = document.getElementById("guide");
  const titleEl = document.getElementById("title");
  const showGuideChk = document.getElementById("showGuide");

  // ------- State -------
  let rows = 3, cols = 4;
  let IMAGE_URL = "";
  let puzzleTitle = "";
  let trayPieces = [];         // [{idx, el}]
  let boardMap = [];           // length rows*cols; value = pieceIdx or null
  let selectedPieceIdx = null; // currently selected tray piece index

  // ------- Date helpers -------
  function todayISO(tz){
    const d = new Date();
    const y = new Intl.DateTimeFormat("en-CA",{timeZone:tz,year:"numeric"}).format(d);
    const m = new Intl.DateTimeFormat("en-CA",{timeZone:tz,month:"2-digit"}).format(d);
    const day = new Intl.DateTimeFormat("en-CA",{timeZone:tz,day:"2-digit"}).format(d);
    return `${y}-${m}-${day}`;
  }
  function dayOfYear(tz){
    const nowStr = new Intl.DateTimeFormat("en-US",{ timeZone: tz }).format(new Date());
    const now = new Date(nowStr);
    const start = new Date(now.getFullYear(),0,0);
    const diff = now - start;
    const oneDay = 1000*60*60*24;
    return Math.floor(diff/oneDay);
  }

  // ------- Load config -------
  async function loadConfig(){
    const res = await fetch(JSON_URL + "?cb=" + Date.now()); // avoid caching while testing
    if(!res.ok) throw new Error("Failed to load jigsaw.json");
    const cfg = await res.json();

    const tz = cfg.timeZone || "Africa/Johannesburg";
    rows = Number(cfg.defaultRows || rows);
    cols = Number(cfg.defaultCols || cols);

    const today = todayISO(tz);
    const list = Array.isArray(cfg.puzzles) ? cfg.puzzles : [];
    let chosen = list.find(p => p.date === today);

    if(!chosen){
      const strat = cfg.strategy || "explicit-or-rotate";
      if(list.length){
        const index = dayOfYear(tz) % list.length;
        chosen = list[index];
      }
    }
    if(!chosen) throw new Error("No puzzles defined in jigsaw.json");

    IMAGE_URL = chosen.image;
    rows = Number(chosen.rows || rows);
    cols = Number(chosen.cols || cols);
    puzzleTitle = chosen.title || `${chosen.date}`;

    titleEl.textContent = `Today’s puzzle: ${puzzleTitle}`;
  }

  // ------- Grid & pieces -------
  function setGridVars(){
    boardEl.style.setProperty("--cols", cols);
    boardEl.style.setProperty("--rows", rows);
  }
  function percentagePos(r, c){
    const x = (cols === 1) ? 0 : (c * 100 / (cols - 1));
    const y = (rows === 1) ? 0 : (r * 100 / (rows - 1));
    return `${x}% ${y}%`;
  }
  function createPieces(imgUrl){
    trayEl.innerHTML = "";
    trayPieces = [];
    const total = rows * cols;

    for(let r=0; r<rows; r++){
      for(let c=0; c<cols; c++){
        const idx = r*cols + c; // target cell index
        const btn = document.createElement("button");
        btn.className = "piece";
        btn.style.backgroundImage = `url("${imgUrl}")`;
        btn.style.backgroundPosition = percentagePos(r, c);
        btn.setAttribute("aria-label", `Piece ${idx+1}`);
        btn.addEventListener("click", ()=> selectPiece(idx));
        trayEl.appendChild(btn);
        trayPieces.push({ idx, el: btn });
      }
    }
    shuffleTray();
  }
  function buildBoard(){
    boardEl.innerHTML = "";
    boardMap = new Array(rows*cols).fill(null);

    for(let r=0; r<rows; r++){
      for(let c=0; c<cols; c++){
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.tabIndex = 0;
        cell.setAttribute("aria-label", `Cell ${r+1},${c+1}`);
        const index = r*cols + c;

        cell.addEventListener("click", ()=> placeSelectedInto(index, cell));
        boardEl.appendChild(cell);
      }
    }
  }

  // ------- Interactions -------
  function selectPiece(idx){
    trayPieces.forEach(p => p.el.classList.remove("selected"));
    const found = trayPieces.find(p => p.idx === idx);
    if(found){
      found.el.classList.add("selected");
      selectedPieceIdx = idx;
      statusNeutral("Now tap a board cell to place the piece.");
    }
  }
  function placeSelectedInto(cellIndex, cellEl){
    if(selectedPieceIdx === null){
      statusNeutral("Tip: tap a piece first, then tap a board cell.");
      return;
    }
    const currentIdx = boardMap[cellIndex];
    if(currentIdx !== null){
      const prev = trayPieces.find(p => p.idx === currentIdx);
      if(prev) prev.el.style.display = ""; // return previous piece to tray
    }

    boardMap[cellIndex] = selectedPieceIdx;

    const pieceDiv = document.createElement("div");
    pieceDiv.className = "piece";
    pieceDiv.style.backgroundImage = `url("${IMAGE_URL}")`;
    const r = Math.floor(selectedPieceIdx / cols);
    const c = selectedPieceIdx % cols;
    pieceDiv.style.backgroundPosition = percentagePos(r, c);
    pieceDiv.style.backgroundSize = `calc(${cols}*100%) calc(${rows}*100%)`;

    cellEl.innerHTML = "";
    cellEl.appendChild(pieceDiv);

    const trayItem = trayPieces.find(p => p.idx === selectedPieceIdx);
    if(trayItem) trayItem.el.style.display = "none";

    trayPieces.forEach(p => p.el.classList.remove("selected"));
    selectedPieceIdx = null;

    checkVictory();
  }
  function shuffleTray(){
    const items = Array.from(trayEl.children);
    for(let i=items.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      trayEl.insertBefore(items[j], items[i]);
    }
  }
  function resetBoard(){
    trayPieces.forEach(p => { p.el.style.display = ""; p.el.classList.remove("selected"); });
    selectedPieceIdx = null;
    buildBoard();
    statusNeutral("Board reset. Tap a piece, then a cell to place.");
  }
  function statusNeutral(msg){ statusEl.className="status neutral"; statusEl.textContent=msg; }
  function statusGood(msg){ statusEl.className="status good"; statusEl.textContent=msg; }

  // ------- Victory & chime -------
  function checkVictory(){
    const total = rows*cols;
    for(let i=0;i<total;i++){
      if(boardMap[i] !== i){ return; }
    }
    statusGood("Lovely! Puzzle complete. 🎉");
    playChime();
  }
  function playChime(){
    try{
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = 880;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      o.start(); o.stop(ctx.currentTime + 0.85);
    }catch(e){}
  }

  // ------- Guide overlay & aspect ratio -------
  function setGuide(imgUrl){
    guideEl.style.backgroundImage = `url("${imgUrl}")`;
    guideEl.style.display = showGuideChk.checked ? "block" : "none";
  }
  showGuideChk.addEventListener("change", ()=>{
    guideEl.style.display = showGuideChk.checked ? "block" : "none";
  });
  function setAspectToImage(imgUrl){
    const img = new Image();
    img.onload = function(){
      const w = img.naturalWidth || 4, h = img.naturalHeight || 3;
      boardEl.style.aspectRatio = `${w} / ${h}`;
    };
    img.src = imgUrl;
  }

  // ------- Controls -------
  document.getElementById("shuffle").addEventListener("click", ()=>{
    shuffleTray();
    statusNeutral("Pieces shuffled.");
  });
  document.getElementById("reset").addEventListener("click", resetBoard);
  document.getElementById("check").addEventListener("click", ()=>{
    const total = rows*cols;
    let ok = true;
    for(let i=0;i<total;i++){ if(boardMap[i] !== i){ ok = false; break; } }
    if(ok) statusGood("Lovely! Puzzle complete. 🎉");
    else statusNeutral("Keep going—you’re close!");
  });

  // ------- Init -------
  try{
    await loadConfig();
    setGridVars();
    createPieces(IMAGE_URL);
    buildBoard();
    setGuide(IMAGE_URL);
    setAspectToImage(IMAGE_URL);
  }catch(err){
    console.error(err);
    titleEl.textContent = "Couldn’t load jigsaw.json";
    statusNeutral("Error loading the daily puzzle. Please check jigsaw.json and image paths.");
  }
})();
