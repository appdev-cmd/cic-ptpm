import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableColumnProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export default function DroppableColumn({ id, children, className }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`flex-1 flex flex-col space-y-3 pr-1 pb-10 transition-colors duration-200 ${className} ${isOver ? 'bg-bd/10 rounded-xl' : ''}`}
    >
      {children}
    </div>
  );
}
