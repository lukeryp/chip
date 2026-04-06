"use client";

interface ExerciseSvgProps {
  exerciseId: string;
  className?: string;
}

export function ExerciseSvg({ exerciseId, className = "" }: ExerciseSvgProps) {
  switch (exerciseId) {
    case "pushup":
      return (
        <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="80" fill="#111" />
          <line x1="5" y1="70" x2="115" y2="70" stroke="#2a2a2a" strokeWidth="1.5" />
          <g style={{ animation: "pu 1.4s ease-in-out infinite", transformOrigin: "60px 55px" }}>
            <circle cx="16" cy="37" r="7" fill="#00af51" />
            <line x1="22" y1="41" x2="88" y2="55" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="34" y1="44" x2="34" y2="60" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="64" y1="50" x2="64" y2="66" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="82" y1="54" x2="76" y2="68" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="88" y1="55" x2="96" y2="68" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "squat":
      return (
        <svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="90" fill="#111" />
          <line x1="10" y1="78" x2="110" y2="78" stroke="#2a2a2a" strokeWidth="1.5" />
          <g style={{ animation: "sq 1.6s ease-in-out infinite", transformOrigin: "60px 30px" }}>
            <circle cx="60" cy="16" r="7" fill="#00af51" />
            <line x1="60" y1="23" x2="60" y2="52" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="60" y1="34" x2="44" y2="48" stroke="#00af51" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="60" y1="34" x2="76" y2="48" stroke="#00af51" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="57" y1="52" x2="48" y2="72" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="63" y1="52" x2="72" y2="72" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "burpee":
      return (
        <svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="90" fill="#111" />
          <line x1="10" y1="78" x2="110" y2="78" stroke="#2a2a2a" strokeWidth="1.5" />
          <g style={{ animation: "burpee 2.2s ease-in-out infinite", transformOrigin: "60px 50px" }}>
            <circle cx="60" cy="18" r="7" fill="#00af51" />
            <line x1="60" y1="25" x2="60" y2="55" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="60" y1="35" x2="45" y2="50" stroke="#00af51" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="60" y1="35" x2="75" y2="50" stroke="#00af51" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="57" y1="55" x2="48" y2="74" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="63" y1="55" x2="72" y2="74" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "plank":
      return (
        <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="80" fill="#111" />
          <line x1="5" y1="68" x2="115" y2="68" stroke="#2a2a2a" strokeWidth="1.5" />
          <g style={{ animation: "plank 2s ease-in-out infinite" }}>
            <circle cx="18" cy="38" r="7" fill="#00af51" />
            <line x1="24" y1="42" x2="94" y2="50" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="32" y1="43" x2="32" y2="58" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="52" y1="46" x2="52" y2="62" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="88" y1="50" x2="82" y2="64" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="94" y1="50" x2="100" y2="64" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "boxjump":
      return (
        <svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="90" fill="#111" />
          <rect x="36" y="60" width="48" height="18" rx="3" fill="#1e1e1e" stroke="#333" strokeWidth="1.5" />
          <g style={{ animation: "bj 1.8s ease-in-out infinite", transformOrigin: "60px 60px" }}>
            <circle cx="60" cy="20" r="7" fill="#00af51" />
            <line x1="60" y1="27" x2="60" y2="56" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="60" y1="37" x2="45" y2="50" stroke="#00af51" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="60" y1="37" x2="75" y2="50" stroke="#00af51" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="57" y1="56" x2="50" y2="72" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="63" y1="56" x2="70" y2="72" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "mountainclimber":
      return (
        <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="80" fill="#111" />
          <line x1="5" y1="68" x2="115" y2="68" stroke="#2a2a2a" strokeWidth="1.5" />
          <circle cx="18" cy="38" r="7" fill="#00af51" />
          <line x1="24" y1="42" x2="92" y2="52" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="43" x2="30" y2="58" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="46" x2="50" y2="62" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
          <g style={{ animation: "mcll 0.8s ease-in-out infinite", transformOrigin: "75px 52px" }}>
            <line x1="75" y1="52" x2="68" y2="66" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g style={{ animation: "mcrl 0.8s ease-in-out infinite", transformOrigin: "85px 52px" }}>
            <line x1="85" y1="52" x2="92" y2="66" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "lunge":
      return (
        <svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="90" fill="#111" />
          <line x1="10" y1="78" x2="110" y2="78" stroke="#2a2a2a" strokeWidth="1.5" />
          <g style={{ animation: "lu 1.8s ease-in-out infinite", transformOrigin: "60px 45px" }}>
            <circle cx="55" cy="16" r="7" fill="#00af51" />
            <line x1="55" y1="23" x2="55" y2="52" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="55" y1="33" x2="40" y2="47" stroke="#00af51" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="55" y1="33" x2="70" y2="47" stroke="#00af51" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="53" y1="52" x2="35" y2="72" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="57" y1="52" x2="80" y2="62" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="80" y1="62" x2="76" y2="76" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "broadjump":
      return (
        <svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="90" fill="#111" />
          <line x1="10" y1="75" x2="110" y2="75" stroke="#2a2a2a" strokeWidth="1.5" />
          <path d="M15 75 Q 60 72 105 75" stroke="#2a2a2a" strokeWidth="1" fill="none" strokeDasharray="4,3" />
          <g style={{ animation: "brd 2s ease-in-out infinite", transformOrigin: "28px 58px" }}>
            <circle cx="28" cy="30" r="6" fill="#00af51" />
            <line x1="28" y1="36" x2="28" y2="58" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="28" y1="44" x2="15" y2="56" stroke="#00af51" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="28" y1="44" x2="40" y2="54" stroke="#00af51" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="26" y1="58" x2="20" y2="72" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1="58" x2="36" y2="72" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "medballslam":
      return (
        <svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="90" fill="#111" />
          <line x1="10" y1="78" x2="110" y2="78" stroke="#2a2a2a" strokeWidth="1.5" />
          <g style={{ animation: "slam 1.6s ease-in-out infinite", transformOrigin: "60px 55px" }}>
            <circle cx="60" cy="28" r="7" fill="#00af51" />
            <line x1="60" y1="35" x2="60" y2="62" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="60" y1="40" x2="48" y2="30" stroke="#00af51" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="60" y1="40" x2="72" y2="30" stroke="#00af51" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="57" y1="62" x2="49" y2="76" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
            <line x1="63" y1="62" x2="71" y2="76" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g style={{ animation: "slamball 1.6s ease-in-out infinite", transformOrigin: "60px 18px" }}>
            <circle cx="60" cy="18" r="9" fill="#f4ee19" opacity="0.9" />
          </g>
        </svg>
      );

    case "sprint":
      return (
        <svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="90" fill="#111" />
          <line x1="10" y1="78" x2="110" y2="78" stroke="#2a2a2a" strokeWidth="1.5" />
          <circle cx="60" cy="18" r="7" fill="#00af51" />
          <line x1="60" y1="25" x2="60" y2="54" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
          <g style={{ animation: "sp-la 0.7s ease-in-out infinite", transformOrigin: "60px 36px" }}>
            <line x1="60" y1="36" x2="44" y2="50" stroke="#00af51" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <g style={{ animation: "sp-ra 0.7s ease-in-out infinite", transformOrigin: "60px 36px" }}>
            <line x1="60" y1="36" x2="76" y2="50" stroke="#00af51" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <g style={{ animation: "sp-ll 0.7s ease-in-out infinite", transformOrigin: "57px 54px" }}>
            <line x1="57" y1="54" x2="44" y2="72" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g style={{ animation: "sp-rl 0.7s ease-in-out infinite", transformOrigin: "63px 54px" }}>
            <line x1="63" y1="54" x2="76" y2="72" stroke="#00af51" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="80" fill="#111" />
          <circle cx="60" cy="40" r="20" fill="none" stroke="#2a2a2a" strokeWidth="2" />
          <text x="60" y="45" textAnchor="middle" fill="#777" fontSize="10">?</text>
        </svg>
      );
  }
}
