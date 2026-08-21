import{Nr as e,Pr as t,Vr as n,cr as r,jr as i,mn as a}from"./worldGen-DwdQgwv4.js";var o=`#e8d8a8`,s=`#f5ecd0`,c=`#15151a`;function l(e){let t=parseInt(e.slice(1,3),16)/255,n=parseInt(e.slice(3,5),16)/255,r=parseInt(e.slice(5,7),16)/255,i=e=>e<=.03928?e/12.92:((e+.055)/1.055)**2.4;return .2126*i(t)+.7152*i(n)+.0722*i(r)}function u(e,t){let[n,r]=e>t?[e,t]:[t,e];return(n+.05)/(r+.05)}var d=`#100e0b`,f=`#f6f3ec`,p=l(d),m=l(f);function h(e){let t=l(e),n=u(t,p);return u(t,m)>n?f:d}function g(e){return e===d?`rgba(246, 243, 236, 0.6)`:`rgba(16, 14, 11, 0.65)`}var _=Math.atan2(-23,46)*180/Math.PI,v=Math.round(Math.sqrt(2645)),y=1237;function b(){return`polygon(0px 23px, 46px 0px, 290px 0px, 244px 23px)`}function x(){return`polygon(244px 23px, 290px 0px, 290px 814px, 244px 837px)`}function S(e){return 23+e*31}function C(e){return S(e)+8}var w=`#7a7263`;function T(e=0){return`repeating-linear-gradient(${e}deg, rgba(0, 0, 0, 0.32) 0px 2px, transparent 2px 13px),
        repeating-linear-gradient(${90+e}deg, rgba(255, 255, 255, 0.07) 0px 1px, transparent 1px 11px),
        radial-gradient(circle at 22% 25%, rgba(255, 255, 255, 0.1), transparent 42%),
        radial-gradient(circle at 68% 70%, rgba(0, 0, 0, 0.22), transparent 48%)`}function E(){return`background-color: ${w};
      background-image:
        ${T()};`}function D(e,t,n=t){return e===0||e<=Math.max(t,n)}function O(e,t,n,r,i){return`<div class="twr-row-ceiling twr-row-stone"></div>
    <div class="twr-row-wall-l twr-row-stone"></div>
    <div class="twr-row-wall-r twr-row-stone"></div>
    <div class="${e}" style="background:${t}; color:${n}; ${r}">${i}</div>`}function k(n,r,i=r){let a=D(n,r,i),s=n===r,l=S(n),u=a&&n%2==1?` twr-row-alt`:``,d=[`twr-row`,s?`twr-row-current`:``,a?`twr-row-revealed`:`twr-row-fogged`,u].filter(Boolean).join(` `);if(n===0){let e=h(o);return`<div class="${d}" data-floor="0" style="top:${l}px; height:31px;" title="Town — the tower's entrance">${O(`twr-row-interior`,o,e,`--twr-outline:${g(e)};`,`<span class="twr-row-glyph">🏠</span><span class="twr-row-label">Town</span>`)}</div>`}if(!a)return`<div class="${d}" data-floor="${n}" style="top:${l}px; height:31px;" title="Unexplored">${O(`twr-row-interior twr-row-interior-fogged`,c,h(c),``,`<span class="twr-row-glyph">❓</span>`)}</div>`;let f=e(n),p=h(f.theme.floorBg),m=`--twr-outline:${g(p)};`,_=O(`twr-row-interior`,f.theme.floorBg,p,m,`<span class="twr-row-glyph">${t(f).display}</span><span class="twr-row-label">Floor ${n}</span>`);return`<div class="${d}" data-floor="${n}" style="top:${l}px; height:31px;" title="${f.name} — Floor ${n}">${_}</div>`}function A(){return i.map(e=>`
    <div class="twr-legend-item">
      <span class="twr-legend-swatch" style="background:${e.theme.floorBg}; border-color:${e.theme.wallBg};"></span>
      <span class="twr-legend-glyph">${t(e).display}</span>
      <span class="twr-legend-text">${e.name} <span class="twr-legend-range">(floors ${e.minFloor}-${e.maxFloor})</span></span>
    </div>`).join(``)}function j(){return`radial-gradient(1.4px 1.4px at 20% 3%, rgba(255, 255, 255, 0.9), transparent),
      radial-gradient(1px 1px at 55% 2%, rgba(255, 255, 255, 0.7), transparent),
      radial-gradient(1.6px 1.6px at 78% 5%, rgba(255, 255, 255, 0.85), transparent),
      radial-gradient(1px 1px at 35% 7%, rgba(255, 255, 255, 0.6), transparent),
      radial-gradient(1.4px 1.4px at 10% 11%, rgba(255, 255, 255, 0.55), transparent),
      radial-gradient(1px 1px at 88% 9%, rgba(255, 255, 255, 0.7), transparent),
      radial-gradient(1.2px 1.2px at 46% 14%, rgba(255, 255, 255, 0.5), transparent),
      radial-gradient(1px 1px at 65% 16%, rgba(255, 255, 255, 0.4), transparent),
      linear-gradient(180deg,
        #030308 0%,
        #070b1e 8%,
        #0d1740 18%,
        #17356e 32%,
        #2c5a9c 46%,
        #4c86c2 58%,
        #7fc0e8 68%,
        #b9dcee 78%,
        #dcebe0 88%,
        #e9edd8 100%)`}var M=[{top:`48%`,left:`8%`,w:120,h:34,o:.55},{top:`55%`,left:`58%`,w:150,h:40,o:.5},{top:`63%`,left:`20%`,w:100,h:28,o:.6},{top:`70%`,left:`48%`,w:170,h:44,o:.45},{top:`76%`,left:`2%`,w:110,h:30,o:.4},{top:`60%`,left:`82%`,w:90,h:26,o:.5}];function N(){return M.map(e=>`<div class="twr-cloud" style="top:${e.top}; left:${e.left}; width:${e.w}px; height:${e.h}px; opacity:${e.o};"></div>`).join(``)}function P(){return`
  .twr-stage {
    position: relative;
    /* Plain fallback fill (the sky gradient's own darkest tone), not the
       gradient itself — the gradient/clouds now live on .twr-sky, a
       .twr-outer child (see that class's own comment), so they scale/pan
       WITH the tower instead of sitting on this separate, never-moving
       stage background. This is just letterboxing for the rare sliver
       .twr-sky's own generous BACKDROP_SIDE_MARGIN buffer doesn't reach. */
    background: #030308;
    border-radius: 14px;
    padding: 34px 28px 66px 58px;
    display: flex;
    justify-content: center;
    overflow: hidden;
  }
  /* Soft blurred cloud blobs in .twr-sky's own lower band — see
     buildSkyCloudsHtml above for the markup/positions this styles. A
     .twr-sky child (mounted inside it by buildTowerOuterHtml below), so
     clouds scale/pan WITH the tower and ground, the same one-piece scene —
     see .twr-sky's own comment for why that matters in production. */
  .twr-cloud {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    filter: blur(9px);
    pointer-events: none;
  }
  @keyframes twr-ember-pulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
  .twr-ember-glow {
    position: absolute; left: 50%; bottom: 0; transform: translateX(-50%);
    width: 240px; height: 130px;
    /* Ashen Depths' own floorBg, not a hand-picked ember color — a warm
       glow rising from where the deepest zone actually sits. */
    background: radial-gradient(ellipse at center, rgba(200, 70, 25, 0.5), transparent 70%);
    pointer-events: none;
    animation: twr-ember-pulse 4.5s ease-in-out infinite;
  }
  .twr-outer { position: relative; width: 290px; height: 837px; }
  /* Geometrically inert wrapper around the tower's own structure — see
     buildTowerOuterHtml's markup comment. inset: 0 makes it an exact
     stand-in for .twr-outer as its children's containing block, so no child
     coordinate changes; the only reason it exists is to give the ending
     cutscene a single element to translate downward while the sky/ground
     layers outside it stay put (floorDescentTransition.ts). */
  .twr-body { position: absolute; inset: 0; }
  .twr-roof {
    position: absolute; top: 0; left: 0; width: 290px; height: 23px;
    background-color: ${s};
    background-image:
      repeating-linear-gradient(-27deg, rgba(0, 0, 0, 0.1) 0px 2px, transparent 2px 9px),
      linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 55%);
    clip-path: ${b()};
  }
  /* The exterior side wall's own masonry — the same flat STONE_BASE_COLOR +
     stoneTextureLayers() coursing/blobs the front-face rows use (previously
     this was a zone-tinted linear-gradient down the whole exterior; that
     read as a colored gradient rather than actual stone, so it's a real
     stone material now, the same as everywhere else on the tower, not a
     mood-lit gradient). Unlike the front-face bands, though, this face is a
     skewed parallelogram (sideClipPath), not axis-aligned — so both the
     floor-division lines AND stoneTextureLayers()'s own coursing are rotated
     by SIDE_SKEW_ANGLE_DEG to run parallel to the roofline's own diagonal
     edge, rather than rendering plain horizontal/vertical stripes across a
     face that visually recedes at an angle. The floor-division lines are one
     more layer on top of the masonry, marking each floor's own seam — a
     different concern from the texture underneath. stoneTextureLayers()
     always emits its 4 sub-layers in the same fixed order (0deg mortar,
     90deg mortar, light blob, dark blob), so the blend-mode list below
     assigns them multiply/overlay/overlay/multiply positionally. */
  .twr-side {
    position: absolute; top: 0; left: 0; width: 290px; height: 837px;
    background-color: ${w};
    background-image:
      repeating-linear-gradient(${_}deg, rgba(0, 0, 0, 0.18) 0px 1px, transparent 1px 31px),
      ${T(_)};
    background-blend-mode: multiply, multiply, overlay, overlay, multiply;
    filter: brightness(0.7) saturate(1.05);
    clip-path: ${x()};
  }
  .twr-seam-top {
    position: absolute; left: 0; top: 23px; width: 244px; height: 8px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0));
    pointer-events: none; z-index: 1;
  }
  .twr-seam-right {
    position: absolute; left: 237px; top: 23px; width: 7px; height: 814px;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.38));
    pointer-events: none; z-index: 1;
  }
  /* Floor 25's own stone base cap — the same material/shading
     (stoneTextureCss) and shadow treatment as every row's own
     .twr-row-ceiling above it, at the same CEIL_THICKNESS, giving the
     tower's true bottom edge (OUTER_H) a real stone floor instead of its
     last row's content simply stopping bare against the ground outside.
     A .twr-outer child, not part of any one .twr-row (there's no floor 26
     to supply this as a ceiling the way every other seam gets one for
     free) — positioned at the FRONT_H this slab's own thickness was added
     to (see FRONT_H's own comment), i.e. immediately below floor 25's row. */
  .twr-floor-base {
    position: absolute; left: 0; top: 829px; width: 244px; height: 8px;
    ${E()}
    box-shadow: inset 0 -4px 4px rgba(0, 0, 0, 0.55), inset 0 2px 0 rgba(255, 255, 255, 0.12);
  }
  /* The sky the tower reaches up into — towerBackdropBackground()'s own
     gradient/stars, painted onto a .twr-outer child (like .twr-ground/
     .twr-floor-base above) instead of a separately-positioned backdrop
     behind the tower, so the whole scene — sky, tower, ground — is one
     rigid picture that scales and pans together as a single unit (see
     towerBackdropBackground()'s own comment for why a separate, never-
     moving backdrop layer was wrong). Its BOTTOM edge meets .twr-ground's
     own TOP edge exactly (GROUND_LINE_Y - GROUND_SURFACE_DEPTH_PX — the same
     point, referenced from both sides) so sky hands off to ground with no gap and
     no overlap; its top edge extends SKY_TOP_MARGIN above the roofline
     (y=0) — see that constant's own comment for why this is a much smaller
     margin than .twr-ground's own BACKDROP_SIDE_MARGIN, despite both
     nominally serving "extend past the tower's own footprint for safety."
     Same generous BACKDROP_SIDE_MARGIN width as .twr-ground, though — width
     coverage doesn't have the same "the camera can only pan so far above
     floor 0" ceiling a top margin does. */
  .twr-sky {
    position: absolute; left: -478px; top: -400px;
    width: ${600*2}px; height: 1214px;
    pointer-events: none;
    background: ${j()};
  }
  /* Ground plane the tower stands on — a real grass-over-dirt cross-section,
     in the same cutaway spirit as the tower graphic itself (flat colored
     bands, no photographic blending), stacked strictly top-to-bottom:
     a lit top surface receding up-right behind the tower
     (GROUND_SURFACE_DEPTH_PX), the cut edge at GROUND_LINE_Y where the
     tower's own front face lands, the sod in cross-section
     (GROUND_TURF_DEPTH_PX), a dark root/topsoil seam, then dirt all the way
     down. Every boundary is a hard stop rather than a fade, so the whole
     thing reads as "the ground, sliced open" rather than a smooth gradient.

     A .twr-outer child (like the rows/spire above), not part of the fixed
     backdrop, so it scales and pans WITH the tower (production's
     floorDescentTransition.ts scales/translates .twr-outer itself to pan
     the "camera" — see that file's own comment) with no separate
     position-tracking code — exactly how .twr-spire/the old .twr-foundation
     this replaces already worked. It is emphatically NOT inside .twr-body,
     though: the ending's descent moves the tower through a stationary
     world, and this is the world (see .twr-body's own markup comment).

     Sized generously wide (BACKDROP_SIDE_MARGIN*2, centered under the front
     face — shared with .twr-sky below, see that constant's own comment) and
     tall enough to stay solid past the deepest the ending ever sinks the
     tower (GROUND_TOTAL_HEIGHT_PX), left to the surrounding overflow:hidden
     container (.twr-stage / #floor-descent-tower) to clip to the viewport.

     Paint order does the rest: this comes BEFORE .twr-body in the markup and
     neither carries a z-index, so the tower's own opaque faces paint over
     the ground wherever they overlap. That is what makes a sunk floor show
     THROUGH the earth in cross-section instead of being hidden by it — the
     entire point of a cutaway, and the reason the ending needs no z-index
     inversion of its own (docs/tower-bug-fixes.md's bug 19). */
  .twr-ground {
    position: absolute; left: -478px; top: 814px;
    width: ${600*2}px; height: ${y}px;
    pointer-events: none;
    background: linear-gradient(180deg,
      /* Lit top surface, receding up-right behind the tower — above the cut
         edge, which is why the tower's side face has something to end ON.
         Ends with a hard stop (two identical colors at the same px) rather
         than a fade, so the cut edge at GROUND_SURFACE_DEPTH_PX reads as a
         real edge of sliced earth. */
      #8ac763 0px, #7dbb56 23px,
      /* ...the sod, in cross-section, below the cut. */
      #5c9a3d 23px, #4d8433 37px,
      /* ...root/topsoil seam, then dirt all the way down. */
      #3f2c17 45px,
      #5a3d20 53px,
      #3a2712 129px);
  }
  /* Everything below GROUND_LINE_Y sits in shadow — the one layer in this
     module that paints OVER the tower rather than behind it, which is why
     it's the only .twr-outer child placed AFTER .twr-body in the markup.
     Plain DOM order, still no z-index anywhere (see .twr-ground above).

     This is what makes a sunk floor read as *underground* rather than just
     as a floor that happens to be drawn low on screen. Deliberately gentle
     and depth-graded rather than a flat mask: the rows stay fully legible
     (a cutaway exists to be read), they just lose the open-sky brightness
     the floors above the line keep. It only ever has a tower to darken
     during the ending's descent — at rest the whole structure is above the
     line and this falls over bare dirt, where its own contribution is
     already folded into that gradient's tuning. */
  .twr-underground {
    position: absolute; left: -478px; top: 837px;
    width: ${600*2}px; height: ${y-23}px;
    pointer-events: none;
    background: linear-gradient(180deg,
      rgba(18, 10, 4, 0.20) 0px,
      rgba(18, 10, 4, 0.42) 186px,
      rgba(12, 7, 3, 0.52) 496px);
  }
  /* Ground-contact ambient-occlusion shadow, hugging the tower's own base
     outline. The base has two straight edges, not one — the front face's
     bottom edge (horizontal) and the side face's bottom edge (diagonal, see
     sideClipPath) — so this needs two strips sharing one cross-section (a
     linear gradient perpendicular to the edge, dark at the contact line,
     fading to transparent on either side, at UNIFORM intensity along the
     whole edge — not a radial blob centered on one point, which is a
     simplification suited to round character sprites, not a geometric
     object with a real footprint outline). Also .twr-outer children, for
     the same scale/pan-for-free reason .twr-ground above is.

     Both strips straddle GROUND_LINE_Y, and like .twr-ground they sit
     OUTSIDE .twr-body — so during the ending's descent they stay put on the
     ground line while the tower slides through it, which is exactly right:
     a contact shadow belongs where the structure is entering the earth, not
     riding down with a base that is already buried. That falls out for free
     now only because the ground line and the tower's base are the same
     number; when they were 228px apart this shadow floated detached in the
     middle of a green field for the whole cutscene (docs/tower-bug-fixes.md's
     bug 19). */
  .twr-ao-edge {
    position: absolute; height: 30px;
    background: linear-gradient(to bottom,
      transparent 0%, rgba(0, 0, 0, 0.5) 42%, rgba(0, 0, 0, 0.5) 58%, transparent 100%);
    filter: blur(4px);
    pointer-events: none;
  }
  /* Front strip — straight, no rotation. Extended 10px past the tower's own
     left edge for a soft rounded end instead of a hard cutoff; stops right
     at the seam (FW) where the side strip picks up. */
  .twr-ao-front {
    left: -10px; top: 822px; width: 254px;
  }
  /* Side strip — same cross-section, rotated to lie flush against the side
     edge's own diagonal (SIDE_SKEW_ANGLE_DEG) and anchored at the seam (FW,
     OUTER_H) via transform-origin so it starts exactly where the front strip
     ends, running the strip's own length (SIDE_EDGE_LEN) along that
     diagonal. transform-origin: 0 50% pivots around the strip's own
     vertical center, matching the front strip's own -15px (half its 30px
     height) top offset above — without it the pivot (and the gradient's dark
     band, also centered in the strip) sits 15px below the actual corner
     instead of on it. */
  .twr-ao-side {
    left: 244px; top: 822px; width: ${v+8}px;
    transform-origin: 0 50%;
    transform: rotate(${_}deg);
  }
  .twr-spire {
    position: absolute;
    left: 144px; top: -10px; width: 0; height: 22px;
  }
  .twr-spire-pole { position: absolute; left: 0; top: 0; width: 2px; height: 22px; background: #2a2a2a; }
  .twr-spire-flag {
    position: absolute; left: 2px; top: 2px; width: 0; height: 0;
    border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-left: 11px solid #e8231f;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
  }
  /* height/top track the INTERIOR room (interiorRowTop, INTERIOR_H), not the
     stone-framed row (floorRowTop, FH) — otherwise the marker/ring visually
     span the wall/ceiling bands too, reading as if the highlight includes
     the masonry rather than marking the room itself. */
  .twr-here-marker {
    position: absolute; left: -36px; width: 32px; height: 23px;
    display: flex; align-items: center; justify-content: flex-end; gap: 1px;
    font-size: 13px; color: #ffd700; text-shadow: 0 0 4px rgba(0, 0, 0, 0.85), 0 0 2px rgba(0, 0, 0, 0.9);
    pointer-events: none; transition: top 0.3s ease; z-index: 3;
  }
  /* The gold "current floor" ring — a separate element tracking .twr-outer's
     INTERIOR room coordinate space (left:WALL_THICKNESS, width INTERIOR_W,
     height INTERIOR_H — see above) rather than a box-shadow baked onto
     whichever row currently carries .twr-row-current. It shares the
     here-marker's own top value and transition (top 0.3s ease) so the two
     move together: during a floor descent, this ring and the here-marker pan
     down onto the new floor's row first, while it's still fogged, then
     renderRows(toFloor) swaps the row content in afterward (the "flashy
     reveal" beat, see floorDescentTransition.ts's playFloorDescentTransition)
     — the reveal only happens once the ring/marker have actually arrived on
     that row. */
  .twr-current-ring {
    position: absolute; left: 7px; width: 230px; height: 23px;
    box-shadow: 0 0 0 2px #0a0a0a, 0 0 0 4px #ffd700, 0 0 0 5px #0a0a0a, 0 0 10px rgba(255, 215, 0, 0.7);
    pointer-events: none; transition: top 0.3s ease; z-index: 2;
  }
  /* Same glyph (▸, U+25B8) styles.css's chunk-edge-arrow uses for a
     dungeon-chunk boundary's live-door hint (.tile[data-edge-arrow]::before)
     — reused here instead of the bigger, unrelated ▶ this used to be, so
     "an arrow pointing at something reachable" reads as one consistent icon
     across the game. Already yellow via .twr-here-marker's own inherited
     color; no rotate() needed since ▸ points right by default, the same
     direction this marker always needs (toward its floor row) — exactly the
     edge-arrow's own zero-rotation data-edge-arrow="right" case. */
  .twr-here-arrow { font-size: 0.75em; }
  .twr-row {
    position: absolute;
    left: 0;
    width: 244px;
    font-size: 10.5px;
    font-weight: 600;
    cursor: pointer;
    transition: filter 0.15s;
  }
  .twr-row:hover { filter: brightness(1.25); }
  .twr-row-fogged { cursor: default; }
  .twr-row-fogged:hover { filter: none; }
  .twr-row-fogged .twr-row-glyph { font-size: 11px; opacity: 0.7; }
  /* Scoped to .twr-row-interior (not the outer .twr-row) so the alternating
     darkening only affects the floor's own color, not the fixed-material
     stone bands framing it — matching the original relationship where this
     pseudo-element and the glyph/label were siblings directly inside the row
     (::before paints first, i.e. below, so it darkens the background without
     covering the text on top of it). */
  .twr-row-alt .twr-row-interior::before { content: ''; position: absolute; inset: 0; background: rgba(0, 0, 0, 0.09); pointer-events: none; }
  /* The stone ceiling (this floor's own slab, doubling as the underside of
     the floor above) and the two side-wall slices — a fixed-material band
     framing the interior content box below, giving the row real visual
     thickness instead of a flat color rectangle with a hairline divider. */
  .twr-row-stone { position: absolute; ${E()} }
  .twr-row-ceiling {
    left: 0; top: 0; width: 100%; height: 8px;
    box-shadow: inset 0 -4px 4px rgba(0, 0, 0, 0.55), inset 0 2px 0 rgba(255, 255, 255, 0.12);
  }
  .twr-row-wall-l {
    left: 0; top: 0; bottom: 0; width: 7px;
    box-shadow: inset -4px 0 4px rgba(0, 0, 0, 0.5), inset 2px 0 0 rgba(255, 255, 255, 0.1);
  }
  .twr-row-wall-r {
    right: 0; top: 0; bottom: 0; width: 7px;
    box-shadow: inset 4px 0 4px rgba(0, 0, 0, 0.5), inset -2px 0 0 rgba(255, 255, 255, 0.1);
  }
  /* The floor's own content, inset from the stone bands above — this is what
     used to be .twr-row's own flex/padding, moved here now that .twr-row
     itself is just the outer footprint (stone bands + this box) rather than
     the content container. */
  .twr-row-interior {
    position: absolute;
    left: 7px; right: 7px; top: 8px; bottom: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 8px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .twr-row-interior-fogged { justify-content: center; }
  /* No visual styling of its own — the gold ring that used to be a
     box-shadow baked directly onto this class now lives on the separate,
     independently-positioned .twr-current-ring (see above), so it can
     animate in step with .twr-here-marker instead of snapping the instant
     this class moves to a new row. The class itself stays (still asserted
     by tests/towerCutaway.test.ts) as a semantic "this is the current
     floor's row" marker. */
  .twr-row-glyph { line-height: 1; }
  .twr-row-label {
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    text-shadow: -1px -1px 0 var(--twr-outline), 1px -1px 0 var(--twr-outline), -1px 1px 0 var(--twr-outline), 1px 1px 0 var(--twr-outline);
  }
  .twr-continues { text-align: center; font-size: 0.72rem; color: #55555f; margin-top: 6px; letter-spacing: 0.05em; }

  /* Loading-screen flash — same 0.4s ease timing as the real fadeToBlack/
     fadeFromBlack (scripts/fade.ts). In the docs-hub preview this is its own
     self-contained fade; in the real transition screen (floorDescentTransition.ts)
     the surrounding #scene-fade-overlay already IS this black backdrop, so
     twr-flash there stays permanently opaque for the tower's mounted
     lifetime rather than fading independently. */
  .twr-flash {
    position: absolute; inset: 0; background: #000; opacity: 0;
    pointer-events: none; transition: opacity 0.4s ease; border-radius: 14px; z-index: 5;
  }
  .twr-flash.twr-flash-on { opacity: 1; }

  /* The floor-descent transition's "fancy/flashy reveal" beat — a warm gold
     glow timed to when the next floor's row swaps in, before the
     here-marker actually pans down onto it (see floorDescentTransition.ts's
     playFloorDescentTransition and its own REVEAL_* timing constants, which
     this doc's preview imports directly rather than re-tuning a second
     copy). Sized to exactly INTERIOR_W x INTERIOR_H — the same box
     .twr-row-interior occupies, not the stone-framed row — and positioned
     via JS (top = interiorRowTop(toFloor), set by the caller right before
     turning it on) so the glow reads as sitting ON the next floor's actual
     room rather than washing out over its stone wall/ceiling bands too; the
     box-shadow blur is what lets it bleed outward into a "glow" rather than
     a hard-edged gold rectangle. Mounted inside .twr-outer (see
     buildTowerOuterHtml below) so it scales/pans with the tower exactly
     like the row it's glowing over. */
  .twr-reveal-flash {
    position: absolute; left: 7px; width: 230px; height: 23px;
    pointer-events: none; z-index: 4;
    background: rgba(255, 215, 0, 0.55);
    box-shadow: 0 0 18px 6px rgba(255, 215, 0, 0.75), 0 0 36px 14px rgba(255, 215, 0, 0.35);
    border-radius: 2px;
    opacity: 0; transition: opacity 0.35s ease;
  }
  .twr-reveal-flash.twr-reveal-flash-on { opacity: 1; }

  .twr-loading-overlay {
    position: absolute; inset: 0; z-index: 6; pointer-events: none;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
    opacity: 0; transition: opacity 0.3s ease;
  }
  .twr-loading-overlay.twr-loading-overlay-on { opacity: 1; }
  .twr-loading-caption {
    color: #f6f3ec; font-size: 11.5px; font-weight: 700; letter-spacing: 0.04em;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.9), 0 0 2px rgba(0, 0, 0, 0.9); white-space: nowrap;
  }
  `}function F(e=!0){return`
      <div class="twr-outer" id="twr-outer">
        <!-- .twr-sky/.twr-ground/.twr-ao-edge/.twr-floor-base MUST come
             before .twr-roof/.twr-side in this markup: none of these carry
             a z-index (still true after the ground/AO port — see
             .twr-ground's own comment), so plain DOM order decides paint
             order between them, and .twr-sky/.twr-ground are deliberately
             much wider/taller than the tower's own footprint (they need to
             reach up/around it — see BACKDROP_SIDE_MARGIN). Putting them
             first means the tower's own opaque faces paint OVER the
             sky/ground/shadow wherever they overlap, instead of those
             layers covering the tower's own geometry. .twr-sky comes before
             .twr-ground specifically (not just "somewhere in this group")
             because .twr-ground's own top edge sits partway down .twr-sky's
             own bottom — .twr-ground has to paint OVER that overlap, or a
             band of sky would show through the grass. .twr-floor-base's own
             bottom-right corner sits exactly on .twr-side's bottom-left
             vertex (both meet at (FW, OUTER_H)) — it has to be in this same
             "paints behind .twr-side" group too (not grouped with #twr-rows
             below, even though it's the same stone material and only ever
             visible in the same x=[0,FW] strip #twr-rows already occupies),
             or that one shared corner reads as a flat rectangle sitting in
             FRONT of the receding perspective wall instead of tucking
             behind it the way every actual floor-to-floor seam already does
             (those seams are baked into .twr-side's own
             repeating-linear-gradient texture, not a separate element, so
             they never have this front/behind ambiguity to begin with). -->
        <div class="twr-sky">${N()}</div>
        <div class="twr-ground"></div>
        <div class="twr-ao-edge twr-ao-front"></div>
        <div class="twr-ao-edge twr-ao-side"></div>
        <!-- .twr-body groups the tower's own STRUCTURE (everything that is
             the building itself) apart from the sky/ground/contact-shadow
             layers above, which are the world it stands in. Geometrically
             inert: "position: absolute; inset: 0" makes it an exact stand-in
             for .twr-outer as every child's containing block, so all the
             absolute top/left math below (floorRowTop, the here-marker's own
             negative left bleed, the spire) is unchanged, and it carries no
             transform of its own by default. It exists so ONE thing can move
             the tower without moving the ground: floorDescentTransition.ts's
             playTowerDescentEnding translates this group downward for the
             ending's "the tower comes down" beat, which used to be faked by
             panning the camera over a scene where tower and ground were
             welded together (docs/tower-bug-fixes.md's bug 6). -->
        <div class="twr-body" id="twr-body">
          <div class="twr-floor-base"></div>
          <div class="twr-roof"></div>
          <div class="twr-side"></div>
          <div class="twr-seam-top"></div>
          <div class="twr-seam-right"></div>
          <div id="twr-rows"></div>
          <div class="twr-current-ring" id="twr-current-ring"></div>
          <div class="twr-here-marker" id="twr-here-marker"><span>🥷</span><span class="twr-here-arrow">▸</span></div>
          <div class="twr-spire">
            <div class="twr-spire-pole"></div>
            <div class="twr-spire-flag"></div>
          </div>
        </div>
        <!-- .twr-underground is the one world layer that belongs AFTER
             .twr-body: it shades whatever has passed below GROUND_LINE_Y,
             which during the ending's descent is the tower itself. Still
             outside .twr-body (it's the world, not the structure — it must
             not ride down with the tower), and still no z-index anywhere;
             being later in the markup is the whole mechanism. -->
        <div class="twr-underground"></div>
        <div class="twr-flash" id="twr-flash"></div>
        ${L()}
        ${e?I():``}
      </div>
  `}function I(){return`
        <div class="twr-loading-overlay" id="twr-loading-overlay">
          <div class="twr-loading-caption" id="twr-loading-caption"></div>
        </div>
  `}function L(){return`<div class="twr-reveal-flash" id="twr-reveal-flash"></div>`}function R(){return`
    <div class="twr-stage">
      <div class="twr-ember-glow"></div>
      ${F()}
    </div>
  `}function z(e,t=e){return Array.from({length:26},(n,r)=>k(r,e,t)).join(``)}var B=16;function V(e,t,n){let r=Math.max(1,e-2*B)/326,i=C(n)+23/2;return{scale:r,offsetX:B+36*r,offsetY:t/2-i*r}}function H(e,t,n,r){let{scale:i,offsetX:a,offsetY:o}=V(t,n,r);e.style.transform=`translate(${a}px, ${o}px) scale(${i})`}function U(e,t){let n=Math.max(1,e-2*B)/326;return{scale:n,offsetX:B+36*n,offsetY:t/2-837*n}}function W(e,t,n){let{scale:r,offsetX:i,offsetY:a}=U(t,n);e.style.transform=`translate(${i}px, ${a}px) scale(${r})`}function G(){return 806-S(0)}var K=!1;function q(){if(K)return;K=!0;let e=document.createElement(`style`);e.id=`floor-descent-transition-styles`,e.textContent=`
    ${P()}
    #floor-descent-tower {
      position: absolute; inset: 0; overflow: hidden;
    }
    /* Plain fallback fill (the sky gradient's own darkest tone), not the
       gradient itself — the gradient/clouds/ground now live on .twr-sky/
       .twr-ground, .twr-outer children (towerCutaway.ts), so they scale
       and pan WITH .fdt-camera below as one piece instead of sitting on
       this separate, never-moving backdrop — see .twr-sky's own comment
       for why a detached backdrop was wrong. This is just letterboxing for
       the rare sliver .twr-sky's own generous margin doesn't reach. */
    #floor-descent-tower .fdt-backdrop {
      position: absolute; inset: 0; background: #030308;
    }
    #floor-descent-tower .fdt-camera {
      position: absolute; left: 0; top: 0; transform-origin: 0 0;
    }
    #floor-descent-tower .fdt-camera.fdt-camera-animated { transition: transform 0.9s ease; }
    /* docs/tower-ascent.md's Phase 5 ending — the one-time "watch the tower
       come down" beat. This transition rides .twr-body (the tower's own
       structure — towerCutaway.ts) and NOT .fdt-camera, which is the whole
       fix for docs/tower-bug-fixes.md's bug 6: the camera used to pan from
       the town row down to ground level, and since the sky, the tower and
       the grass are all children of that one transformed camera, the entire
       scene slid as a welded piece and nothing ever read as the tower
       moving. Holding the camera still and translating only the body means
       the grass stays exactly where it is while the tower descends into it.
       Duration kept in sync by hand with this file's own DESCENT_PAN_MS
       (same convention 0.9s/PAN_MS above already sets), with a
       slow-in/slow-out easing rather than plain 'ease' — this is a single
       deliberate, cinematic motion, not a quick camera hop. */
    #floor-descent-tower .twr-body.fdt-body-descending { transition: transform 3200ms cubic-bezier(0.65, 0, 0.35, 1); }
    /* There is deliberately NO z-index inversion here. An earlier pass lifted
       .twr-ground above .twr-body for this beat so the tower would "sink into
       the grass" — but the grass it sank into was a 228px slab standing seven
       rows tall above the tower's own base, so the inversion swallowed floors
       19-25 in a single frame the moment it was applied, before the descent
       had moved a pixel, and never gave them back. With one ground line at
       the base (towerCutaway.ts's GROUND_LINE_Y) the ordinary paint order is
       already correct: the earth is drawn first and the tower over it, so a
       sunk floor shows THROUGH the cross-section — which is the whole point
       of a cutaway. See docs/tower-bug-fixes.md's bug 19. */
    /* Reuses styles.css's own @keyframes screenRumble (CSS keyframes are
       named globally across every stylesheet in the document, not scoped to
       whichever one declared them) — the same wobble body.ending-rumble
       plays over the town view before the fade, now playing on the tower
       stage itself for the whole descent pan ("shakes again as the tower
       visibly descends" — docs/tower-ascent.md's ending cutscene beat
       order), continuous until playTowerDescentEnding removes the class
       once the pan finishes. */
    #floor-descent-tower.fdt-camera-shake { animation: screenRumble 0.32s ease-in-out infinite; }
    /* A single sharp jolt (not infinite, unlike fdt-camera-shake above) the
       instant the descent pan finishes — the impact settling, distinct from
       the sustained shake that played throughout the motion. */
    #floor-descent-tower.fdt-settle-shake { animation: fdtSettleShake 0.4s ease-in-out; }
    @keyframes fdtSettleShake {
      0%, 100% { transform: translate(0, 0); }
      20%      { transform: translate(-5px, 4px); }
      45%      { transform: translate(6px, -3px); }
      70%      { transform: translate(-3px, 2px); }
      90%      { transform: translate(2px, -1px); }
    }
    /* docs/tower-ascent.md's Phase 5 dust/debris particle system — "nothing
       like it exists today" per that doc's own VFX inventory, so this is
       genuinely new rather than reusing an existing overlay mechanism.
       spawnDescentParticles below creates one .fdt-debris-chip per particle
       (randomized left/size/timing via inline style), all sharing this one
       fall+drift+fade keyframe; --drift (a per-particle CSS custom property)
       is what gives each chip its own horizontal wander instead of every
       particle falling in an identical straight line. */
    #floor-descent-tower .fdt-debris-layer {
      position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 2;
    }
    #floor-descent-tower .fdt-debris-chip {
      position: absolute; top: -20px;
      animation-name: fdtDebrisFall; animation-timing-function: ease-in; animation-fill-mode: both;
    }
    #floor-descent-tower .fdt-debris-dust {
      background: rgba(205, 195, 175, 0.6); border-radius: 50%;
    }
    #floor-descent-tower .fdt-debris-rock {
      background: #4a4038; border-radius: 2px;
    }
    @keyframes fdtDebrisFall {
      0%   { transform: translate(0, 0); opacity: 0; }
      8%   { opacity: 1; }
      100% { transform: translate(var(--drift), 115vh); opacity: 0; }
    }
  `,document.head.appendChild(e)}function J(e,t){let n=document.createElement(`div`);n.className=`fdt-debris-layer`,e.appendChild(n);for(let e=0;e<22;e++){let e=document.createElement(`div`),r=Math.random()<.6;e.className=`fdt-debris-chip ${r?`fdt-debris-dust`:`fdt-debris-rock`}`;let i=r?3+Math.random()*4:5+Math.random()*8,a=Math.round((Math.random()-.5)*140),o=Math.random()*t*.7,s=t*(.45+Math.random()*.5);e.style.left=`${Math.random()*100}%`,e.style.width=`${i}px`,e.style.height=`${i}px`,e.style.setProperty(`--drift`,`${a}px`),e.style.animationDelay=`${o}ms`,e.style.animationDuration=`${s}ms`,n.appendChild(e)}setTimeout(()=>n.remove(),t+500)}var Y=1100,X=1200,Z=3200;function Q(e){return new Promise(t=>setTimeout(t,e))}function $(){return{fromFloor:n.currentLevel,revealedBefore:n.maxFloorReached}}async function ee(e,t,n=e){let i=document.getElementById(`scene-fade-overlay`);if(!i)return;q();let a=document.createElement(`div`);a.id=`floor-descent-tower`,a.innerHTML=`
    <div class="fdt-backdrop"></div>
    <div class="fdt-camera" id="fdt-camera">${F(!1)}</div>
    ${I()}
  `,i.appendChild(a);let o=a.querySelector(`#twr-rows`),s=a.querySelector(`#twr-here-marker`),c=a.querySelector(`#twr-current-ring`),l=a.querySelector(`#fdt-camera`),u=a.querySelector(`#twr-reveal-flash`),d=a.querySelector(`#twr-loading-overlay`),f=a.querySelector(`#twr-loading-caption`),p=a.clientWidth||window.innerWidth,m=a.clientHeight||window.innerHeight;function h(e){o.innerHTML=z(e,n)}function g(e){let t=`${C(e)}px`;s.style.top=t,c.style.top=t}h(e),g(e),H(l,p,m,e),f.textContent=r(t<e?`transition.ascending`:`transition.descending`),d.classList.add(`twr-loading-overlay-on`),await Q(Y),l.classList.add(`fdt-camera-animated`),g(t),H(l,p,m,t),await Q(900),await Q(500),u.style.top=`${C(t)}px`,u.classList.add(`twr-reveal-flash-on`),await Q(350),h(t),await Q(300),u.classList.remove(`twr-reveal-flash-on`),await Q(350),await Q(X),d.classList.remove(`twr-loading-overlay-on`),a.remove()}async function te(){let e=document.getElementById(`scene-fade-overlay`);if(!e)return;q();let t=document.createElement(`div`);t.id=`floor-descent-tower`,t.innerHTML=`
    <div class="fdt-backdrop"></div>
    <div class="fdt-camera" id="fdt-camera">${F(!1)}</div>
    ${I()}
  `,e.appendChild(t);let n=t.querySelector(`#twr-rows`),r=t.querySelector(`#twr-here-marker`),i=t.querySelector(`#twr-current-ring`),o=t.querySelector(`#fdt-camera`),s=t.querySelector(`#twr-body`),c=t.querySelector(`#twr-loading-overlay`),l=t.querySelector(`#twr-loading-caption`);r.style.display=`none`,i.style.display=`none`;let u=t.clientWidth||window.innerWidth,d=t.clientHeight||window.innerHeight;n.innerHTML=z(25),W(o,u,d),l.textContent=`The tower is coming down…`,c.classList.add(`twr-loading-overlay-on`),await Q(800),s.classList.add(`fdt-body-descending`),t.classList.add(`fdt-camera-shake`),a(`towerRumble`),s.offsetWidth,s.style.transform=`translateY(${G()}px)`,J(t,Z),await Q(Z/2),a(`towerRumble`),await Q(Z/2),t.classList.remove(`fdt-camera-shake`),c.classList.remove(`twr-loading-overlay-on`),a(`towerSettle`),t.classList.add(`fdt-settle-shake`),await Q(900),t.classList.remove(`fdt-settle-shake`),t.remove()}export{te as a,C as c,ee as i,A as l,X as n,P as o,$ as r,R as s,Y as t,z as u};