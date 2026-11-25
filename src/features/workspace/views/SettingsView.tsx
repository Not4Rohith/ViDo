import React, { useState } from 'react';
import {
  Palette,
  User,
  Sliders,
  Check,
  CheckCircle2,
  Shield,
  Sparkles,
  LogOut,
  RotateCcw,
  Tag,
  Plus,
  Trash2,
  Search,
  Layers,
  ListPlus,
  Edit2,
  X,
  Folder,
} from 'lucide-react';
import { Button, Badge, Input } from '../../../components/ui';
import {
  DEFAULT_CATEGORIES,
  CATEGORY_COLOR_OPTIONS,
  type UserCategory,
} from '../../../data/categories';
import {
  PriorityColors,
  DEFAULT_PRIORITY_COLORS,
  getTaskPriorityCardStyle,
} from '../../../utils/priorityColor';

export type AccentCandidate = 'blue' | 'indigo' | 'green';

export const ACCENTS: {
  id: AccentCandidate;
  name: string;
  hex: string;
  bgHex: string;
  desc: string;
}[] = [
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
];

export type SettingsSection =
  | 'account'
  | 'theme'
  | 'priority-colors'
  | 'lists'
  | 'categories'
  | 'preferences'
  | 'workspace';

export interface CustomListDefinition {
  id: string;
  title: string;
}

const DEFAULT_LISTS: CustomListDefinition[] = [
  { id: 'personal', title: 'Personal & Routine' },
  { id: 'home', title: 'Household & Living' },
  { id: 'work', title: 'Work & Professional' },
];

export interface SettingsSectionItem {
  id: SettingsSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const SETTINGS_SECTIONS: SettingsSectionItem[] = [
  {
    id: 'account',
    label: 'Account',
    icon: User,
    description: 'Profile identity, initials, and session info',
  },
  {
    id: 'theme',
    label: 'Theme & Appearance',
    icon: Palette,
    description: 'Accent colors, contrast, and visual styling',
  },
  {
    id: 'priority-colors',
    label: 'Priority Colors',
    icon: Layers,
    description: 'Board task card priority color coding',
  },
  {
    id: 'lists',
    label: 'Task Lists',
    icon: ListPlus,
    description: 'Create, rename & manage board lists',
  },
  {
    id: 'categories',
    label: 'Personalised Categories',
    icon: Tag,
    description: 'Custom categories stored in your database',
  },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: Sliders,
    description: 'Default categories, priorities, and deadlines',
  },
  {
    id: 'workspace',
    label: 'Workspace Actions',
    icon: Shield,
    description: 'Demo resets and session sign out',
  },
];

