/* @ds-bundle: {"format":4,"namespace":"TriluDesignSystem_9e1798","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"ExerciseRow","sourcePath":"components/journey/ExerciseRow.jsx"},{"name":"MascotBubble","sourcePath":"components/journey/MascotBubble.jsx"},{"name":"MilestoneChip","sourcePath":"components/journey/MilestoneChip.jsx"},{"name":"StatTile","sourcePath":"components/journey/StatTile.jsx"},{"name":"StreakRow","sourcePath":"components/journey/StreakRow.jsx"},{"name":"TrailPath","sourcePath":"components/journey/TrailPath.jsx"},{"name":"AppHeader","sourcePath":"components/navigation/AppHeader.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"89339e4fe48e","components/core/Badge.jsx":"4c9fb5cadef1","components/core/Button.jsx":"6976f909c1bc","components/core/Card.jsx":"c7b782069330","components/core/IconButton.jsx":"325ff73bfda4","components/core/Tag.jsx":"4ab96e81f9ec","components/feedback/Dialog.jsx":"0b25cd7a1f93","components/feedback/ProgressBar.jsx":"0067b5d4dfed","components/feedback/Toast.jsx":"9bbd6c58bdf9","components/feedback/Tooltip.jsx":"b0f2e3552d0f","components/forms/Checkbox.jsx":"63f329715401","components/forms/Input.jsx":"fcfc759afcb5","components/forms/Radio.jsx":"38676a066c31","components/forms/Select.jsx":"0c40f103f49d","components/forms/Switch.jsx":"3d12f2324128","components/journey/ExerciseRow.jsx":"479e51c24b28","components/journey/MascotBubble.jsx":"f84997714d27","components/journey/MilestoneChip.jsx":"ae70282b75aa","components/journey/StatTile.jsx":"e4628d4236f0","components/journey/StreakRow.jsx":"fb16c79eb413","components/journey/TrailPath.jsx":"9ee9b790870a","components/navigation/AppHeader.jsx":"ebcf9af53ce1","components/navigation/TabBar.jsx":"c1c3bd9fc3e7","components/navigation/Tabs.jsx":"5f7cb76f392f","ui_kits/trilu-app/App.jsx":"88f4473a19d1","ui_kits/trilu-app/FriendsScreen.jsx":"92555f292b43","ui_kits/trilu-app/HomeScreen.jsx":"64e4acf72511","ui_kits/trilu-app/OnboardingScreen.jsx":"138489be2589","ui_kits/trilu-app/PhoneFrame.jsx":"3f8136591c6a","ui_kits/trilu-app/ProfileScreen.jsx":"ef14336a5fa7","ui_kits/trilu-app/WorkoutScreen.jsx":"484936276f97"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TriluDesignSystem_9e1798 = window.TriluDesignSystem_9e1798 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
const sz = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 64,
  xl: 96
};
function Avatar({
  src,
  name = '',
  size = 'md',
  ring,
  style,
  ...rest
}) {
  const d = sz[size] || 44;
  const initials = name.trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
  return React.createElement('div', {
    style: {
      width: d,
      height: d,
      borderRadius: 'var(--radius-pill)',
      overflow: 'hidden',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto',
      background: 'var(--violet-100)',
      color: 'var(--violet-700)',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-bold)',
      fontSize: d * 0.36,
      boxShadow: ring ? '0 0 0 3px ' + ring : 'none',
      ...style
    },
    ...rest
  }, src ? React.createElement('img', {
    src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function Badge({
  tone = 'neutral',
  children,
  style,
  ...rest
}) {
  const t = {
    neutral: ['var(--ink-100)', 'var(--ink-700)'],
    violet: ['var(--violet-50)', 'var(--violet-600)'],
    coral: ['var(--coral-50)', 'var(--coral-700)'],
    mint: ['var(--mint-50)', 'var(--mint-700)'],
    sun: ['var(--sun-50)', 'var(--sun-800)'],
    solid: ['var(--violet-500)', '#fff']
  }[tone] || ['var(--ink-100)', 'var(--ink-700)'];
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: t[0],
      color: t[1],
      padding: '4px 10px',
      borderRadius: 'var(--radius-pill)',
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      ...style
    },
    ...rest
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const sizes = {
  sm: {
    h: 'var(--control-h-sm)',
    px: '14px',
    fs: 'var(--text-caption)'
  },
  md: {
    h: 'var(--control-h-md)',
    px: '20px',
    fs: 'var(--text-body-md)'
  },
  lg: {
    h: 'var(--control-h-lg)',
    px: '28px',
    fs: 'var(--text-body-lg)'
  }
};
const looks = {
  primary: {
    background: 'var(--violet-500)',
    color: 'var(--text-on-brand)',
    boxShadow: 'var(--shadow-brand)',
    border: 'none'
  },
  accent: {
    background: 'var(--coral-500)',
    color: '#fff',
    boxShadow: 'var(--shadow-coral)',
    border: 'none'
  },
  success: {
    background: 'var(--mint-500)',
    color: '#fff',
    boxShadow: '0 8px 20px rgba(53,201,154,.28)',
    border: 'none'
  },
  secondary: {
    background: 'var(--violet-50)',
    color: 'var(--violet-600)',
    border: 'none',
    boxShadow: 'none'
  },
  outline: {
    background: 'transparent',
    color: 'var(--text-title)',
    border: 'var(--border-w-strong) solid var(--border-default)',
    boxShadow: 'none'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-brand)',
    border: 'none',
    boxShadow: 'none'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  onClick,
  type = 'button',
  children,
  style,
  ...rest
}) {
  const s = sizes[size] || sizes.md,
    look = looks[variant] || looks.primary;
  const [down, setDown] = React.useState(false);
  return React.createElement('button', {
    type,
    disabled: disabled || loading,
    onClick,
    onPointerDown: () => setDown(true),
    onPointerUp: () => setDown(false),
    onPointerLeave: () => setDown(false),
    style: {
      display: block ? 'flex' : 'inline-flex',
      width: block ? '100%' : 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
      minHeight: s.h,
      padding: '0 ' + s.px,
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--weight-bold)',
      fontSize: s.fs,
      lineHeight: 1,
      borderRadius: 'var(--radius-pill)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'transform var(--dur-fast) var(--ease-standard),filter var(--dur-fast) var(--ease-standard),background var(--dur-fast) var(--ease-standard)',
      transform: down ? 'scale(var(--press-scale))' : 'none',
      opacity: disabled ? .45 : 1,
      ...look,
      ...style
    },
    ...rest
  }, loading ? React.createElement('span', {
    style: {
      width: 16,
      height: 16,
      borderRadius: '50%',
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      animation: 'trilu-spin .7s linear infinite'
    }
  }) : iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function Card({
  tone = 'default',
  padding = 'var(--gutter-card)',
  interactive = false,
  children,
  style,
  ...rest
}) {
  const tones = {
    default: {
      background: 'var(--surface-card)',
      boxShadow: 'var(--shadow-card)',
      border: 'none'
    },
    flat: {
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-subtle)',
      boxShadow: 'none'
    },
    sunken: {
      background: 'var(--surface-sunken)',
      border: 'none',
      boxShadow: 'none'
    },
    brand: {
      background: 'var(--violet-500)',
      color: 'var(--text-on-brand)',
      boxShadow: 'var(--shadow-brand)',
      border: 'none'
    },
    accent: {
      background: 'var(--coral-50)',
      border: 'none',
      boxShadow: 'none'
    },
    success: {
      background: 'var(--mint-50)',
      border: 'none',
      boxShadow: 'none'
    },
    celebrate: {
      background: 'var(--sun-50)',
      border: 'none',
      boxShadow: 'none'
    }
  };
  const [hov, setHov] = React.useState(false);
  return React.createElement('div', {
    onMouseEnter: () => interactive && setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      borderRadius: 'var(--radius-card)',
      padding,
      transition: 'transform var(--dur-base) var(--ease-standard),box-shadow var(--dur-base) var(--ease-standard)',
      cursor: interactive ? 'pointer' : 'default',
      transform: hov ? 'translateY(var(--hover-lift))' : 'none',
      ...(tones[tone] || tones.default),
      ...(hov ? {
        boxShadow: 'var(--shadow-raised)'
      } : null),
      ...style
    },
    ...rest
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
const dim = {
  sm: 36,
  md: 44,
  lg: 52
};
function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  onClick,
  disabled,
  style,
  ...rest
}) {
  const d = dim[size] || 44;
  const looks = {
    ghost: {
      background: 'transparent',
      color: 'var(--text-body)'
    },
    soft: {
      background: 'var(--violet-50)',
      color: 'var(--violet-600)'
    },
    solid: {
      background: 'var(--violet-500)',
      color: '#fff'
    },
    card: {
      background: 'var(--surface-card)',
      color: 'var(--text-title)',
      boxShadow: 'var(--shadow-sm)'
    }
  };
  const [down, setDown] = React.useState(false);
  return React.createElement('button', {
    type: 'button',
    'aria-label': label,
    onClick,
    disabled,
    onPointerDown: () => setDown(true),
    onPointerUp: () => setDown(false),
    onPointerLeave: () => setDown(false),
    style: {
      width: d,
      height: d,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      borderRadius: 'var(--radius-pill)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .45 : 1,
      transition: 'transform var(--dur-fast) var(--ease-standard)',
      transform: down ? 'scale(var(--press-scale))' : 'none',
      ...(looks[variant] || looks.ghost),
      ...style
    },
    ...rest
  }, icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function Tag({
  selected = false,
  onClick,
  children,
  style,
  ...rest
}) {
  return React.createElement('button', {
    type: 'button',
    onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      minHeight: 36,
      padding: '0 14px',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--weight-semibold)',
      fontSize: 'var(--text-caption)',
      transition: 'all var(--dur-fast) var(--ease-standard)',
      background: selected ? 'var(--violet-500)' : 'var(--surface-card)',
      color: selected ? '#fff' : 'var(--text-body)',
      border: selected ? 'var(--border-w-strong) solid var(--violet-500)' : 'var(--border-w-strong) solid var(--border-default)',
      ...style
    },
    ...rest
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  title,
  children,
  footer,
  onClose,
  style,
  ...rest
}) {
  if (!open) return null;
  return React.createElement('div', {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--scrim)',
      backdropFilter: 'var(--blur-sheet)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 50
    },
    onClick: onClose
  }, React.createElement('div', {
    role: 'dialog',
    'aria-modal': true,
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: 'var(--max-content)',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-sheet)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-overlay)',
      animation: 'trilu-rise var(--dur-base) var(--ease-out)',
      ...style
    },
    ...rest
  }, React.createElement('div', {
    style: {
      width: 40,
      height: 4,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--ink-200)',
      margin: '0 auto var(--space-5)'
    }
  }), title && React.createElement('h3', {
    style: {
      font: 'var(--type-title)',
      marginBottom: 'var(--space-3)'
    }
  }, title), React.createElement('div', {
    style: {
      color: 'var(--text-body)'
    }
  }, children), footer && React.createElement('div', {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-6)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
function ProgressBar({
  value = 0,
  max = 100,
  tone = 'violet',
  size = 'md',
  label,
  valueLabel,
  style,
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const fills = {
    violet: 'var(--violet-500)',
    coral: 'var(--coral-500)',
    mint: 'var(--mint-500)',
    sun: 'var(--sun-500)'
  };
  const h = size === 'lg' ? 'var(--track-w-lg)' : size === 'sm' ? '4px' : 'var(--track-w)';
  return React.createElement('div', {
    style: {
      width: '100%',
      ...style
    },
    ...rest
  }, (label || valueLabel) && React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-2)'
    }
  }, React.createElement('span', {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-muted)'
    }
  }, label), React.createElement('span', {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-title)'
    }
  }, valueLabel)), React.createElement('div', {
    role: 'progressbar',
    'aria-valuenow': value,
    'aria-valuemax': max,
    style: {
      height: h,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--journey-track)',
      overflow: 'hidden'
    }
  }, React.createElement('div', {
    style: {
      width: pct + '%',
      height: '100%',
      borderRadius: 'var(--radius-pill)',
      background: fills[tone] || fills.violet,
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  tone = 'success',
  title,
  message,
  icon,
  onClose,
  style,
  ...rest
}) {
  const t = {
    success: ['var(--mint-50)', 'var(--mint-700)'],
    celebrate: ['var(--sun-50)', 'var(--sun-800)'],
    info: ['var(--violet-50)', 'var(--violet-700)'],
    danger: ['var(--status-danger-soft)', 'var(--status-danger)']
  }[tone] || ['var(--mint-50)', 'var(--mint-700)'];
  return React.createElement('div', {
    role: 'status',
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
      background: t[0],
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      boxShadow: 'var(--shadow-raised)',
      animation: 'trilu-rise var(--dur-base) var(--ease-out)',
      maxWidth: 420,
      ...style
    },
    ...rest
  }, icon && React.createElement('span', {
    style: {
      color: t[1],
      display: 'flex'
    }
  }, icon), React.createElement('div', {
    style: {
      flex: 1
    }
  }, React.createElement('div', {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-bold)',
      color: t[1],
      fontSize: 'var(--text-body-md)'
    }
  }, title), message && React.createElement('div', {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-body)',
      marginTop: 2
    }
  }, message)), onClose && React.createElement('button', {
    onClick: onClose,
    'aria-label': 'Fechar',
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      fontSize: 18,
      lineHeight: 1
    }
  }, '×'));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  content,
  placement = 'top',
  children,
  style,
  ...rest
}) {
  const [show, setShow] = React.useState(false);
  const pos = placement === 'bottom' ? {
    top: 'calc(100% + 8px)'
  } : {
    bottom: 'calc(100% + 8px)'
  };
  return React.createElement('span', {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    ...rest
  }, children, show && React.createElement('span', {
    role: 'tooltip',
    style: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--surface-inverse)',
      color: 'var(--text-on-inverse)',
      padding: '6px 10px',
      borderRadius: 'var(--radius-xs)',
      fontSize: 'var(--text-caption-sm)',
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-raised)',
      zIndex: 20,
      animation: 'trilu-rise var(--dur-fast) var(--ease-out)',
      ...pos,
      ...style
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  onChange,
  disabled,
  style,
  ...rest
}) {
  return React.createElement('label', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      minHeight: 'var(--tap-min)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .45 : 1,
      ...style
    }
  }, React.createElement('input', {
    type: 'checkbox',
    checked,
    onChange,
    disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    },
    ...rest
  }), React.createElement('span', {
    style: {
      width: 24,
      height: 24,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-xs)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: checked ? 'var(--mint-500)' : 'var(--surface-card)',
      border: 'var(--border-w-strong) solid ' + (checked ? 'var(--mint-500)' : 'var(--border-strong)'),
      transition: 'all var(--dur-fast) var(--ease-bounce)'
    }
  }, checked && React.createElement('svg', {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#fff',
    strokeWidth: 3.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }, React.createElement('polyline', {
    points: '20 6 9 17 4 12'
  }))), label && React.createElement('span', {
    style: {
      fontSize: 'var(--text-body-md)',
      color: 'var(--text-title)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
const shell = {
  width: '100%',
  minHeight: 'var(--control-h-md)',
  padding: '0 16px',
  borderRadius: 'var(--radius-md)',
  background: 'var(--surface-card)',
  border: 'var(--border-w-strong) solid var(--border-default)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body-md)',
  color: 'var(--text-title)',
  outline: 'none',
  transition: 'border-color var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard)'
};
function Input({
  label,
  hint,
  error,
  suffix,
  prefix,
  id,
  style,
  ...rest
}) {
  const [foc, setFoc] = React.useState(false);
  const rid = id || React.useId();
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      width: '100%'
    }
  }, label && React.createElement('label', {
    htmlFor: rid,
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-muted)'
    }
  }, label), React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      ...shell,
      borderColor: error ? 'var(--status-danger)' : foc ? 'var(--border-focus)' : 'var(--border-default)',
      boxShadow: foc ? error ? 'var(--ring-danger)' : 'var(--ring-focus)' : 'none',
      ...style
    }
  }, prefix, React.createElement('input', {
    id: rid,
    onFocus: () => setFoc(true),
    onBlur: () => setFoc(false),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: 'inherit',
      color: 'inherit',
      minWidth: 0,
      padding: '10px 0'
    },
    ...rest
  }), suffix), (hint || error) && React.createElement('span', {
    style: {
      fontSize: 'var(--text-caption-sm)',
      color: error ? 'var(--status-danger)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  label,
  description,
  checked,
  onChange,
  name,
  value,
  style,
  ...rest
}) {
  return React.createElement('label', {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
      padding: 'var(--space-4)',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      background: checked ? 'var(--violet-50)' : 'var(--surface-card)',
      border: 'var(--border-w-strong) solid ' + (checked ? 'var(--violet-500)' : 'var(--border-default)'),
      transition: 'all var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, React.createElement('input', {
    type: 'radio',
    name,
    value,
    checked,
    onChange,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    },
    ...rest
  }), React.createElement('span', {
    style: {
      width: 22,
      height: 22,
      flex: '0 0 auto',
      marginTop: 1,
      borderRadius: 'var(--radius-pill)',
      border: 'var(--border-w-strong) solid ' + (checked ? 'var(--violet-500)' : 'var(--border-strong)'),
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, checked && React.createElement('span', {
    style: {
      width: 10,
      height: 10,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--violet-500)'
    }
  })), React.createElement('span', null, React.createElement('span', {
    style: {
      display: 'block',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--text-title)'
    }
  }, label), description && React.createElement('span', {
    style: {
      display: 'block',
      fontSize: 'var(--text-caption)',
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, description)));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  hint,
  options = [],
  id,
  style,
  ...rest
}) {
  const [foc, setFoc] = React.useState(false);
  const rid = id || React.useId();
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      width: '100%'
    }
  }, label && React.createElement('label', {
    htmlFor: rid,
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-muted)'
    }
  }, label), React.createElement('select', {
    id: rid,
    onFocus: () => setFoc(true),
    onBlur: () => setFoc(false),
    style: {
      width: '100%',
      minHeight: 'var(--control-h-md)',
      padding: '0 40px 0 16px',
      borderRadius: 'var(--radius-md)',
      appearance: 'none',
      background: "var(--surface-card) url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236C7A9C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\") no-repeat right 14px center",
      border: 'var(--border-w-strong) solid ' + (foc ? 'var(--border-focus)' : 'var(--border-default)'),
      boxShadow: foc ? 'var(--ring-focus)' : 'none',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-body-md)',
      color: 'var(--text-title)',
      outline: 'none',
      cursor: 'pointer',
      ...style
    },
    ...rest
  }, options.map(o => React.createElement('option', {
    key: o.value,
    value: o.value
  }, o.label))), hint && React.createElement('span', {
    style: {
      fontSize: 'var(--text-caption-sm)',
      color: 'var(--text-muted)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked,
  onChange,
  label,
  disabled,
  style,
  ...rest
}) {
  return React.createElement('label', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      minHeight: 'var(--tap-min)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .45 : 1,
      ...style
    }
  }, React.createElement('input', {
    type: 'checkbox',
    role: 'switch',
    checked,
    onChange,
    disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    },
    ...rest
  }), React.createElement('span', {
    style: {
      width: 52,
      height: 32,
      borderRadius: 'var(--radius-pill)',
      padding: 3,
      flex: '0 0 auto',
      background: checked ? 'var(--violet-500)' : 'var(--ink-200)',
      transition: 'background var(--dur-base) var(--ease-standard)'
    }
  }, React.createElement('span', {
    style: {
      display: 'block',
      width: 26,
      height: 26,
      borderRadius: 'var(--radius-pill)',
      background: '#fff',
      boxShadow: 'var(--shadow-xs)',
      transform: 'translateX(' + (checked ? 20 : 0) + 'px)',
      transition: 'transform var(--dur-base) var(--ease-bounce)'
    }
  })), label && React.createElement('span', {
    style: {
      fontSize: 'var(--text-body-md)',
      color: 'var(--text-title)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/journey/ExerciseRow.jsx
try { (() => {
function ExerciseRow({
  name,
  detail,
  setsDone = 0,
  setsTotal = 0,
  done = false,
  onClick,
  right,
  style,
  ...rest
}) {
  return React.createElement('div', {
    onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      cursor: onClick ? 'pointer' : 'default',
      boxShadow: 'var(--shadow-sm)',
      opacity: done ? .72 : 1,
      transition: 'all var(--dur-fast) var(--ease-standard)',
      ...style
    },
    ...rest
  }, React.createElement('div', {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-sm)',
      flex: '0 0 auto',
      background: done ? 'var(--mint-50)' : 'var(--violet-50)',
      color: done ? 'var(--mint-600)' : 'var(--violet-600)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'var(--weight-bold)',
      fontSize: 15
    }
  }, done ? '✓' : setsDone + '/' + setsTotal), React.createElement('div', {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement('div', {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--text-title)',
      fontSize: 'var(--text-body-md)',
      textDecoration: done ? 'line-through' : 'none'
    }
  }, name), detail && React.createElement('div', {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, detail)), right);
}
Object.assign(__ds_scope, { ExerciseRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/journey/ExerciseRow.jsx", error: String((e && e.message) || e) }); }

// components/journey/MascotBubble.jsx
try { (() => {
function MascotBubble({
  message,
  mascotSrc = 'assets/mascot-tilu.png',
  size = 72,
  align = 'left',
  children,
  style,
  ...rest
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 'var(--space-3)',
      flexDirection: align === 'right' ? 'row-reverse' : 'row',
      ...style
    },
    ...rest
  }, React.createElement('img', {
    src: mascotSrc,
    alt: 'Tilu',
    style: {
      width: size,
      height: size,
      objectFit: 'contain',
      flex: '0 0 auto'
    }
  }), React.createElement('div', {
    style: {
      position: 'relative',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)',
      boxShadow: 'var(--shadow-card)',
      maxWidth: 320,
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-semibold)',
      fontSize: 'var(--text-body-md)',
      color: 'var(--text-title)',
      lineHeight: 'var(--leading-snug)'
    }
  }, message || children));
}
Object.assign(__ds_scope, { MascotBubble });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/journey/MascotBubble.jsx", error: String((e && e.message) || e) }); }

// components/journey/MilestoneChip.jsx
try { (() => {
function MilestoneChip({
  label,
  caption,
  state = 'locked',
  icon,
  style,
  ...rest
}) {
  const map = {
    done: ['var(--mint-50)', 'var(--mint-600)', 'var(--mint-700)'],
    current: ['var(--coral-50)', 'var(--coral-500)', 'var(--coral-700)'],
    goal: ['var(--sun-50)', 'var(--sun-500)', 'var(--sun-800)'],
    locked: ['var(--ink-100)', 'var(--ink-300)', 'var(--text-muted)']
  }[state];
  return React.createElement('div', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      background: map[0],
      borderRadius: 'var(--radius-pill)',
      padding: '8px 16px 8px 8px',
      ...style
    },
    ...rest
  }, React.createElement('span', {
    style: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-pill)',
      background: map[1],
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 'var(--weight-bold)',
      fontSize: 14
    }
  }, icon || (state === 'done' ? '✓' : '')), React.createElement('span', null, React.createElement('span', {
    style: {
      display: 'block',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-body-sm)',
      color: map[2]
    }
  }, label), caption && React.createElement('span', {
    style: {
      display: 'block',
      fontSize: 'var(--text-caption-sm)',
      color: 'var(--text-muted)'
    }
  }, caption)));
}
Object.assign(__ds_scope, { MilestoneChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/journey/MilestoneChip.jsx", error: String((e && e.message) || e) }); }

// components/journey/StatTile.jsx
try { (() => {
function StatTile({
  value,
  unit,
  label,
  tone = 'violet',
  icon,
  style,
  ...rest
}) {
  const c = {
    violet: 'var(--violet-600)',
    coral: 'var(--coral-600)',
    mint: 'var(--mint-700)',
    sun: 'var(--sun-800)',
    ink: 'var(--text-title)'
  }[tone] || 'var(--violet-600)';
  return React.createElement('div', {
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      ...style
    },
    ...rest
  }, icon && React.createElement('span', {
    style: {
      color: c,
      marginBottom: 4,
      display: 'flex'
    }
  }, icon), React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 4
    }
  }, React.createElement('span', {
    style: {
      fontFamily: 'var(--font-numeric)',
      fontWeight: 'var(--weight-extrabold)',
      fontSize: 'var(--text-title-lg)',
      color: c,
      lineHeight: 1
    }
  }, value), unit && React.createElement('span', {
    style: {
      fontSize: 'var(--text-caption)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--text-muted)'
    }
  }, unit)), React.createElement('span', {
    style: {
      fontSize: 'var(--text-caption-sm)',
      color: 'var(--text-muted)'
    }
  }, label));
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/journey/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/journey/StreakRow.jsx
try { (() => {
function StreakRow({
  days = [],
  labels = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
  style,
  ...rest
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      ...style
    },
    ...rest
  }, days.map((d, i) => {
    const bg = d === 'done' ? 'var(--mint-500)' : d === 'today' ? 'var(--coral-500)' : d === 'rest' ? 'var(--violet-100)' : 'var(--surface-sunken)';
    const fg = d === 'done' || d === 'today' ? '#fff' : 'var(--text-subtle)';
    return React.createElement('div', {
      key: i,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6
      }
    }, React.createElement('div', {
      style: {
        width: '100%',
        aspectRatio: '1',
        maxWidth: 40,
        borderRadius: 'var(--radius-sm)',
        background: bg,
        color: fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'var(--weight-bold)',
        fontSize: 14,
        border: d === 'today' ? 'none' : 'none',
        animation: d === 'today' ? 'trilu-pop var(--dur-base) var(--ease-bounce)' : 'none'
      }
    }, d === 'done' ? '✓' : ''), React.createElement('span', {
      style: {
        fontSize: 'var(--text-micro)',
        color: 'var(--text-subtle)',
        fontWeight: 'var(--weight-bold)'
      }
    }, labels[i]));
  }));
}
Object.assign(__ds_scope, { StreakRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/journey/StreakRow.jsx", error: String((e && e.message) || e) }); }

// components/journey/TrailPath.jsx
try { (() => {
/** Organic left-right winding trail. Nodes are laid out along a smooth cubic path. */
function TrailPath({
  milestones = [],
  currentIndex = 0,
  avatarSrc,
  width = 320,
  orientation = 'horizontal',
  style,
  ...rest
}) {
  const n = Math.max(milestones.length, 2);
  const LABEL_BAND = 34;
  const H = orientation === 'vertical' ? Math.max(220, n * 104) : 160;
  const W = width;
  const midY = (H - LABEL_BAND) / 2;
  const amp = (H - LABEL_BAND) * 0.26;
  const pts = milestones.map((m, i) => {
    const t = n === 1 ? 0 : i / (n - 1);
    if (orientation === 'vertical') return {
      x: W * (i % 2 ? 0.68 : 0.32),
      y: 36 + t * (H - 72)
    };
    return {
      x: 34 + t * (W - 68),
      y: midY + (i % 2 ? amp : -amp)
    };
  });
  const d = pts.reduce((acc, p, i) => {
    if (i === 0) return 'M ' + p.x + ' ' + p.y;
    const q = pts[i - 1];
    return orientation === 'vertical' ? acc + ' C ' + q.x + ' ' + (q.y + (p.y - q.y) * 0.55) + ', ' + p.x + ' ' + (p.y - (p.y - q.y) * 0.55) + ', ' + p.x + ' ' + p.y : acc + ' C ' + (q.x + (p.x - q.x) * 0.5) + ' ' + q.y + ', ' + (q.x + (p.x - q.x) * 0.5) + ' ' + p.y + ', ' + p.x + ' ' + p.y;
  }, '');
  const doneLen = currentIndex / (n - 1 || 1);
  const colorFor = i => i < currentIndex ? 'var(--journey-done)' : i === currentIndex ? 'var(--journey-current)' : i === n - 1 ? 'var(--journey-goal)' : 'var(--journey-locked)';
  return React.createElement('div', {
    style: {
      position: 'relative',
      width: W,
      height: H,
      ...style
    },
    ...rest
  }, React.createElement('svg', {
    width: W,
    height: H,
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'visible'
    }
  }, React.createElement('path', {
    d,
    fill: 'none',
    stroke: 'var(--journey-track)',
    strokeWidth: 'var(--track-w-lg)',
    strokeLinecap: 'round',
    strokeDasharray: '2 16'
  }), React.createElement('path', {
    d,
    fill: 'none',
    stroke: 'var(--journey-done)',
    strokeWidth: 'var(--track-w-lg)',
    strokeLinecap: 'round',
    pathLength: 1,
    strokeDasharray: '1 1',
    strokeDashoffset: 1 - doneLen,
    style: {
      transition: 'stroke-dashoffset var(--dur-slow) var(--ease-out)'
    }
  })), milestones.map((m, i) => {
    const p = pts[i],
      cur = i === currentIndex,
      size = cur ? 44 : i === n - 1 ? 38 : 28;
    return React.createElement('div', {
      key: i,
      style: {
        position: 'absolute',
        left: p.x,
        top: p.y,
        transform: 'translate(-50%,-50%)',
        textAlign: 'center'
      }
    }, React.createElement('div', {
      style: {
        width: size,
        height: size,
        borderRadius: 'var(--radius-pill)',
        background: colorFor(i),
        border: '3px solid var(--surface-card)',
        boxShadow: cur ? 'var(--shadow-coral)' : 'var(--shadow-xs)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--weight-bold)',
        fontSize: 13,
        animation: cur ? 'trilu-pulse 2.4s var(--ease-standard) infinite' : 'none',
        overflow: 'hidden'
      }
    }, cur && avatarSrc ? React.createElement('img', {
      src: avatarSrc,
      alt: '',
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
      }
    }) : m.icon || (i < currentIndex ? '✓' : '')), m.label && React.createElement('div', {
      style: {
        position: 'absolute',
        left: '50%',
        top: size + 6,
        transform: 'translateX(-50%)',
        font: 'var(--type-label)',
        fontSize: 11,
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        color: cur ? 'var(--text-accent)' : 'var(--text-muted)',
        whiteSpace: 'nowrap',
        background: 'var(--surface-card)',
        padding: '0 3px',
        borderRadius: 4
      }
    }, m.label));
  }));
}
Object.assign(__ds_scope, { TrailPath });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/journey/TrailPath.jsx", error: String((e && e.message) || e) }); }

