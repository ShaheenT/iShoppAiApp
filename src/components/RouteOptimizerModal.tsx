import React from 'react';
import { RouteOptimizerView } from './RouteOptimizerView.js';
import { ShoppingListItem, Special } from '../types/index.js';

interface RouteOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingListItem[];
  specials?: Special[];
  userCity?: string;
  onToggleItemCheck?: (itemId: string) => void;
}

export const RouteOptimizerModal: React.FC<RouteOptimizerModalProps> = ({
  isOpen,
  onClose,
  items,
  specials = [],
  userCity = 'Cape Town',
  onToggleItemCheck,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="route-optimizer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-6xl h-[92vh] max-h-[900px] flex flex-col">
        <RouteOptimizerView
          items={items}
          specials={specials}
          userCity={userCity}
          onClose={onClose}
          onToggleItemCheck={onToggleItemCheck}
        />
      </div>
    </div>
  );
};