export interface SettingsViewProps {
  isPreview?: boolean;
  basePath?: string;
  initialSection?: SettingsSection;
  user?: {
    id?: string;
    name: string;
    email?: string;
  };
  categories?: UserCategory[];
  onAddCategory?: (params: { name: string; color?: string }) => Promise<UserCategory> | UserCategory;
  onDeleteCategory?: (categoryId: string) => Promise<void> | void;
  onSignOut?: () => void;
  isModal?: boolean;
  onClose?: () => void;
  priorityColors?: PriorityColors;
  onUpdatePriorityColors?: (colors: PriorityColors) => void;
  customLists?: CustomListDefinition[];
  onCreateList?: (title: string) => void;
  onRenameList?: (id: string, newTitle: string) => void;
  onDeleteList?: (id: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isPreview = true,
  initialSection = 'account',
  user,
  categories = DEFAULT_CATEGORIES,
  onAddCategory,
  onDeleteCategory,
  onSignOut,
  isModal = false,
  priorityColors = DEFAULT_PRIORITY_COLORS,
  onUpdatePriorityColors,
  customLists = DEFAULT_LISTS,
  onCreateList,
  onRenameList,
  onDeleteList,
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>(initialSection);
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

  // Priority Colors state
  const highColor = priorityColors.high !== undefined ? priorityColors.high : DEFAULT_PRIORITY_COLORS.high;
  const midColor = priorityColors.medium !== undefined ? priorityColors.medium : DEFAULT_PRIORITY_COLORS.medium;
  const lowColor = priorityColors.low !== undefined ? priorityColors.low : DEFAULT_PRIORITY_COLORS.low;

  const handleSetHighColor = (c: string) => {
    onUpdatePriorityColors && onUpdatePriorityColors({ ...priorityColors, high: c });
  };

  const handleSetMidColor = (c: string) => {
    onUpdatePriorityColors && onUpdatePriorityColors({ ...priorityColors, medium: c });
  };

  const handleSetLowColor = (c: string) => {
    onUpdatePriorityColors && onUpdatePriorityColors({ ...priorityColors, low: c });
  };

  const handleResetPriorityColors = () => {
    onUpdatePriorityColors && onUpdatePriorityColors(DEFAULT_PRIORITY_COLORS);
  };

  const filteredSections = SETTINGS_SECTIONS.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Theme state
  const [activeAccent, setActiveAccent] = useState<AccentCandidate>(() => {
    try {
      const saved = localStorage.getItem('vido_accent') as AccentCandidate;
      if (saved && (saved === 'blue' || saved === 'indigo' || saved === 'green')) {
        return saved;
      }
    } catch {
      // ignore
    }
    return (document.documentElement.getAttribute('data-accent') as AccentCandidate) || 'blue';
  });

  // Profile state
  const [displayName, setDisplayName] = useState(user?.name || 'Demo User');
  const [profileSaved, setProfileSaved] = useState(false);

  // Preference state
  const [defaultCategory, setDefaultCategory] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('vido_pref_category');
      if (saved) return saved;
    } catch {}
    return 'personal';
  });

  const [defaultPriority, setDefaultPriority] = useState<'low' | 'medium' | 'high'>(() => {
    try {
      const saved = localStorage.getItem('vido_pref_priority');
      if (saved === 'low' || saved === 'medium' || saved === 'high') return saved;
    } catch {}
    return 'medium';
  });

  const [defaultDueTime, setDefaultDueTime] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('vido_pref_duetime');
      if (saved) return saved;
    } catch {}
    return '23:59';
  });

  const [prefsSaved, setPrefsSaved] = useState(false);
  const [resetNotice, setResetNotice] = useState(false);

  // Custom Category creation state
  const [newCatName, setNewCatName] = useState('');
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLOR_OPTIONS[0].hex);
  const [catCreationNotice, setCatCreationNotice] = useState<string | null>(null);

  const handleSelectAccent = (accentId: AccentCandidate) => {
    setActiveAccent(accentId);
    document.documentElement.setAttribute('data-accent', accentId);
    try {
      localStorage.setItem('vido_accent', accentId);
    } catch {
      // ignore
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('vido_user_display_name', displayName);
    } catch {}
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('vido_pref_category', defaultCategory);
      localStorage.setItem('vido_pref_priority', defaultPriority);
      localStorage.setItem('vido_pref_duetime', defaultDueTime);
    } catch {}
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 3000);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;

    if (onAddCategory) {
      try {
        await onAddCategory({ name: trimmed, color: selectedColor });
        setNewCatName('');
        setCatCreationNotice(`Category "${trimmed}" saved to your personal database.`);
        setTimeout(() => setCatCreationNotice(null), 3000);
      } catch (err: any) {
        setCatCreationNotice(err?.message || 'Failed to create category.');
      }
    }
  };

  const handleDeleteCustomCategory = async (catId: string, catName: string) => {
    if (window.confirm(`Delete the custom category "${catName}"?`)) {
      if (onDeleteCategory) {
        await onDeleteCategory(catId);
      }
    }
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all demo tasks back to original template values?')) {
      try {
        localStorage.removeItem('vido_live_workspace_tasks');
        localStorage.removeItem('vido-demo-custom-categories-v1');
      } catch {}
      setResetNotice(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-[var(--surface)] text-[var(--ink)] ${isModal ? '' : 'p-6 sm:p-10 max-w-5xl mx-auto space-y-6'}`}>
      {/* Standalone View Header */}
      {!isModal && (
        <div className="border-b border-[var(--line)] pb-5">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)]">Settings</h1>
          <p className="text-sm text-[var(--muted)] mt-1.5 leading-relaxed max-w-2xl">
            Configure your workspace account, theme appearance, personalized categories, and planning defaults.
          </p>
        </div>
      )}

      {/* YouTube Studio Two-Column Layout */}
      <div className={`flex flex-1 min-h-0 ${isModal ? 'h-full' : 'border border-[var(--line)] rounded-2xl overflow-hidden shadow-xs h-[640px]'}`}>
        {/* Left Column Navigation (Sections) */}
        <nav
          aria-label="Settings sections"
          role="tablist"
          className="w-52 sm:w-60 border-r border-[var(--line)] bg-[var(--canvas)]/40 p-2.5 sm:p-3 flex flex-col justify-between shrink-0 overflow-y-auto"
        >
          <div className="space-y-2">
            {/* Search Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[var(--faint)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find a setting..."
                className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[var(--ink)] placeholder-[var(--faint)] focus:outline-none focus:border-[var(--accent)] transition-all"
              />
            </div>

            <div className="space-y-1">
              {filteredSections.map((section) => {
                const Icon = section.icon;
                const isCurrent = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    role="tab"
                    id={`tab-${section.id}`}
                    aria-selected={isCurrent}
                    aria-controls={`panel-${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left ${
                      isCurrent
                        ? 'bg-[var(--accent)] text-white shadow-xs font-bold'
                        : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-white' : 'text-[var(--muted)]'}`} />
                    <span className="truncate">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[var(--line)]">
            <button
              type="button"
              data-testid="sidebar-add-list-btn"
              onClick={() => setActiveSection('lists')}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--accent)] bg-[var(--accent-soft)]/60 hover:bg-[var(--accent-soft)] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add list</span>
            </button>
          </div>
        </nav>

        {/* Right Column Content Area */}
        <div
          role="tabpanel"
          id={`panel-${activeSection}`}
          aria-labelledby={`tab-${activeSection}`}
          className="flex-1 p-6 sm:p-8 overflow-y-auto min-w-0 bg-[var(--surface)]"
        >
          {/* SECTION 1: Account */}
          {activeSection === 'account' && (
            <section aria-labelledby="profile-settings-heading" className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 id="profile-settings-heading" className="text-2xl font-bold tracking-tight text-[var(--ink)]">
                  Profile & Identity
                </h2>
                <p className="text-sm text-[var(--muted)] mt-1">
                  Manage your personal workspace identity, avatar initials, and active session details.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-5">
                <div className="flex items-center gap-4 pb-4 border-b border-[var(--line)]">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--accent)] text-white font-black text-xl flex items-center justify-center shadow-xs">
                    {(displayName || 'Demo User')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[var(--ink)]">{displayName}</p>
                    <p className="text-sm text-[var(--muted)]">{user?.email || 'demo@vido.app'}</p>
                    <div className="mt-1">
                      {isPreview ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-400 text-amber-950">
                          <Shield className="w-3 h-3" /> DEMO ENVIRONMENT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-700 border border-emerald-500/30">
                          <Shield className="w-3 h-3" /> AUTHENTICATED WORKSPACE
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your full name"
                  />
                  <Input
                    label="Email Address"
                    value={user?.email || 'demo@vido.app'}
                    disabled
                    helperText="Email cannot be changed directly in this environment"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    {profileSaved && (
                      <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5 animate-in fade-in duration-150">
                        <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
                      </span>
                    )}
                  </div>
                  <Button type="submit" variant="primary" size="md" className="px-5 py-2.5 text-sm font-semibold">
                    Save Profile
                  </Button>
                </div>
              </form>
            </section>
          )}

          {/* SECTION 2: Theme & Appearance */}
          {activeSection === 'theme' && (
            <section aria-labelledby="theme-settings-heading" className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 id="theme-settings-heading" className="text-2xl font-bold tracking-tight text-[var(--ink)]">
                  Appearance & Themes
                </h2>
                <p className="text-sm text-[var(--muted)] mt-1">
                  Select an accent color palette. The selected theme applies instantly across all buttons, badges, and active navigation indicators.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {ACCENTS.map((accent) => {
                  const isSelected = activeAccent === accent.id;
                  return (
                    <div
                      key={accent.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      onClick={() => handleSelectAccent(accent.id)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectAccent(accent.id)}
                      className={`p-5 rounded-2xl border bg-[var(--surface)] cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[var(--accent)] ring-2 ring-[var(--accent)] shadow-md'
                          : 'border-[var(--line)] hover:border-gray-300 hover:shadow-xs'
                      }`}
                      data-testid={`accent-card-${accent.id}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: accent.hex }}
                          />
                          <span className="font-bold text-base text-[var(--ink)]">{accent.name}</span>
                        </div>
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-soft)] px-2.5 py-0.5 rounded-full">
                            <Check className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--faint)] font-mono uppercase">Select</span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">{accent.desc}</p>
                      <div className="flex items-center justify-between text-xs font-mono text-[var(--faint)] border-t border-[var(--line)] pt-3">
                        <span>Hex {accent.hex}</span>
                        <span
                          className="w-12 h-3 rounded-full"
                          style={{ backgroundColor: accent.bgHex }}
                          title={`Background soft: ${accent.bgHex}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Theme Preview */}
              <div className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[var(--accent)]" /> Live Theme Preview
                  </span>
                  <Badge variant="accent">Previewing: {activeAccent.toUpperCase()}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button variant="primary" size="md">
                    Primary Button
                  </Button>
                  <Button variant="secondary" size="md">
                    Secondary Button
                  </Button>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/30">
                    Interactive Tag
                  </span>
                  <span className="text-sm font-semibold text-[var(--accent)] underline cursor-pointer">
                    Accent Hyperlink
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 3: Categories */}
          {activeSection === 'categories' && (
            <section aria-labelledby="custom-categories-heading" className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 id="custom-categories-heading" className="text-2xl font-bold tracking-tight text-[var(--ink)]">
                  Personalised Categories
                </h2>
                <p className="text-sm text-[var(--muted)] mt-1">
                  Create user-specific categories stored in your personal database. These appear throughout your workspace, filter menus, and task forms.
                </p>
              </div>

              {/* Create Category Form */}
              {onAddCategory && (
                <form
                  onSubmit={handleCreateCategory}
                  className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-4"
                >
                  <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[var(--accent)]" /> Add New Category
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div className="sm:col-span-2">
                      <Input
                        label="Category Name *"
                        placeholder="e.g., Health & Wellness, Finance, Research"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[var(--muted)] mb-1.5">
                        Color Accent
                      </label>
                      <div className="flex items-center gap-2 h-[42px] px-2 bg-[var(--canvas)] rounded-xl border border-[var(--line)]">
                        {CATEGORY_COLOR_OPTIONS.slice(0, 6).map((colorOpt) => (
                          <button
                            key={colorOpt.hex}
                            type="button"
                            aria-label={`Color ${colorOpt.name}`}
                            onClick={() => setSelectedColor(colorOpt.hex)}
                            className={`w-6 h-6 rounded-full cursor-pointer transition-all ${
                              selectedColor === colorOpt.hex
                                ? 'ring-2 ring-[var(--accent)] ring-offset-1 scale-110'
                                : 'hover:scale-105 opacity-80'
                            }`}
                            style={{ backgroundColor: colorOpt.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      {catCreationNotice && (
                        <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5 animate-in fade-in duration-150">
                          <CheckCircle2 className="w-4 h-4" /> {catCreationNotice}
                        </span>
                      )}
                    </div>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={!newCatName.trim()}
                      className="px-5 py-2.5 text-sm font-semibold"
                    >
                      Create Category
                    </Button>
                  </div>
                </form>
              )}

              {/* Categories List */}
              <div className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
                <h3 className="text-base font-bold text-[var(--ink)] mb-3">
                  Active Categories ({categories.length})
                </h3>

                <div className="divide-y divide-[var(--line)]">
                  {categories.map((cat) => (
                    <div key={cat.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                          style={{ backgroundColor: cat.color || '#305fdd' }}
                        />
                        <div>
                          <span className="font-semibold text-sm text-[var(--ink)] block truncate">
                            {cat.name}
                          </span>
                          <span className="text-xs font-mono text-[var(--faint)] block">
                            id: {cat.id}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {cat.isCustom ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-700 border border-indigo-500/20">
                            Personalized
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)]">
                            System Default
                          </span>
                        )}

                        {cat.isCustom && onDeleteCategory && (
                          <button
                            type="button"
                            aria-label={`Delete ${cat.name} category`}
                            onClick={() => handleDeleteCustomCategory(cat.id, cat.name)}
                            className="p-1.5 text-[var(--muted)] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* SECTION 4: Preferences */}
          {activeSection === 'preferences' && (
            <section aria-labelledby="preferences-settings-heading" className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 id="preferences-settings-heading" className="text-2xl font-bold tracking-tight text-[var(--ink)]">
                  Task & Planning Preferences
                </h2>
                <p className="text-sm text-[var(--muted)] mt-1">
                  Configure default values pre-filled when creating new responsibilities.
                </p>
              </div>

              <form onSubmit={handleSavePreferences} className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="pref-category" className="block text-sm font-semibold text-[var(--muted)] mb-1.5">
                      Default Category
                    </label>
                    <select
                      id="pref-category"
                      value={defaultCategory}
                      onChange={(e) => setDefaultCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] rounded-xl focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} {cat.isCustom ? '★' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pref-priority" className="block text-sm font-semibold text-[var(--muted)] mb-1.5">
                      Default Priority
                    </label>
                    <select
                      id="pref-priority"
                      value={defaultPriority}
                      onChange={(e) => setDefaultPriority(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] rounded-xl focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pref-duetime" className="block text-sm font-semibold text-[var(--muted)] mb-1.5">
                      Default Due Time
                    </label>
                    <select
                      id="pref-duetime"
                      value={defaultDueTime}
                      onChange={(e) => setDefaultDueTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] rounded-xl focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                    >
                      <option value="23:59">23:59 (End of Day)</option>
                      <option value="17:00">17:00 (End of Business)</option>
                      <option value="12:00">12:00 (Noon)</option>
                      <option value="09:00">09:00 (Morning)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    {prefsSaved && (
                      <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5 animate-in fade-in duration-150">
                        <CheckCircle2 className="w-4 h-4" /> Preferences saved!
                      </span>
                    )}
                  </div>
                  <Button type="submit" variant="primary" size="md" className="px-5 py-2.5 text-sm font-semibold">
                    Save Preferences
                  </Button>
                </div>
              </form>
            </section>
          )}

          {/* SECTION 5: Workspace Actions */}
          {activeSection === 'workspace' && (
            <section aria-labelledby="workspace-actions-heading" className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 id="workspace-actions-heading" className="text-2xl font-bold tracking-tight text-[var(--ink)]">
                  Workspace Actions
                </h2>
                <p className="text-sm text-[var(--muted)] mt-1">
                  Manage high-level workspace maintenance and session termination.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] divide-y divide-[var(--line)]">
                {isPreview && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
                    <div>
                      <p className="text-base font-bold text-[var(--ink)]">Reset Demo Workspace</p>
                      <p className="text-sm text-[var(--muted)] mt-0.5">
                        Restores all demo tasks and planning fixtures back to default baseline.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={handleResetDemoData}
                      className="text-amber-700 border-amber-300 hover:bg-amber-50 shrink-0"
                    >
                      <RotateCcw className="w-4 h-4 mr-1.5" /> Reset Demo Data
                    </Button>
                  </div>
                )}

                {resetNotice && (
                  <div className="py-3 text-sm text-amber-700 font-semibold animate-pulse">
                    Resetting demo workspace data...
                  </div>
                )}

                {onSignOut && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5">
                    <div>
                      <p className="text-base font-bold text-[var(--ink)]">Sign Out of Session</p>
                      <p className="text-sm text-[var(--muted)] mt-0.5">
                        Securely end your current workspace session on this browser.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={onSignOut}
                      className="text-red-600 border-red-200 hover:bg-red-50 shrink-0"
                    >
                      <LogOut className="w-4 h-4 mr-1.5" /> Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SECTION: Priority Colors */}
          {activeSection === 'priority-colors' && (
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

              {/* Live Preview of Minimal Task Cards */}
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
                  <span className="text-xs font-bold text-[var(--ink)]">Live Preview: How cards appear on your board</span>
                  <span className="text-[10px] text-[var(--muted)]">Updates in real-time</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
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

          {/* SECTION: Task Lists & Boards */}
          {activeSection === 'lists' && (
            <div className="max-w-4xl space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-[var(--ink)]">Task Lists & Boards</h2>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Manage and create custom board columns to organize your tasks.
                </p>
              </div>

              {listSuccessMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{listSuccessMsg}</span>
                </div>
              )}

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
        </div>
      </div>
    </div>
  );
};
