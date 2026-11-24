import React, { useState, useEffect } from 'react';
import {
  Palette,
  User,
  Bell,
  Check,
  RotateCcw,
  Search,
  Sparkles,
  Layers,
  ChevronRight,
  Laptop,
  Plus,
  ListPlus,
  Trash2,
  Edit2,
  X,
  Folder,
} from 'lucide-react';
import {
  PriorityColors,
  DEFAULT_PRIORITY_COLORS,
  getTaskPriorityCardStyle,
} from '../../../utils/priorityColor';

export type SettingsTab = 'themes' | 'priority-colors' | 'lists' | 'general' | 'notifications';

export interface CustomListDefinition {
  id: string;
  title: string;
}

export interface SettingsViewProps {
  priorityColors: PriorityColors;
  onUpdatePriorityColors: (colors: PriorityColors) => void;
  user?: {
    id?: string;
    name: string;
    email?: string;
  };
  isPreview?: boolean;
  customLists?: CustomListDefinition[];
  onCreateList?: (title: string) => void;
  onRenameList?: (id: string, newTitle: string) => void;
  onDeleteList?: (id: string) => void;
}

export const ACCENT_PALETTES = [
  {
    id: 'blue',
    name: 'Cobalt Blue',
    hex: '#305fdd',
    bgHex: '#eef3ff',
    desc: 'Crisp, direct, and classic productivity tone. Ideal for clean modern workspaces.',
  },
  {
    id: 'indigo',
    name: 'Deep Indigo',
    hex: '#4338ca',
    bgHex: '#eef2ff',
    desc: 'Warm, refined, professional software tone. Higher contrast against white surfaces.',
  },
  {
    id: 'green',
    name: 'Forest Green',
    hex: '#247a56',
    bgHex: '#eaf6f0',
    desc: 'Calm, grounded, organic focus. Emphasizes steady progress and low-anxiety execution.',
  },
  {
    id: 'amber',
    name: 'Sunset Amber',
    hex: '#d97706',
    bgHex: '#fffbeb',
    desc: 'Warm and inviting focus. Great for high-energy creative environments.',
  },
  {
    id: 'rose',
    name: 'Rose Quartz',
    hex: '#e11d48',
    bgHex: '#fff1f2',
    desc: 'Vibrant and modern. Adds elegance and distinct visual pop to action items.',
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    hex: '#7c3aed',
    bgHex: '#f5f3ff',
    desc: 'Deep royal presence with a calm, intellectual visual balance.',
  },
];

