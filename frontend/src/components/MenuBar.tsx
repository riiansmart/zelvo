import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface MenuBarProps {
  onViewChange: (view: string) => void;
  onTimelineToggle: () => void;
}

interface MenuItem {
  label?: string;
  action?: () => void;
  type?: 'separator';
  submenu?: MenuItem[];
}

export function MenuBar({ onViewChange, onTimelineToggle }: MenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus: Record<string, MenuItem[]> = {
    file: [
      { label: 'New Task', action: () => console.log('New Task') },
      { label: 'Open Folder', action: () => console.log('Open Folder') },
      { label: 'Save Layout', action: () => console.log('Save Layout') },
      { type: 'separator' },
      { label: 'Exit', action: () => console.log('Exit') }
    ],
    edit: [
      { label: 'Undo', action: () => console.log('Undo') },
      { label: 'Redo', action: () => console.log('Redo') },
      { type: 'separator' },
      { label: 'Cut', action: () => console.log('Cut') },
      { label: 'Copy', action: () => console.log('Copy') },
      { label: 'Paste', action: () => console.log('Paste') }
    ],
    view: [
      { label: 'Explorer', action: () => onViewChange('explorer') },
      { label: 'Search', action: () => onViewChange('search') },
      { label: 'Properties', action: () => onViewChange('properties') },
      { type: 'separator' },
      { label: 'Toggle Timeline', action: onTimelineToggle }
    ]
  };

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleMenuItemClick = (action?: () => void) => {
    if (action) {
      action();
      setActiveMenu(null);
    }
  };

  return (
    <div className="menu-bar bg-secondary border-b border-default">
      <div className="flex items-center h-9">
        {Object.entries(menus).map(([name, items]) => (
          <div key={name} className="relative">
            <button
              className={`px-4 h-full text-sm hover:bg-hover transition-colors duration-150
                ${activeMenu === name ? 'bg-hover text-primary' : 'text-secondary hover:text-primary'}`}
              onClick={() => handleMenuClick(name)}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </button>
            
            {activeMenu === name && (
              <div className="absolute top-full left-0 bg-secondary border border-default shadow-lg rounded-md py-1 z-50 min-w-[220px]">
                {items.map((item, index) => (
                  item.type === 'separator' ? (
                    <div key={index} className="border-t border-default my-1" />
                  ) : (
                    <button
                      key={index}
                      className="w-full px-4 py-1.5 text-left text-sm text-secondary hover:text-primary hover:bg-hover flex items-center justify-between group transition-colors duration-150"
                      onClick={() => handleMenuItemClick(item.action)}
                    >
                      <span>{item.label}</span>
                      {item.submenu && (
                        <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary" />
                      )}
                    </button>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 