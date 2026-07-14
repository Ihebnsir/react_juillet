import { useMemo } from 'react';

import './skillBridgePreloader.css';

export function SkillBridgePreloader({ fadingOut = false }) {
  const slogan = useMemo(() => 'Learn. Grow. Connect.', []);

  return (
    <div
      className={`sb-preloader ${fadingOut ? 'sb-preloader--fadeout' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="sb-preloader__inner">
        <div className="sb-logo" aria-label="SkillBridge loading">
          <div className="sb-logo__mark" aria-hidden="true">
            {/* Orb */}
            <div className="sb-logo__orb">
              <div className="sb-logo__orbGlow" />
            </div>

            {/* Bridge structure */}
            <div className="sb-logo__bridge" />

            {/* Circuit lines */}
            <div className="sb-logo__circuit sb-logo__circuit--a" />
            <div className="sb-logo__circuit sb-logo__circuit--b" />

            {/* Spinner integrated */}
            <div className="sb-spinner" aria-hidden="true">
              <div className="sb-spinner__ring" />
              <div className="sb-spinner__dot" />
            </div>
          </div>

          <div className="sb-logo__type">
            <div className="sb-logo__name">SkillBridge</div>
            <div className="sb-logo__slogan">{slogan}</div>
          </div>
        </div>

        <div className="sb-preloader__hint" aria-hidden="true">
          <span className="sb-preloader__hintDot" />
          <span className="sb-preloader__hintText">Loading your workspace…</span>
        </div>
      </div>
    </div>
  );
}



