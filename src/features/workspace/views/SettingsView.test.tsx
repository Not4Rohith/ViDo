// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsView } from './SettingsView';
import { DEFAULT_PRIORITY_COLORS } from '../../../utils/priorityColor';

describe('SettingsView Component', () => {
  it('renders Windows Settings sidebar navigation and default Themes tab', () => {
    const handleUpdate = vi.fn();
    render(
      <SettingsView
        priorityColors={DEFAULT_PRIORITY_COLORS}
        onUpdatePriorityColors={handleUpdate}
      />
    );

    // Sidebar items
    expect(screen.getByRole('button', { name: /themes & appearance/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /priority colors/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /task lists/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /general & profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument();

    // Default Themes tab content
    expect(screen.getByRole('heading', { name: /themes & appearance/i })).toBeInTheDocument();
    expect(screen.getAllByText('Cobalt Blue').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Deep Indigo')).toBeInTheDocument();
    expect(screen.getByText('Forest Green')).toBeInTheDocument();
  });

  it('switches to Priority Colors tab and renders color pickers and live card previews', () => {
    const handleUpdate = vi.fn();
    render(
      <SettingsView
        priorityColors={DEFAULT_PRIORITY_COLORS}
        onUpdatePriorityColors={handleUpdate}
      />
    );

    // Click Priority Colors tab in left sub-nav
    const priorityTabBtn = screen.getByRole('button', { name: /priority colors/i });
    fireEvent.click(priorityTabBtn);

    // Verify Priority Colors view
    expect(screen.getByRole('heading', { name: /^priority colors$/i })).toBeInTheDocument();
    expect(screen.getByText('High Priority Tasks')).toBeInTheDocument();
    expect(screen.getByText('Medium Priority Tasks')).toBeInTheDocument();
    expect(screen.getByText('Low Priority Tasks')).toBeInTheDocument();

    // Presets are present
    expect(screen.getByTitle('Red')).toBeInTheDocument();
    expect(screen.getByTitle('Yellow')).toBeInTheDocument();
    expect(screen.getByTitle('Emerald')).toBeInTheDocument();

    // Click Crimson preset for High Priority
    const crimsonBtn = screen.getByTitle('Crimson');
    fireEvent.click(crimsonBtn);
    expect(handleUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        high: '#dc2626',
      })
    );

    // Live preview cards are rendered
    expect(screen.getByText(/live preview: how cards appear on your board/i)).toBeInTheDocument();
    expect(screen.getByText('Submit Quarterly Review')).toBeInTheDocument();
    expect(screen.getByText('Weekly Product Sync')).toBeInTheDocument();
    expect(screen.getByText('Organize Workspace Notes')).toBeInTheDocument();
  });

  it('allows selecting an accent in Themes tab and updates data-accent attribute', () => {
    const handleUpdate = vi.fn();
    render(
      <SettingsView
        priorityColors={DEFAULT_PRIORITY_COLORS}
        onUpdatePriorityColors={handleUpdate}
      />
    );

    // Click Forest Green accent card
    const greenCard = screen.getByTestId('accent-card-green');
    fireEvent.click(greenCard);

    expect(document.documentElement.getAttribute('data-accent')).toBe('green');
  });

  it('filters navigation items based on search query', () => {
    const handleUpdate = vi.fn();
    render(
      <SettingsView
        priorityColors={DEFAULT_PRIORITY_COLORS}
        onUpdatePriorityColors={handleUpdate}
      />
    );

    const searchInput = screen.getByPlaceholderText('Find a setting...');
    fireEvent.change(searchInput, { target: { value: 'priority' } });

    expect(screen.getByRole('button', { name: /priority colors/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /notifications/i })).not.toBeInTheDocument();
  });

  it('resets priority colors to default when Reset to Defaults is clicked', () => {
    const handleUpdate = vi.fn();
    render(
      <SettingsView
        priorityColors={{ high: '#000000', medium: '#111111', low: '#222222' }}
        onUpdatePriorityColors={handleUpdate}
      />
    );

    // Go to Priority Colors
    fireEvent.click(screen.getByRole('button', { name: /priority colors/i }));

    const resetBtn = screen.getByRole('button', { name: /reset to defaults/i });
    fireEvent.click(resetBtn);

    expect(handleUpdate).toHaveBeenCalledWith(DEFAULT_PRIORITY_COLORS);
  });

  it('switches to Task Lists tab and supports adding a new list', () => {
    const handleCreateList = vi.fn();
    render(
      <SettingsView
        priorityColors={DEFAULT_PRIORITY_COLORS}
        onUpdatePriorityColors={vi.fn()}
        onCreateList={handleCreateList}
      />
    );

    // Switch to Task Lists tab
    fireEvent.click(screen.getByRole('button', { name: /task lists/i }));

    expect(screen.getByRole('heading', { name: /task lists & boards/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter list title/i)).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/enter list title/i);
    fireEvent.change(input, { target: { value: 'Academics & Research' } });

    const addBtn = screen.getByTestId('create-list-submit-btn');
    fireEvent.click(addBtn);

    expect(handleCreateList).toHaveBeenCalledWith('Academics & Research');
    expect(screen.getByText(/created successfully/i)).toBeInTheDocument();
  });

  it('supports quick Add list button in the sidebar', () => {
    render(
      <SettingsView
        priorityColors={DEFAULT_PRIORITY_COLORS}
        onUpdatePriorityColors={vi.fn()}
      />
    );

    const quickAddBtn = screen.getByTestId('sidebar-add-list-btn');
    fireEvent.click(quickAddBtn);

    expect(screen.getByRole('heading', { name: /task lists & boards/i })).toBeInTheDocument();
  });

  it('supports renaming and deleting lists in Task Lists tab', () => {
    const handleRenameList = vi.fn();
    const handleDeleteList = vi.fn();
    const customLists = [
      { id: 'personal', title: 'Personal & Routine' },
      { id: 'custom-1', title: 'Coders High' },
    ];

    render(
      <SettingsView
        priorityColors={DEFAULT_PRIORITY_COLORS}
        onUpdatePriorityColors={vi.fn()}
        customLists={customLists}
        onRenameList={handleRenameList}
        onDeleteList={handleDeleteList}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /task lists/i }));

    // Rename Coders High
    const renameButtons = screen.getAllByTitle('Rename List');
    fireEvent.click(renameButtons[1]); // second list

    const editInput = screen.getByDisplayValue('Coders High');
    fireEvent.change(editInput, { target: { value: 'Coders Elite' } });
    fireEvent.click(screen.getByTitle('Save'));

    expect(handleRenameList).toHaveBeenCalledWith('custom-1', 'Coders Elite');

    // Ensure no Default or Custom badges are shown
    expect(screen.queryByText('Default')).not.toBeInTheDocument();
    expect(screen.queryByText('Custom')).not.toBeInTheDocument();

    // Delete list (all lists are now deletable!)
    const deleteBtns = screen.getAllByTitle('Delete List');
    expect(deleteBtns).toHaveLength(2);
    fireEvent.click(deleteBtns[1]);

    expect(handleDeleteList).toHaveBeenCalledWith('custom-1');
  });
});