const DEFAULT_LISTS: CustomListDefinition[] = [
  { id: 'personal', title: 'Personal & Routine' },
  { id: 'home', title: 'Household & Living' },
  { id: 'work', title: 'Work & Professional' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  priorityColors,
  onUpdatePriorityColors,
  user,
  isPreview = true,
  customLists = DEFAULT_LISTS,
  onCreateList,
  onRenameList,
  onDeleteList,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('themes');
  const [searchQuery, setSearchQuery] = useState('');

  // Task Lists state
  const [newListTitle, setNewListTitle] = useState('');
  const [listSuccessMsg, setListSuccessMsg] = useState<string | null>(null);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListTitle, setEditingListTitle] = useState('');

  const allLists = customLists && customLists.length > 0 ? customLists : DEFAULT_LISTS;

  const handleCreateNewList = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newListTitle.trim();
    if (!trimmed) return;
    if (onCreateList) {
      onCreateList(trimmed);
    }
    setNewListTitle('');
    setListSuccessMsg(`List "${trimmed}" created successfully!`);
    setTimeout(() => setListSuccessMsg(null), 3000);
  };

  const handleStartRename = (list: CustomListDefinition) => {
    setEditingListId(list.id);
    setEditingListTitle(list.title);
  };

  const handleSaveRename = (listId: string) => {
    const trimmed = editingListTitle.trim();
    if (trimmed && onRenameList) {
      onRenameList(listId, trimmed);
    }
    setEditingListId(null);
    setEditingListTitle('');
  };

  const handleCancelRename = () => {
    setEditingListId(null);
    setEditingListTitle('');
  };

  const handleDeleteCustomList = (listId: string) => {
    if (onDeleteList) {
      onDeleteList(listId);
    }
  };

  // Accent Theme
  const [activeAccent, setActiveAccent] = useState<string>(() => {
    try {
      return localStorage.getItem('vido_accent') || 'blue';
    } catch {
      return 'blue';
    }
  });

  const handleSelectAccent = (accentId: string) => {
    setActiveAccent(accentId);
    try {
      localStorage.setItem('vido_accent', accentId);
    } catch {}
    document.documentElement.setAttribute('data-accent', accentId);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', activeAccent);
  }, [activeAccent]);

  // Priority Colors state
  const highColor = priorityColors.high !== undefined ? priorityColors.high : DEFAULT_PRIORITY_COLORS.high;
  const midColor = priorityColors.medium !== undefined ? priorityColors.medium : DEFAULT_PRIORITY_COLORS.medium;
  const lowColor = priorityColors.low !== undefined ? priorityColors.low : DEFAULT_PRIORITY_COLORS.low;

  const handleSetHighColor = (c: string) => {
    onUpdatePriorityColors({ ...priorityColors, high: c });
  };

  const handleSetMidColor = (c: string) => {
    onUpdatePriorityColors({ ...priorityColors, medium: c });
  };

  const handleSetLowColor = (c: string) => {
    onUpdatePriorityColors({ ...priorityColors, low: c });
  };

  const handleResetPriorityColors = () => {
    onUpdatePriorityColors(DEFAULT_PRIORITY_COLORS);
  };

  // Nav items for left sub-navigation (Windows Settings style)
  const navItems: Array<{ id: SettingsTab; label: string; sublabel: string; icon: React.ElementType }> = [
    {
      id: 'themes',
      label: 'Themes & Appearance',
      sublabel: 'Accents, palette & theme',
      icon: Palette,
    },
    {
      id: 'priority-colors',
      label: 'Priority Colors',
      sublabel: 'Board card tints & badges',
      icon: Layers,
    },
    {
      id: 'lists',
      label: 'Task Lists',
      sublabel: 'Add & manage custom boards',
      icon: ListPlus,
    },
    {
      id: 'general',
      label: 'General & Profile',
      sublabel: 'Workspace info & account',
      icon: User,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      sublabel: 'Alerts & task reminders',
      icon: Bell,
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sublabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex-1 min-h-0 flex overflow-hidden bg-[var(--canvas)] animate-in fade-in duration-150">
      {/* Left Sidebar: Windows Settings Sub-Navigation */}
      <aside className="w-64 sm:w-72 shrink-0 border-r border-[var(--line)] bg-[var(--surface)] flex flex-col justify-between select-none">
        <div className="p-4 space-y-4">
          {/* User Profile Summary Card */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--canvas)] border border-[var(--line)]">
            <div className="w-9 h-9 rounded-full bg-[var(--accent)] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              {(user?.name || 'Alex Morgan')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-[var(--ink)] block truncate">
                {user?.name || 'Alex Morgan'}
              </span>
              <span className="text-[10px] text-[var(--muted)] block truncate">
                {isPreview ? 'Demo Workspace' : user?.email || 'alex.morgan@gmail.com'}
              </span>
            </div>
          </div>

          {/* Settings Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[var(--faint)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Find a setting..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--canvas)] border border-[var(--line)] rounded-xl text-[var(--ink)] placeholder-[var(--faint)] focus:outline-none focus:border-[var(--accent)] transition-all"
            />
          </div>

          {/* Navigation Items List */}
          <nav className="space-y-1 pt-1">
            {filteredNavItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold shadow-2xs border border-[var(--accent)]/20'
                      : 'text-[var(--ink)] hover:bg-[var(--canvas)] font-medium border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`} />
                    <div className="truncate">
                      <span className="text-xs block leading-tight truncate">{item.label}</span>
                      <span className="text-[10px] text-[var(--muted)] font-normal block leading-tight truncate mt-0.5">
                        {item.sublabel}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? 'text-[var(--accent)] translate-x-0.5' : 'text-[var(--faint)]'}`} />
                </button>
              );
            })}
          </nav>

          {/* Quick Add List Action in Sidebar */}
          <div className="pt-2">
            <button
              type="button"
              data-testid="sidebar-add-list-btn"
              onClick={() => {
                setActiveTab('lists');
                setTimeout(() => {
                  const input = document.getElementById('new-list-input');
                  input?.focus();
                }, 50);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border border-dashed border-[var(--line)] text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add list</span>
            </button>
          </div>
        </div>

        {/* Windows / ViDo build footnote */}
        <div className="p-4 border-t border-[var(--line)] text-[10px] text-[var(--muted)] flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <Laptop className="w-3.5 h-3.5 text-[var(--faint)]" />
            ViDo System v0.1.0
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-mono font-bold">
            Stable
          </span>
        </div>
      </aside>

      {/* Right Main Pane: Settings Content View */}
      <main className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-8 space-y-6">
        {/* TAB 1: THEMES & APPEARANCE */}
        {activeTab === 'themes' && (
          <div className="max-w-4xl space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--ink)]">Themes & Appearance</h2>
              <p className="text-xs text-[var(--muted)] mt-1">
                Customize your primary accent color palette, card highlights, and visual ambiance across ViDo.
              </p>
            </div>

            {/* Accent Palette Section */}
            <section className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <div>
                  <h3 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[var(--accent)]" />
                    <span>Accent Palette</span>
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    Select your primary system accent for buttons, badges, and active indicators.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/30">
                  {ACCENT_PALETTES.find((p) => p.id === activeAccent)?.name || 'Custom'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                {ACCENT_PALETTES.map((accent) => {
                  const isSelected = activeAccent === accent.id;
                  return (
                    <div
                      key={accent.id}
                      onClick={() => handleSelectAccent(accent.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/30 bg-[var(--accent-soft)]/20 shadow-xs'
                          : 'border-[var(--line)] hover:border-gray-300 bg-[var(--canvas)]/50 hover:bg-[var(--surface)]'
                      }`}
                      data-testid={`accent-card-${accent.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-[var(--ink)]">{accent.name}</span>
                        <div
                          className="w-5 h-5 rounded-full border border-black/10 shadow-2xs shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: accent.hex }}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                      </div>
                      <p className="text-[11px] text-[var(--muted)] leading-relaxed line-clamp-2">
                        {accent.desc}
                      </p>
                      <div className="mt-3 pt-2 border-t border-[var(--line)]/60 flex items-center justify-between text-[10px] font-mono text-[var(--faint)]">
                        <span>{accent.hex}</span>
                        <span className={`font-bold uppercase ${isSelected ? 'text-[var(--accent)]' : ''}`}>
                          {isSelected ? 'Active' : 'Select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Appearance Mode Section */}
            <section className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="pb-3 border-b border-[var(--line)]">
                <h3 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                  <span>Ambiance & Styling Mode</span>
                </h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  ViDo uses high-contrast clean card surfaces optimized for daylight readability and minimal distraction.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)]/20 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--ink)]">Standard Clean Workspace</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[11px] text-[var(--muted)]">
                    Optimal readability with natural card borders, delicate translucent priority tints, and aesthetic scrollbars.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--canvas)] space-y-2 opacity-75">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--ink)]">Dark High-Contrast Mode</span>
                    <span className="text-[9px] uppercase font-bold text-[var(--muted)] bg-[var(--line)] px-1.5 py-0.5 rounded">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--muted)]">
                    Deep charcoal night workspace for low-light focused productivity sessions.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: PRIORITY COLORS (Direct from AI Task Manager) */}
        {activeTab === 'priority-colors' && (
          <div className="max-w-4xl space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-[var(--ink)]">Priority Colors</h2>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Choose subtle translucent background tints and borders for tasks based on their priority level on your task boards.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetPriorityColors}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--ink)] bg-[var(--surface)] hover:bg-[var(--canvas)] border border-[var(--line)] rounded-xl font-medium transition-colors cursor-pointer shadow-2xs"
                title="Restore default priority color palette"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>
            </div>

            {/* High Priority Color Card */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 border border-black/10 shadow-2xs"
                    style={{ backgroundColor: highColor || 'transparent' }}
                  />
                  <h3 className="text-xs font-bold text-[var(--ink)]">High Priority Tasks</h3>
                </div>
                <span className="text-[10px] font-mono text-[var(--muted)] bg-[var(--canvas)] px-2 py-0.5 rounded border border-[var(--line)]">
                  {highColor ? highColor : 'None (Default)'}
                </span>
              </div>

              <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
                <button
                  type="button"
                  title="None (Neutral card)"
                  onClick={() => handleSetHighColor('')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                    !highColor
                      ? 'bg-[var(--ink)] text-[var(--surface)] border-[var(--ink)] shadow-2xs'
                      : 'bg-transparent text-[var(--muted)] border-[var(--line)] hover:border-gray-400'
                  }`}
                >
                  None
                </button>
                {[
                  { name: 'Red', hex: '#ef4444' },
                  { name: 'Rose', hex: '#f43f5e' },
                  { name: 'Orange', hex: '#f97316' },
                  { name: 'Crimson', hex: '#dc2626' },
                ].map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    title={preset.name}
                    onClick={() => handleSetHighColor(preset.hex)}
                    style={{ backgroundColor: preset.hex }}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer border border-black/10 shadow-2xs ${
                      highColor === preset.hex ? 'ring-2 ring-[var(--accent)] ring-offset-2 scale-110' : 'opacity-85 hover:opacity-100 hover:scale-105'
                    }`}
                  />
                ))}
                <label
                  title="Pick custom color"
                  className="w-6 h-6 rounded-full border border-[var(--line)] flex items-center justify-center cursor-pointer bg-[var(--canvas)] hover:bg-[var(--line)]/50 transition-colors shadow-2xs relative"
                >
                  <input
                    type="color"
                    value={highColor.startsWith('#') ? highColor : '#ef4444'}
                    onChange={(e) => handleSetHighColor(e.target.value)}
                    className="opacity-0 w-0 h-0 absolute pointer-events-none"
                  />
                  <span className="text-[10px] font-bold text-[var(--muted)]">+</span>
                </label>
              </div>
            </div>

            {/* Medium Priority Color Card */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 border border-black/10 shadow-2xs"
                    style={{ backgroundColor: midColor || 'transparent' }}
                  />
                  <h3 className="text-xs font-bold text-[var(--ink)]">Medium Priority Tasks</h3>
                </div>
                <span className="text-[10px] font-mono text-[var(--muted)] bg-[var(--canvas)] px-2 py-0.5 rounded border border-[var(--line)]">
                  {midColor ? midColor : 'None (Default)'}
                </span>
              </div>

              <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
                <button
                  type="button"
                  title="None (Neutral card)"
                  onClick={() => handleSetMidColor('')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                    !midColor
                      ? 'bg-[var(--ink)] text-[var(--surface)] border-[var(--ink)] shadow-2xs'
                      : 'bg-transparent text-[var(--muted)] border-[var(--line)] hover:border-gray-400'
                  }`}
                >
                  None
                </button>
                {[
                  { name: 'Yellow', hex: '#eab308' },
                  { name: 'Amber', hex: '#f59e0b' },
                  { name: 'Lime', hex: '#84cc16' },
                  { name: 'Orange', hex: '#fb923c' },
                ].map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    title={preset.name}
                    onClick={() => handleSetMidColor(preset.hex)}
                    style={{ backgroundColor: preset.hex }}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer border border-black/10 shadow-2xs ${
                      midColor === preset.hex ? 'ring-2 ring-[var(--accent)] ring-offset-2 scale-110' : 'opacity-85 hover:opacity-100 hover:scale-105'
                    }`}
                  />
                ))}
                <label
                  title="Pick custom color"
                  className="w-6 h-6 rounded-full border border-[var(--line)] flex items-center justify-center cursor-pointer bg-[var(--canvas)] hover:bg-[var(--line)]/50 transition-colors shadow-2xs relative"
                >
                  <input
                    type="color"
                    value={midColor.startsWith('#') ? midColor : '#eab308'}
                    onChange={(e) => handleSetMidColor(e.target.value)}
                    className="opacity-0 w-0 h-0 absolute pointer-events-none"
                  />
                  <span className="text-[10px] font-bold text-[var(--muted)]">+</span>
                </label>
              </div>
            </div>

            {/* Low Priority Color Card */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 border border-black/10 shadow-2xs"
                    style={{ backgroundColor: lowColor || 'transparent' }}
                  />
                  <h3 className="text-xs font-bold text-[var(--ink)]">Low Priority Tasks</h3>
                </div>
                <span className="text-[10px] font-mono text-[var(--muted)] bg-[var(--canvas)] px-2 py-0.5 rounded border border-[var(--line)]">
                  {lowColor ? lowColor : 'None (Default)'}
                </span>
              </div>

              <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
                <button
                  type="button"
                  title="None (Neutral card)"
                  onClick={() => handleSetLowColor('')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                    !lowColor
                      ? 'bg-[var(--ink)] text-[var(--surface)] border-[var(--ink)] shadow-2xs'
                      : 'bg-transparent text-[var(--muted)] border-[var(--line)] hover:border-gray-400'
                  }`}
                >
                  None
                </button>
                {[
                  { name: 'Emerald', hex: '#10b981' },
                  { name: 'Teal', hex: '#14b8a6' },
                  { name: 'Blue', hex: '#3b82f6' },
                  { name: 'Slate', hex: '#64748b' },
                ].map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    title={preset.name}
                    onClick={() => handleSetLowColor(preset.hex)}
                    style={{ backgroundColor: preset.hex }}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer border border-black/10 shadow-2xs ${
                      lowColor === preset.hex ? 'ring-2 ring-[var(--accent)] ring-offset-2 scale-110' : 'opacity-85 hover:opacity-100 hover:scale-105'
                    }`}
                  />
                ))}
                <label
                  title="Pick custom color"
                  className="w-6 h-6 rounded-full border border-[var(--line)] flex items-center justify-center cursor-pointer bg-[var(--canvas)] hover:bg-[var(--line)]/50 transition-colors shadow-2xs relative"
                >
                  <input
                    type="color"
                    value={lowColor.startsWith('#') ? lowColor : '#10b981'}
                    onChange={(e) => handleSetLowColor(e.target.value)}
                    className="opacity-0 w-0 h-0 absolute pointer-events-none"
                  />
                  <span className="text-[10px] font-bold text-[var(--muted)]">+</span>
                </label>
              </div>
            </div>

            {/* Live Preview of Minimal Task Cards (matching AI Task Manager) */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
                <span className="text-xs font-bold text-[var(--ink)]">Live Preview: How cards appear on your board</span>
                <span className="text-[10px] text-[var(--muted)]">Updates in real-time</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {/* High Priority Card Preview */}
                <div
                  style={getTaskPriorityCardStyle('high', priorityColors, false)}
                  className="rounded-2xl border p-3.5 transition-all shadow-xs space-y-2 bg-[var(--surface)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--ink)]">Submit Quarterly Review</span>
                    <span className="text-[10px] font-bold text-red-700 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                      High
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--muted)]">Due today at 17:00</p>
                </div>

                {/* Mid Priority Card Preview */}
                <div
                  style={getTaskPriorityCardStyle('medium', priorityColors, false)}
                  className="rounded-2xl border p-3.5 transition-all shadow-xs space-y-2 bg-[var(--surface)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--ink)]">Weekly Product Sync</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      Medium
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--muted)]">Tomorrow at 10:00</p>
                </div>

                {/* Low Priority Card Preview */}
                <div
                  style={getTaskPriorityCardStyle('low', priorityColors, false)}
                  className="rounded-2xl border p-3.5 transition-all shadow-xs space-y-2 bg-[var(--surface)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--ink)]">Organize Workspace Notes</span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                      Low
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--muted)]">No set deadline</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TASK LISTS & BOARDS */}
        {activeTab === 'lists' && (
          <div className="max-w-4xl space-y-6 animate-in fade-in duration-150">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[var(--ink)]">Task Lists & Boards</h2>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    Manage and create custom board columns to organize your tasks.
                  </p>
                </div>
              </div>
            </div>

            {/* Success feedback notice */}
            {listSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 shrink-0" />
                <span>{listSuccessMsg}</span>
              </div>
            )}

            {/* Create a New List Section */}
            <section className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                  <ListPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--ink)]">Create a New Board / List</h3>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    Add a new category list that will appear across your tasks board and filters.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateNewList} className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <input
                  id="new-list-input"
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="Enter list title (e.g. Project Apollo, College CIE, Gym & Fitness)..."
                  className="flex-1 bg-[var(--canvas)] border border-[var(--line)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--ink)] placeholder-[var(--faint)] focus:outline-none focus:border-[var(--accent)] transition-all"
                />
                <button
                  type="submit"
                  data-testid="create-list-submit-btn"
                  disabled={!newListTitle.trim()}
                  className="px-4 py-2.5 bg-[var(--accent)] hover:opacity-90 disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add list</span>
                </button>
              </form>
            </section>

            {/* Active Lists Directory */}
            <section className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <div>
                  <h3 className="text-sm font-bold text-[var(--ink)]">Active Lists & Boards</h3>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    {allLists.length} {allLists.length === 1 ? 'list' : 'lists'} configured in your workspace
                  </p>
                </div>
              </div>

              <div className="divide-y divide-[var(--line)]">
                {allLists.map((list) => {
                  const isEditing = editingListId === list.id;

                  return (
                    <div
                      key={list.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-[var(--canvas)] border border-[var(--line)] flex items-center justify-center shrink-0 text-[var(--muted)]">
                          <Folder className="w-4 h-4" />
                        </div>

                        {isEditing ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editingListTitle}
                              autoFocus
                              onChange={(e) => setEditingListTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(list.id);
                                if (e.key === 'Escape') handleCancelRename();
                              }}
                              className="w-full max-w-xs bg-[var(--canvas)] border border-[var(--line)] rounded-lg px-2.5 py-1 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveRename(list.id)}
                              className="p-1.5 text-white bg-[var(--accent)] hover:opacity-90 rounded-md text-xs cursor-pointer"
                              title="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelRename}
                              className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] bg-[var(--canvas)] rounded-md text-xs cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-[var(--ink)] truncate">
                                {list.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-[var(--faint)] block mt-0.5">
                              ID: {list.id}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => handleStartRename(list)}
                            className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--canvas)] rounded-lg transition-all cursor-pointer"
                            title="Rename List"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomList(list.id)}
                          className="p-1.5 text-[var(--muted)] hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                          title="Delete List"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* TAB 4: GENERAL & PROFILE */}
        {activeTab === 'general' && (
          <div className="max-w-4xl space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--ink)]">General & Profile</h2>
              <p className="text-xs text-[var(--muted)] mt-1">
                Manage your user identity, workspace session details, and default view settings.
              </p>
            </div>

            <section className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[var(--ink)]">Account Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--muted)]">Display Name</label>
                  <input
                    type="text"
                    disabled
                    value={user?.name || 'Alex Morgan'}
                    className="w-full bg-[var(--canvas)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] opacity-85"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--muted)]">Email Address</label>
                  <input
                    type="text"
                    disabled
                    value={user?.email || 'alex.morgan@gmail.com'}
                    className="w-full bg-[var(--canvas)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] opacity-85"
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="max-w-4xl space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--ink)]">System Notifications</h2>
              <p className="text-xs text-[var(--muted)] mt-1">
                Configure alert notifications and deadline reminders for upcoming tasks.
              </p>
            </div>

            <section className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <div>
                  <h3 className="text-sm font-bold text-[var(--ink)]">Deadline Reminders</h3>
                  <p className="text-xs text-[var(--muted)] mt-0.5">Alert before targeted tasks expire</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[var(--ink)]">Daily Agenda Digest</h3>
                  <p className="text-xs text-[var(--muted)] mt-0.5">Morning notification with scheduled duties</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Active
                </span>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};