// components/navigation/AppHeader.jsx
try { (() => {
function AppHeader({
  title,
  subtitle,
  left,
  right,
  tone = 'plain',
  style,
  ...rest
}) {
  const tones = {
    plain: {
      background: 'transparent',
      color: 'var(--text-title)'
    },
    brand: {
      background: 'var(--violet-500)',
      color: '#fff'
    }
  };
  return React.createElement('header', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-4) var(--gutter-screen)',
      ...(tones[tone] || tones.plain),
      ...style
    },
    ...rest
  }, left, React.createElement('div', {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement('div', {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-title)',
      letterSpacing: 'var(--tracking-tight)'
    }
  }, title), subtitle && React.createElement('div', {
    style: {
      fontSize: 'var(--text-caption)',
      opacity: .75,
      marginTop: 2
    }
  }, subtitle)), right);
}
Object.assign(__ds_scope, { AppHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/AppHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
function TabBar({
  items = [],
  value,
  onChange,
  style,
  ...rest
}) {
  return React.createElement('nav', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      background: 'var(--surface-card)',
      borderTop: 'var(--border-w) solid var(--border-subtle)',
      padding: '8px 8px calc(8px + env(safe-area-inset-bottom))',
      ...style
    },
    ...rest
  }, items.map(it => {
    const on = it.value === value;
    return React.createElement('button', {
      key: it.value,
      onClick: () => onChange && onChange(it.value),
      style: {
        flex: 1,
        minHeight: 'var(--tap-min)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: on ? 'var(--violet-600)' : 'var(--text-subtle)',
        transition: 'color var(--dur-fast) var(--ease-standard)'
      }
    }, it.icon, React.createElement('span', {
      style: {
        fontSize: 'var(--text-micro)',
        fontFamily: 'var(--font-body)',
        fontWeight: on ? 'var(--weight-bold)' : 'var(--weight-semibold)'
      }
    }, it.label));
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  onChange,
  style,
  ...rest
}) {
  return React.createElement('div', {
    role: 'tablist',
    style: {
      display: 'inline-flex',
      gap: 4,
      padding: 4,
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-pill)',
      ...style
    },
    ...rest
  }, items.map(it => {
    const on = it.value === value;
    return React.createElement('button', {
      key: it.value,
      role: 'tab',
      'aria-selected': on,
      onClick: () => onChange && onChange(it.value),
      style: {
        border: 'none',
        cursor: 'pointer',
        padding: '0 18px',
        minHeight: 36,
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-body)',
        fontWeight: 'var(--weight-bold)',
        fontSize: 'var(--text-caption)',
        background: on ? 'var(--surface-card)' : 'transparent',
        color: on ? 'var(--text-title)' : 'var(--text-muted)',
        boxShadow: on ? 'var(--shadow-xs)' : 'none',
        transition: 'all var(--dur-fast) var(--ease-standard)'
      }
    }, it.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/trilu-app/App.jsx
try { (() => {
function App() {
  const [onboarded, setOnboarded] = React.useState(false);
  const [tab, setTab] = React.useState('home');
  const inner = !onboarded ? /*#__PURE__*/React.createElement(OnboardingScreen, {
    onDone: () => setOnboarded(true)
  }) : tab === 'home' ? /*#__PURE__*/React.createElement(HomeScreen, {
    onStart: () => setTab('treino')
  }) : tab === 'treino' ? /*#__PURE__*/React.createElement(WorkoutScreen, {
    onBack: () => setTab('home'),
    onFinish: () => setTab('home')
  }) : tab === 'amigos' ? /*#__PURE__*/React.createElement(FriendsScreen, null) : /*#__PURE__*/React.createElement(ProfileScreen, {
    onRestart: () => setOnboarded(false)
  });
  return /*#__PURE__*/React.createElement(PhoneFrame, {
    tab: tab,
    onTab: setTab,
    showNav: onboarded
  }, inner);
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/trilu-app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/trilu-app/FriendsScreen.jsx
try { (() => {
const {
  AppHeader,
  Card,
  Avatar,
  Badge,
  Tabs,
  MilestoneChip,
  Button,
  IconButton
} = window.TriluDesignSystem_9e1798;
function FriendsScreen() {
  const [tab, setTab] = React.useState('companheiros');
  const people = [{
    n: 'Ana Lima',
    s: 'Treinou hoje • 9 dias seguidos',
    r: 'var(--trilu-mint)'
  }, {
    n: 'Bruno Sá',
    s: 'Marco de 30 dias alcançado',
    r: 'var(--trilu-sun)'
  }, {
    n: 'Carla Reis',
    s: 'Voltou depois de uma pausa',
    r: 'var(--trilu-coral)'
  }, {
    n: 'Diego Alves',
    s: 'Treinou ontem • 4 dias seguidos'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 20
    }
  }, /*#__PURE__*/React.createElement(AppHeader, {
    title: "Companheiros",
    subtitle: "Gente que caminha junto",
    right: /*#__PURE__*/React.createElement(IconButton, {
      variant: "soft",
      label: "Convidar",
      icon: /*#__PURE__*/React.createElement(Ico, {
        n: "UserPlus",
        s: 20
      })
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--gutter-screen)',
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    items: [{
      value: 'companheiros',
      label: 'Companheiros'
    }, {
      value: 'marcos',
      label: 'Marcos'
    }]
  }), tab === 'companheiros' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, people.map((p, i) => /*#__PURE__*/React.createElement(Card, {
    key: i,
    padding: "14px",
    interactive: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: p.n,
    size: "md",
    ring: p.r
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      color: 'var(--text-title)'
    }
  }, p.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, p.s)), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "Cutucar"))))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(MilestoneChip, {
    state: "done",
    label: "Ana chegou aos 7 dias",
    caption: "h\xE1 2 dias",
    style: {
      width: '100%'
    }
  }), /*#__PURE__*/React.createElement(MilestoneChip, {
    state: "done",
    label: "Bruno bateu o recorde no agachamento",
    caption: "h\xE1 4 dias",
    style: {
      width: '100%'
    }
  }), /*#__PURE__*/React.createElement(MilestoneChip, {
    state: "current",
    label: "Voc\xEA: faltam 2 passos",
    caption: "Marco de 7 dias",
    style: {
      width: '100%'
    }
  }), /*#__PURE__*/React.createElement(MilestoneChip, {
    state: "locked",
    label: "Marco de 30 dias",
    caption: "a caminho",
    style: {
      width: '100%'
    }
  })), /*#__PURE__*/React.createElement(Card, {
    tone: "celebrate",
    padding: "16px"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "sun"
  }, "Companhia, n\xE3o competi\xE7\xE3o"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: 14,
      color: 'var(--text-body)',
      lineHeight: 1.6
    }
  }, "Amigos aparecem como companheiros de trilha. N\xE3o existe ranking nem placar no Trilu."))));
}
window.FriendsScreen = FriendsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/trilu-app/FriendsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/trilu-app/HomeScreen.jsx
try { (() => {
const {
  AppHeader,
  Avatar,
  Card,
  Button,
  Badge,
  TrailPath,
  StreakRow,
  StatTile,
  ProgressBar,
  IconButton
} = window.TriluDesignSystem_9e1798;
function HomeScreen({
  onStart
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 20
    }
  }, /*#__PURE__*/React.createElement(AppHeader, {
    title: "Ol\xE1, Paulo!",
    subtitle: "Faltam 2 passos para o marco",
    right: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      variant: "ghost",
      label: "Notifica\xE7\xF5es",
      icon: /*#__PURE__*/React.createElement(Ico, {
        n: "Bell",
        s: 22
      })
    }), /*#__PURE__*/React.createElement(Avatar, {
      name: "Paulo Reis",
      size: "sm",
      ring: "var(--trilu-mint)"
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--gutter-screen)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "16px 12px 8px"
  }, /*#__PURE__*/React.createElement(TrailPath, {
    width: 318,
    currentIndex: 2,
    avatarSrc: "../../assets/mascot-tilu.png",
    milestones: [{
      label: 'Início'
    }, {
      label: '7 dias'
    }, {
      label: 'Recorde'
    }, {
      label: '30 dias'
    }, {
      label: 'Meta'
    }]
  })), /*#__PURE__*/React.createElement(Card, {
    tone: "accent",
    padding: "18px"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "coral"
  }, "Miss\xE3o de hoje"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 24,
      color: 'var(--text-title)',
      margin: '10px 0 4px'
    }
  }, "Treino A \u2022 Peito"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-body)',
      marginBottom: 16
    }
  }, "5 exerc\xEDcios \u2022 cerca de 42 min"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    block: true,
    onClick: onStart,
    iconLeft: /*#__PURE__*/React.createElement(Ico, {
      n: "Play",
      s: 18
    })
  }, "COME\xC7AR TREINO")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 12
    }
  }, "Sua semana"), /*#__PURE__*/React.createElement(StreakRow, {
    days: ['done', 'done', 'rest', 'done', 'today', 'empty', 'empty']
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    value: "12",
    unit: "dias",
    label: "Sequ\xEAncia",
    tone: "mint",
    icon: /*#__PURE__*/React.createElement(Ico, {
      n: "Flame",
      s: 20
    })
  }), /*#__PURE__*/React.createElement(StatTile, {
    value: "32",
    unit: "kg",
    label: "Recorde no supino",
    tone: "coral",
    icon: /*#__PURE__*/React.createElement(Ico, {
      n: "Trophy",
      s: 20
    })
  })), /*#__PURE__*/React.createElement(Card, {
    tone: "flat"
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    value: 3,
    max: 4,
    tone: "coral",
    label: "Marco de 7 dias",
    valueLabel: "3 de 4 passos"
  }))));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/trilu-app/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/trilu-app/OnboardingScreen.jsx
try { (() => {
const {
  Button,
  Radio,
  MascotBubble,
  Badge
} = window.TriluDesignSystem_9e1798;
function OnboardingScreen({
  onDone
}) {
  const [step, setStep] = React.useState(0);
  const [goal, setGoal] = React.useState('rotina');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px var(--gutter-screen) 28px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo.svg",
    alt: "Trilu",
    style: {
      height: 30,
      alignSelf: 'flex-start'
    }
  }), step === 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/mascot-tilu.png",
    alt: "Tilu",
    style: {
      width: 220
    }
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 32,
      lineHeight: 1.15
    }
  }, "Seu objetivo vira caminho."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--text-body)',
      fontSize: 16,
      lineHeight: 1.65
    }
  }, "Oi, eu sou o Tilu. Vou te acompanhar em cada passo \u2014 no seu ritmo, sem cobran\xE7a."), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    block: true,
    onClick: () => setStep(1)
  }, "Come\xE7ar"), /*#__PURE__*/React.createElement("button", {
    style: {
      border: 'none',
      background: 'none',
      color: 'var(--text-muted)',
      fontSize: 14,
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "J\xE1 tenho conta")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Badge, {
    tone: "violet"
  }, "Passo 2 de 2"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 26,
      lineHeight: 1.2
    }
  }, "Qual \xE9 o seu pr\xF3ximo objetivo?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Radio, {
    name: "goal",
    label: "Voltar \xE0 rotina",
    description: "2 treinos por semana",
    checked: goal === 'rotina',
    onChange: () => setGoal('rotina')
  }), /*#__PURE__*/React.createElement(Radio, {
    name: "goal",
    label: "Ganhar for\xE7a",
    description: "4 treinos por semana",
    checked: goal === 'forca',
    onChange: () => setGoal('forca')
  }), /*#__PURE__*/React.createElement(Radio, {
    name: "goal",
    label: "Competir comigo mesmo",
    description: "5 treinos por semana",
    checked: goal === 'comp',
    onChange: () => setGoal('comp')
  })), /*#__PURE__*/React.createElement(MascotBubble, {
    mascotSrc: "../../assets/mascot-tilu.png",
    size: 64,
    message: "D\xE1 pra mudar depois. Comece pelo que cabe hoje."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    block: true,
    onClick: onDone
  }, "Montar minha trilha")));
}
window.OnboardingScreen = OnboardingScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/trilu-app/OnboardingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/trilu-app/PhoneFrame.jsx
try { (() => {
const {
  TabBar
} = window.TriluDesignSystem_9e1798;
function Ico({
  n,
  s = 22
}) {
  const r = React.useRef(null);
  React.useEffect(() => {
    const d = window.lucide.icons[n];
    if (d && r.current) {
      const el = window.lucide.createElement(d);
      el.setAttribute('width', s);
      el.setAttribute('height', s);
      r.current.innerHTML = el.outerHTML;
    }
  }, [n, s]);
  return /*#__PURE__*/React.createElement("span", {
    ref: r,
    style: {
      display: 'inline-flex'
    }
  });
}
const NAV = [{
  value: 'home',
  label: 'Trilha',
  icon: /*#__PURE__*/React.createElement(Ico, {
    n: "Route"
  })
}, {
  value: 'treino',
  label: 'Treino',
  icon: /*#__PURE__*/React.createElement(Ico, {
    n: "Dumbbell"
  })
}, {
  value: 'amigos',
  label: 'Amigos',
  icon: /*#__PURE__*/React.createElement(Ico, {
    n: "Users"
  })
}, {
  value: 'perfil',
  label: 'Perfil',
  icon: /*#__PURE__*/React.createElement(Ico, {
    n: "User"
  })
}];
function PhoneFrame({
  children,
  tab,
  onTab,
  showNav = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 390,
      height: 844,
      background: 'var(--surface-app)',
      borderRadius: 44,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-overlay)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      border: '8px solid #10182C'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 26px',
      fontSize: 13,
      fontWeight: 800,
      color: 'var(--text-title)',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 5,
      opacity: .8
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "Signal",
    s: 15
  }), /*#__PURE__*/React.createElement(Ico, {
    n: "Wifi",
    s: 15
  }), /*#__PURE__*/React.createElement(Ico, {
    n: "BatteryFull",
    s: 15
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden'
    }
  }, children), showNav && /*#__PURE__*/React.createElement(TabBar, {
    value: tab,
    onChange: onTab,
    items: NAV,
    style: {
      flex: '0 0 auto'
    }
  }));
}
Object.assign(window, {
  PhoneFrame,
  Ico
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/trilu-app/PhoneFrame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/trilu-app/ProfileScreen.jsx
try { (() => {
const {
  AppHeader,
  Card,
  Avatar,
  StatTile,
  Switch,
  Checkbox,
  Select,
  Button,
  MilestoneChip
} = window.TriluDesignSystem_9e1798;
function ProfileScreen({
  onRestart
}) {
  const [rem, setRem] = React.useState(true);
  const [soc, setSoc] = React.useState(true);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 20
    }
  }, /*#__PURE__*/React.createElement(AppHeader, {
    title: "Perfil"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--gutter-screen)',
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "20px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Paulo Reis",
    size: "lg",
    ring: "var(--trilu-mint)"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 20,
      color: 'var(--text-title)'
    }
  }, "Paulo Reis"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "Objetivo: voltar \xE0 rotina \u2022 desde mai 2026")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    value: "48",
    label: "Treinos",
    tone: "violet"
  }), /*#__PURE__*/React.createElement(StatTile, {
    value: "12",
    label: "Sequ\xEAncia",
    tone: "mint"
  }), /*#__PURE__*/React.createElement(StatTile, {
    value: "3",
    label: "Marcos",
    tone: "sun"
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 12
    }
  }, "H\xE1bitos de hoje"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "Beber 2 L de \xE1gua",
    checked: true,
    onChange: () => {}
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Alongar 5 min"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Dormir 7 h"
  }))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 12
    }
  }, "Ajustes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    label: "Lembrete di\xE1rio",
    checked: rem,
    onChange: e => setRem(e.target.checked)
  }), /*#__PURE__*/React.createElement(Switch, {
    label: "Mostrar meus marcos aos companheiros",
    checked: soc,
    onChange: e => setSoc(e.target.checked)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Objetivo",
    options: [{
      value: 'a',
      label: 'Voltar à rotina'
    }, {
      value: 'b',
      label: 'Ganhar força'
    }, {
      value: 'c',
      label: 'Competir comigo mesmo'
    }]
  })))), /*#__PURE__*/React.createElement(MilestoneChip, {
    state: "goal",
    label: "Meta de 30 dias",
    caption: "faltam 18 dias",
    style: {
      width: '100%'
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    block: true,
    onClick: onRestart
  }, "Rever a introdu\xE7\xE3o")));
}
window.ProfileScreen = ProfileScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/trilu-app/ProfileScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/trilu-app/WorkoutScreen.jsx
try { (() => {
const {
  AppHeader,
  IconButton,
  Card,
  Button,
  ExerciseRow,
  ProgressBar,
  Toast,
  Dialog,
  MascotBubble
} = window.TriluDesignSystem_9e1798;
function WorkoutScreen({
  onBack,
  onFinish
}) {
  const list = [{
    n: 'Supino reto',
    d: '3 séries de 10 • 32 kg',
    t: 3
  }, {
    n: 'Supino inclinado',
    d: '3 séries de 10 • 26 kg',
    t: 3
  }, {
    n: 'Crucifixo',
    d: '3 séries de 12 • 14 kg',
    t: 3
  }, {
    n: 'Crossover',
    d: '3 séries de 15 • 12 kg',
    t: 3
  }, {
    n: 'Tríceps corda',
    d: '4 séries de 12 • 20 kg',
    t: 4
  }];
  const [done, setDone] = React.useState([true, false, false, false, false]);
  const [toast, setToast] = React.useState(false);
  const [ask, setAsk] = React.useState(false);
  const count = done.filter(Boolean).length;
  const toggle = i => {
    const c = [...done];
    c[i] = !c[i];
    setDone(c);
    if (c[i]) {
      setToast(true);
      setTimeout(() => setToast(false), 1800);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      minHeight: '100%',
      paddingBottom: 20
    }
  }, /*#__PURE__*/React.createElement(AppHeader, {
    title: "Treino A \u2022 Peito",
    subtitle: "42 min estimados",
    left: /*#__PURE__*/React.createElement(IconButton, {
      label: "Voltar",
      icon: /*#__PURE__*/React.createElement(Ico, {
        n: "ChevronLeft",
        s: 22
      }),
      onClick: onBack
    }),
    right: /*#__PURE__*/React.createElement(IconButton, {
      label: "Mais",
      icon: /*#__PURE__*/React.createElement(Ico, {
        n: "MoreHorizontal",
        s: 22
      })
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--gutter-screen)',
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Card, {
    tone: "brand",
    padding: "18px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: '.08em',
      opacity: .8,
      marginBottom: 8
    }
  }, "PROGRESSO DO TREINO"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-numeric)',
      fontWeight: 800,
      fontSize: 36,
      lineHeight: 1
    }
  }, count), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .8,
      fontWeight: 700
    }
  }, "de ", list.length, " exerc\xEDcios")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 10,
      borderRadius: 99,
      background: 'rgba(255,255,255,.25)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: count / list.length * 100 + '%',
      height: '100%',
      borderRadius: 99,
      background: 'var(--trilu-mint)',
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, list.map((e, i) => /*#__PURE__*/React.createElement(ExerciseRow, {
    key: i,
    name: e.n,
    detail: e.d,
    setsDone: done[i] ? e.t : 0,
    setsTotal: e.t,
    done: done[i],
    onClick: () => toggle(i),
    right: /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-subtle)',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      n: "ChevronRight",
      s: 20
    }))
  }))), /*#__PURE__*/React.createElement(MascotBubble, {
    mascotSrc: "../../assets/mascot-tilu.png",
    size: 60,
    message: "Hoje conta, mesmo que seja mais leve."
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "success",
    size: "lg",
    block: true,
    onClick: () => setAsk(true)
  }, "Concluir treino")), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 16,
      right: 16,
      top: 70,
      zIndex: 40
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    tone: "celebrate",
    title: "Boa! Mais um exerc\xEDcio conclu\xEDdo.",
    icon: /*#__PURE__*/React.createElement(Ico, {
      n: "PartyPopper",
      s: 20
    })
  })), /*#__PURE__*/React.createElement(Dialog, {
    open: ask,
    title: "Concluir treino?",
    onClose: () => setAsk(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      block: true,
      onClick: () => setAsk(false)
    }, "Voltar"), /*#__PURE__*/React.createElement(Button, {
      variant: "success",
      block: true,
      onClick: () => {
        setAsk(false);
        onFinish && onFinish();
      }
    }, "Concluir"))
  }, "Voc\xEA avan\xE7ou ", count, " de ", list.length, " exerc\xEDcios. Sua jornada continua daqui."));
}
window.WorkoutScreen = WorkoutScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/trilu-app/WorkoutScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.ExerciseRow = __ds_scope.ExerciseRow;

__ds_ns.MascotBubble = __ds_scope.MascotBubble;

__ds_ns.MilestoneChip = __ds_scope.MilestoneChip;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.StreakRow = __ds_scope.StreakRow;

__ds_ns.TrailPath = __ds_scope.TrailPath;

__ds_ns.AppHeader = __ds_scope.AppHeader;

__ds_ns.TabBar = __ds_scope.TabBar;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
